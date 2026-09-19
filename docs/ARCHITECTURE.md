# Architecture

## Purpose

Web portal for Bridges for Peace volunteer applications. Applicants authenticate, complete forms, upload documents, and manage application progress. Reference writers submit reference forms via separate flows.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS; some shadcn/ui-style components |
| Forms | react-hook-form, zod, `@hookform/resolvers` |
| State | Zustand; React context for dashboard user / submitting / transitions |
| i18n | i18next / react-i18next |
| Backend data | **Kintone** (`bfp.kintone.com`) — no application database |
| API | Next.js API routes under `src/pages/api/` |
| Email | Google OAuth + nodemailer (`src/lib/email-service.ts`); some SendGrid routes |
| Package manager | Yarn |
| Deploy | Azure Web Apps via GitHub Actions; Next `output: 'standalone'` |

Path alias: `@/*` → `src/*`.

## Directory map

```text
src/
  pages/           Routes and API handlers (Pages Router)
    apply/         Applicant flows (login, dashboard, forms, documents, …)
    reference/     Reference form flow
    contact/       Contact form
    api/           Server handlers (Kintone, login, email, cron, …)
  features/        Feature UI and form logic (application, health, reference, documents)
  components/      Shared UI (header, modal, loading, ui primitives)
  common/          Shared clients, env accessors, context, checklist helpers, email templates
  lib/ / libs/     Utilities, email service, i18n helpers
  constants/       Application types, national offices, required documents
  types/           Domain TypeScript types for Kintone-shaped records
  styles/          Global CSS and layout wrappers
```

**Convention:** route shells live in `pages/`; substantial form/feature logic lives in `features/`. Prefer extending those areas rather than inventing a parallel structure.

## Data and integration

- Kintone REST client: `src/common/kintoneClient.ts` and ad hoc clients in API routes.
- App IDs and credentials: environment variables (see [DEVELOPMENT.md](DEVELOPMENT.md)); accessors in `src/common/env.ts`.
- Auth: cookie-based session (`auth`, `ref` via nookies). Login validates against Kintone application master records (`src/pages/api/login*`, `loginWithKintone.ts`).

## Deploy topology

| Branch | Workflow | Azure app (approx.) |
|--------|----------|---------------------|
| `master` | `.github/workflows/master_bfp-kintone.yml` | Production `bfp-kintone` |
| `test` | `.github/workflows/test_bfp-kintone-test.yml` | Test `bfp-kintone-test` |

CI currently installs dependencies and runs `yarn build`, then deploys. There is no separate automated test job.

## Security notes (for change awareness)

- CSP and security headers are configured in `next.config.js`.
- Several Kintone credentials use `NEXT_PUBLIC_*` names (visible to the client if bundled). Treat auth and credential handling as high-risk; do not change without human review.
