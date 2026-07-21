# Smarty Pants (working title)

A web app that helps people reach **genuine mastery** of any subject by using AI as a
**curriculum architect and registrar** — not a tutor, not a chatbot.

The learner spends their time on real resources — books, university lectures, projects,
practice — while the AI does the organizing: it builds a personalized program of study,
curates the highest-quality **free** resources, tracks **mastery** (not completion), and
evaluates understanding after the learner engages with each resource.

> **North star:** AI should reduce the work of _organizing_ learning, not the work of _thinking_.
> When convenience conflicts with genuine learning, choose learning.

## Status

**Foundation (M0).** The application is scaffolded — Next.js (App Router) + TypeScript +
Tailwind CSS v4 + shadcn/ui, with the editorial "reading-room" theme in place. See the
product docs in [`docs/`](./docs).

- [Product Spec](./docs/product-spec.md) — what we're building and why
- [Architecture](./docs/architecture.md) — stack, data model, AI pipeline
- [Roadmap & Backlog](./docs/roadmap.md) — milestones and decomposed issues

## The core loop

State a goal → receive a program of study → engage real resources → prove understanding →
the program adapts.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

### Project structure

```
src/
  app/                 # Next.js App Router (routes, layout, global styles)
    globals.css        # Tailwind v4 + editorial theme tokens (light/dark)
    layout.tsx         # root layout, fonts, metadata
    page.tsx           # landing page
  components/ui/       # shadcn/ui primitives (Button, Card, …)
  lib/utils.ts         # cn() class-name helper
docs/                  # product spec, architecture, roadmap
```

shadcn/ui is configured manually (see `components.json`) because this environment
restricts outbound network to package registries; new primitives are added as code
rather than via the CLI's registry fetch.

## Stack (locked)

Next.js · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres/Auth/RLS/Storage) ·
OpenAI (behind a provider abstraction) · Vercel · **Inngest** (durable AI jobs) ·
a web-search/grounding API (Exa/Tavily/Brave) for verified resource curation.

## Seed domains

Computer Science · Machine Learning · Anthropology · French · Linguistics.
