# Architecture

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | **Next.js** (App Router) + **TypeScript** | Server components + route handlers. |
| Styling | **Tailwind CSS** + **shadcn/ui** | Editorial, reading-room aesthetic (see UX). |
| Backend / DB | **Supabase** — Postgres, Auth, Row-Level Security, Storage | Auth + RLS give us multi-tenant isolation cheaply. |
| LLM | **OpenAI** behind a provider-abstraction interface | Swappable; every call uses structured output + Zod. |
| Grounding | **Web-search API** (Exa / Tavily / Brave) | Required so curation returns _real_ resources, not hallucinated links. |
| Jobs | **Inngest** | Durable, retryable step-functions for slow multi-step AI work. |
| Hosting | **Vercel** | Next.js-native; Inngest integrates cleanly. |

### Why the two additions to the requested stack

- **Web-search/grounding API.** The single biggest risk in this product is curation. A raw
  LLM will confidently emit dead links, hallucinated book editions, and moved course URLs,
  and its training cutoff blinds it to recent material. Grounding proposals in real search
  results + a link-health check is what makes curation trustworthy.
- **Inngest.** Curriculum generation takes ~30s–2min. That cannot run inside a Vercel
  serverless request (timeouts) and shouldn't block the UI. Inngest gives durable retries,
  step memoization, and observability without hand-rolling a queue.

Everything else in the requested stack is kept as-is.

## Data model

Three **shared** tables (verification/knowledge cost amortized across all users) plus
user-scoped tables protected by RLS.

### Shared (read-only to users; written by service role)
- **`domains`** — the seeded subjects.
- **`concepts`** — `domain_id`, `name`, `description`; plus **`concept_prerequisites(concept_id, prereq_id)`**.
  This is the minimal knowledge-graph skeleton that gives "mastery" something to attach to.
- **`resources`** — the verified free-resource catalog: `type` (book/course/video/article/doc/project/textbook),
  `title`, `provider`, `url`, `is_free`, `license`, `difficulty`, `est_hours`, `quality_score`,
  `verification_status`, `last_verified_at`. Shared + cached: a given MIT lecture is verified
  once and reused everywhere.

### User-scoped (RLS by `user_id`)
- **`profiles`** (1:1 with `auth.users`) — display name, timezone, weekly time budget, preferences.
- **`goals`** — title, target outcome, motivation, self-rated level, hours/week, target date, status.
- **`curricula`** — `goal_id`, title, status (draft/active/archived), version, `rationale`.
- **`modules`** — `curriculum_id`, `order_index`, title, `learning_objectives` (jsonb), `est_hours`, status.
- **`module_concepts`** — module ↔ concept.
- **`module_resources`** — module ↔ resource, `order`, `required`, `rationale` ("why this one").
- **`resource_engagements`** — status per assigned resource (not_started/in_progress/done),
  self-reported time, notes.
- **`mastery`** — per (`user_id`, `concept_id`): `score` [0,1], `confidence`, `last_evaluated_at`. **Derived, decaying.**
- **`mastery_events`** — append-only evidence: type (quiz/project/self_assessment), score,
  weight, `source_id`, `occurred_at`. Mastery is computed from this, never written directly.
- **`quizzes`** → **`quiz_questions`** (concept-tagged; mcq/short/reasoning; rubric) →
  **`quiz_attempts`** (answers, AI evaluation, per-concept scores, feedback).
- **`curriculum_revisions`** — every adaptation, with a human-readable _why_ the learner can read.

### Fast-follow tables
`reflections`, `project_milestones`, `weekly_reviews`.

### RLS principle
Shared tables: `select` for authenticated users, writes only via service role.
User tables: `user_id = auth.uid()` on every policy. No user can read another user's rows.

## AI pipeline

Implemented as durable **Inngest** functions. **Every** LLM step uses structured output +
**Zod** validation behind the provider interface, with token/cost logging and idempotency.

1. **Goal → blueprint.** Input: goal + profile + self-rated level + time budget. Output:
   _structure only_ — ordered modules, each with learning objectives, concepts, difficulty,
   estimated hours. **No resources yet**, so hallucinated links can't corrupt the skeleton.
2. **Concept reconciliation.** Map blueprint concepts onto existing `concepts` (dedupe/normalize)
   or create new ones — keeps the knowledge graph coherent across users.
3. **Grounded curation** _(trust-critical)_: for each module's objectives/concepts →
   query search API for candidates → LLM ranks for quality/free/fit → **cache-check** against
   `resources` → **link-health verification** (resolves, free, enrich metadata) → attach top
   picks with a rationale. Nothing reaches the user unverified.
4. **Quiz generation** (on demand, _after_ engagement): questions target the module's
   **objectives + concepts**, framed honestly as "can you reason about this," not "recall page 50."
5. **Evaluation.** LLM grades short/reasoning answers against a rubric → per-concept scores +
   targeted feedback → emits `mastery_events`.
6. **Mastery recompute.** Derive per-concept score from events with **exponential time decay**
   and multi-signal weighting (quiz > project > self-assessment).
7. **Adaptation (MVP = minimal).** Low prerequisite mastery → insert remediation module or
   reorder; high → allow compression. Every change logged to `curriculum_revisions` with a _why_.

**Cross-cutting guardrails:** provider abstraction, Zod on every step, cost logging, idempotent
jobs, a resource cache, and a small **eval set** for curriculum and quiz quality so prompts/models
can change without silent regressions.

## UX principles (the "university," not a productivity app)

- **Onboarding = admissions interview.** Conversational goal intake that ends by presenting a
  **prospectus / program of study**, not a task list.
- **Curriculum = syllabus / course catalog.** Modules are "courses," resources are "assigned
  readings & lectures," objectives stated up front. Editorial typography, generous whitespace.
- **Module page = course page.** Objectives → assigned resources _with rationale_ →
  mark-as-engaged → **"Sit the assessment."**
- **Assessment feels like an exam/oral** — honest framing, real stakes.
- **Mastery = transcript / mastery map**, per concept, with decay visible ("needs review").
- **Light dashboard = "your term at a glance"**: study next · needs review · time budget.
- **Language reinforces the metaphor:** program, syllabus, assigned, assessment, transcript, advisor.
