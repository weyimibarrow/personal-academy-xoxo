# Roadmap & Backlog

Milestones are ordered. M0 and M1 are decomposed into ready-to-work issues; later milestones
are epics with checklists and get decomposed as we approach them (grooming a milestone or two
ahead, not to the horizon).

> **Note:** GitHub Issues creation is currently blocked for the session integration
> (`Issues: write` permission not granted). This file is the working backlog. Once the
> permission is granted, each `###`/checklist item below converts 1:1 to an issue.

---

## M0 — Foundation
_Goal: a deployable skeleton with auth, DB, jobs, and seed data._

### M0.1 Scaffold Next.js + TS + Tailwind + shadcn/ui
Set up the App Router project, Tailwind, shadcn/ui, base layout, and the editorial theme
tokens (typography, spacing, color) that establish the reading-room aesthetic.
**Done when:** app builds, deploys to Vercel, base layout renders with shadcn components.

### M0.2 Supabase project + schema migrations + RLS
Create the Supabase project and migrations for all MVP tables (shared + user-scoped). Add
RLS policies: shared tables read-only to authenticated users, user tables scoped to
`auth.uid()`.
**Done when:** migrations run clean; RLS verified with a test that user A cannot read user B's rows.

### M0.3 Authentication + profile
Supabase Auth (email + OAuth), protected routes, and a `profiles` row created on signup
(display name, timezone, weekly time budget).
**Done when:** a user can sign up, log in, log out, and edit their profile.

### M0.4 Provider-abstracted LLM client
A single interface wrapping OpenAI with structured-output + Zod validation, token/cost
logging, and retries. All AI code depends on this, not on OpenAI directly.
**Done when:** a sample typed call returns a Zod-validated object and logs token usage.

### M0.5 Inngest setup + job skeleton
Wire Inngest into Next.js on Vercel; implement one trivial durable multi-step function to
prove retries, step memoization, and observability.
**Done when:** a test event triggers a 2-step function visible in the Inngest dashboard.

### M0.6 Seed data: domains + concepts
Seed `domains` (CS, ML, Anthropology, French, Linguistics) and a starter `concepts` graph
(with prerequisites) for each. French concepts modeled as competencies.
**Done when:** seed script is idempotent and populates all five domains with concept graphs.

### M0.7 CI + deploy pipeline
GitHub Actions for lint + typecheck + unit tests; Vercel preview deploys on PRs.
**Done when:** CI is green on a PR and a preview URL is produced.

---

## M1 — Goal → Curriculum (structure)
_Goal: a learner states a goal and receives an editable program of study (no resources yet)._

### M1.1 Learning-goal intake ("admissions interview")
Conversational/structured flow capturing goal, target outcome, motivation, self-rated level,
weekly time budget, target date. Persists to `goals`.
**Done when:** a learner completes intake and a `goals` row is created.

### M1.2 Curriculum blueprint generation job
Inngest function: goal + profile → structured blueprint (ordered modules, objectives,
concepts, difficulty, hours). Zod-validated. Structure only — no resources.
**Done when:** submitting a goal produces a validated blueprint stored as draft `curricula` + `modules`.

### M1.3 Concept reconciliation
Map blueprint concepts onto existing `concepts` (dedupe/normalize) or create new; link via
`module_concepts`.
**Done when:** two similar curricula reuse shared concept rows instead of duplicating them.

### M1.4 Syllabus UI (course-catalog view)
Render the curriculum as a syllabus: modules as courses, objectives up front, concepts
listed. Editorial layout, not a task grid.
**Done when:** a generated curriculum is viewable as a syllabus with per-module objectives.

### M1.5 Curriculum editing
Reorder, edit, add, and remove modules; edit objectives. Persist changes; mark curriculum
`generated_by` provenance where edited.
**Done when:** a learner can fully restructure their curriculum and changes persist.

### M1.6 Activate curriculum
Transition a draft curriculum to `active`; a learner has exactly one active program per goal.
**Done when:** activating sets status and surfaces the program on the (light) dashboard.

---

## M2 — Grounded Resource Curation _(epic)_
_Goal: each module is populated with verified, free, high-quality resources._

- [ ] Integrate web-search/grounding API behind an interface.
- [ ] Curation job: search → LLM rank (quality/free/fit) → cache-check → attach candidates.
- [ ] Link-health verification (resolves, free, metadata enrichment) → write to `resources`.
- [ ] Resource cache + reuse across users; re-verification schedule for stale links.
- [ ] `module_resources` with rationale ("why this one"); required vs optional.
- [ ] Resource library UI + per-resource "why this" and provider/type/effort metadata.
- [ ] Engagement tracking (`resource_engagements`): mark in-progress/done, log time + notes.

## M3 — Assessment & Mastery _(epic)_
_Goal: learners prove understanding; mastery is tracked and decays._

- [ ] Quiz generation job against module objectives/concepts (mcq/short/reasoning).
- [ ] Assessment UI ("sit the assessment") — honest, exam-like framing.
- [ ] Rubric-based evaluation job → per-concept scores + targeted feedback.
- [ ] `mastery_events` emission from quiz attempts (and self-assessment).
- [ ] Mastery computation: exponential decay + multi-signal weighting.
- [ ] Transcript / mastery-map UI, with "needs review" surfacing.
- [ ] Hints-toward-the-resource (never answers) when a learner is stuck.

## M4 — Adaptation & Polish _(epic)_
_Goal: the program responds to evidence; the experience feels like a university._

- [ ] Adaptation engine: low prerequisite mastery → remediation/reorder; high → compression.
- [ ] `curriculum_revisions` log with human-readable rationale surfaced to the learner.
- [ ] Light dashboard: "your term at a glance" (study next · needs review · time budget).
- [ ] Onboarding polish; empty states; university-metaphor copy pass.
- [ ] Eval set for curriculum + quiz quality; cost dashboards.

---

## Fast-follows (after MVP)
- [ ] Reflection journal (`reflections`).
- [ ] Weekly reviews (`weekly_reviews`).
- [ ] Project milestones (`project_milestones`) + project completion as a mastery signal.

## Future
Knowledge graph (full) · spaced repetition · explain-it-yourself mode · community learning ·
portfolio generation · learning analytics · advanced adaptive curriculum · mobile app.
