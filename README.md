# Shorts Automation Studio

An AI-assisted workflow dashboard that automates the tedious parts of producing YouTube Shorts. Configure your channel profile once and instantly receive viral-ready ideas, pace-aware scripts, smart shot lists, production tasks, and a release cadence optimized for prime scroll windows.

## Features

- **Channel Operating System** – Persist your channel niche, tone, keywords, goals, and cadence for repeatable automation runs.
- **Idea Pipeline** – Framework-weighted idea generator tuned for short-form attention patterns and trend pairings.
- **Retention Blueprint** – Automatically builds hook → payoff → proof → CTA scripts with pacing targets for 60-second shorts.
- **Smart Shot Planner** – Scene-by-scene direction, overlays, and durations to accelerate production.
- **Auto Publishing Schedule** – Selects optimal release windows, hashtags, and CTAs for every drop.
- **Automation Kanban** – Pre/production/post task board mapped to due dates, owners, and deliverables.
- **One-click Export** – Download the entire automation plan as JSON for cross-tool integrations.

## Quickstart

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to open the automation console. Update `src/components/automation-dashboard.tsx` or `src/lib/automation.ts` to tweak the UI or generation heuristics.

## Tech Stack

- Next.js 16 (App Router, React 19, edge-friendly)  
- Tailwind CSS v4 via `@tailwindcss/postcss`  
- TypeScript, ESLint, and modern UI primitives

## Deploying

The project is tuned for Vercel. Build locally before shipping:

```bash
npm run build
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-6c6f9b50
```

After deploy, verify the production URL: `https://agentic-6c6f9b50.vercel.app`.
