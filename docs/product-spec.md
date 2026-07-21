# Product Spec

## The problem

Self-directed learners drown in options. The internet has world-class free resources —
MIT OpenCourseWare, open textbooks, arXiv, official docs, recorded university lectures —
but no structure, no sequencing, and no honest way to know whether you've actually
learned anything. Existing "AI tutors" make this worse: they do the thinking _for_ you,
optimizing for the feeling of progress rather than real mastery.

## The wedge

Almost everyone is building an AI **tutor**. We're building an AI **registrar**: it
organizes learning and certifies mastery, but the _teaching_ is done by the best
human-made resources in the world. This is defensible and un-crowded.

## Core philosophy → hard product constraints

**AI should reduce the work of organizing learning, not the work of thinking.**

1. **No answer-shortcuts on the main path.** There is no "just explain it to me" button.
   When a learner is stuck, the AI offers _hints that point back to the resource_, never
   the answer.
2. **Mastery, not completion.** Progress is represented as a **transcript of mastery** per
   concept. Mastery **decays** over time and must be maintained — a checked box is not
   evidence of understanding.
3. **The AI is the advisor/registrar, not the lecturer.** It sequences, curates, quizzes,
   and adapts. It does not deliver the instruction.
4. **Prefer real resources over generated content.** When we could generate an explanation
   or point to a great existing one, we point.

## The core loop

> State a goal → receive a program of study → engage real resources → prove understanding →
> the program adapts.

Everything in the MVP exists to make this loop work end to end.

## Scope

### MVP (the core loop)
- Authentication
- User profile
- Learning goals (structured intake — the "admissions interview")
- AI-generated curriculum (**structure**: modules, objectives, concepts)
- Curriculum editing (reorder / edit / add / remove modules)
- Grounded resource library (search + **verified** free resources)
- Modules ("courses") with assigned resources and rationale
- Progress + **mastery** tracking (multi-signal, decaying)
- AI-generated quizzes + rubric-based evaluation

### Fast-follows (built right after MVP, not part of it)
- Reflection journal
- Weekly reviews
- Project milestones
- Rich dashboard (MVP ships only a _light_ "your term at a glance")

### Future
Knowledge graph (full) · spaced repetition · explain-it-yourself mode · community learning ·
portfolio generation · learning analytics · advanced adaptive curriculum · mobile app.

## Seed domains & why they matter

We launch with **five vetted domains**, chosen to stress-test the engine, not just the
easy cases:

| Domain | Why it's here |
| --- | --- |
| Computer Science | Dense, verifiable free resources; strong first impression. |
| Machine Learning | High demand; overlaps with CS for resource reuse. |
| Anthropology | Reasoning/essay-heavy; tests rubric-graded evaluation over MCQs. |
| Linguistics | Same as above, plus formal/technical sub-areas. |
| French | **Skill** mastery, not knowledge mastery — pressure-tests the evidence model early (production, comprehension, grammar, vocabulary as competencies). |

French is the deliberate outlier: language acquisition forces us to prove the mastery model
generalizes beyond "did you understand this concept."

## What "mastery" means here

Mastery is a **per-concept score in [0, 1]** derived from an append-only **evidence log**,
never written directly. Evidence is multi-signal:

- **Quizzes** — rubric-graded reasoning + recall, tagged by concept.
- **Projects** — completion of applied milestones (fast-follow evidence source).
- **Self-assessment** — the learner's own rating, weighted low, used as a prior.

Scores **decay** on an exponential half-life, so mastery reflects _current_ understanding
and must be maintained. This is the mechanism that makes "mastery not completion" real
rather than a slogan.

## Non-goals

- We are not a content generator or a homework-answer engine.
- We do not host or reproduce copyrighted material — we **link** to free, legitimate sources.
- We do not gamify with streaks/points that reward activity over understanding.
