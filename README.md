# Campus notifications workspace

Monorepo for the campus notification UI, shared logging client, and a placeholder backend package.

## Quick start

```bash
npm install
npm run build -w @campus/logging-middleware
cd notification_app_fe
cp .env.example .env.local
```

Set `EVALUATION_ACCESS_TOKEN` in `.env.local` to your bearer token from the evaluation auth endpoint (single line, no `Bearer ` prefix).

From the repository root:

```bash
npm run dev
```

Open **http://localhost:3000** (required port for the evaluation frontend).

## Packages

| Path | Role |
| --- | --- |
| `logging-middleware` | Shared `Log` transport for evaluation logging |
| `notification_app_fe` | Next.js + Material UI app |
| `notification_app_be` | Placeholder for future backend work |
| `notification_system_design.md` | Design notes including Stage 1 and Stage 2 |

## Submission media

Add desktop and mobile screenshots plus your walkthrough video under `docs/submission/` (see `docs/submission/README.md`).


