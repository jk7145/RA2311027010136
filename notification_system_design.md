# Notification System Design

## Overview

This repository hosts the campus notifications workspace: a reusable logging client, a Next.js frontend on `http://localhost:3000`, and a placeholder backend folder for future services.

## Architecture

- **logging-middleware** — shared `Log(stack, level, package, message)` transport (browser posts through the Next.js relay; Node posts directly during server startup and API handlers).
- **notification_app_fe** — Next.js + Material UI app with `/notifications` (paged inbox) and `/priority` (top‑N unread ranking).
- **notification_app_be** — reserved for future API work; not required for the Stage 2 UI deliverable.

## Stage 1

### Priority ordering

Unread candidates are ranked by:

1. **Category weight** — `Placement` (3) > `Result` (2) > `Event` (1).
2. **Recency** — newer `Timestamp` wins when weights tie.

The reference implementation sorts the unread pool and slices the first *n* items. The same comparator is reused in the frontend priority page so behaviour stays aligned with the written spec.

### Keeping top‑K efficiently under streaming updates

When notifications arrive continuously, maintaining the top *K* unread items can be done with a **binary min‑heap of size K** over the composite score `weight * largeConstant + epochMillis`:

- Each insert or refresh is **O(log K)**.
- The heap root always holds the weakest item in the current top‑K set, so evicting or replacing is cheap when a better notification appears.

For the evaluation UI, a bounded fetch window plus client sort is sufficient; the heap approach is what you would use at higher scale without touching a database.

## Stage 2

### UX

- **All notifications** — Material cards, type filter (`notification_type` query), limit/page controls, optimistic prev/next paging, bulk “mark page as viewed”.
- **Priority inbox** — slider for top‑N (5–30), optional type filter on the fetched pool, unread‑only ranking, refresh and bulk mark actions.
- **New vs viewed** — persisted in `localStorage` under `campus_notifications_viewed_v1`; cards show a “New” chip until opened.

### API integration

Browser code calls same-origin routes under `/api/evaluation/*`, which attach the bearer token from `EVALUATION_ACCESS_TOKEN` and forward to the evaluation host. This avoids exposing secrets to the client bundle and sidesteps CORS restrictions.

### Logging

Application diagnostics use the shared middleware (`initLogTransport` + `Log`). `console.*` is avoided in feature code paths.

## Local development

```bash
npm install
npm run build -w @campus/logging-middleware
cd notification_app_fe
cp .env.example .env.local
# set EVALUATION_ACCESS_TOKEN, then:
npm run dev
```

The dev server listens on **port 3000** as required.
