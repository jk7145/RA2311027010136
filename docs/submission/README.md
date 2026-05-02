# Submission assets (screenshots and video)

The evaluation asks for **desktop and mobile screenshots** of the web app and a **screen recording** of the pages and behaviour.

## What to add here

Place files in this folder, then commit and push:

| File (suggested name) | Requirement |
| --- | --- |
| `01-home-desktop.png` | Home page, desktop width |
| `02-home-mobile.png` | Home page, narrow / mobile viewport |
| `03-inbox-desktop.png` | `/notifications`, desktop |
| `04-inbox-mobile.png` | `/notifications`, mobile |
| `05-priority-desktop.png` | `/priority`, desktop |
| `06-priority-mobile.png` | `/priority`, mobile |
| `walkthrough.mp4` | Video: desktop and mobile views and main interactions |

Use any names you prefer; keep the set complete before the deadline.

## How to capture

1. Run `npm run dev` from the repository root (app at `http://localhost:3000`).
2. Ensure `notification_app_fe/.env.local` contains a valid `EVALUATION_ACCESS_TOKEN` so lists load.
3. Desktop: browser window wide (for example 1280px or wider).
4. Mobile: DevTools device toolbar (for example iPhone size) or a real phone on the same network using the “Network” URL Next prints.
5. Video: OBS, Windows Snipping Tool (Win11 recording), or browser screen capture; show navigation between Home, Inbox, and Priority and at least one filter or mark-as-viewed action.

## Do not commit secrets

Never commit `.env.local` or tokens. They are listed in `.gitignore`.
