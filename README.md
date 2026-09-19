# kintone-web-azure

Bridges for Peace volunteer application portal. Applicants log in, complete multi-step forms, upload documents, and track progress. Data is stored in **Kintone**; the app is a Next.js front end and API layer deployed to **Azure Web Apps**.

## Stack

- Next.js 14 (Pages Router) + TypeScript + Tailwind
- Kintone REST API (`@kintone/rest-api-client`)
- Yarn

## Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](AGENTS.md) | Project-wide development rules and Issue-driven workflow (for humans and AI) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the codebase is organized |
| [docs/DOMAIN.md](docs/DOMAIN.md) | Business / domain rules |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | Local setup, checks, and deploy branches |

## How work is tracked

Use **GitHub Issues** as the shared work list. Prefer the Issue template so each task has problem, desired result, scope, acceptance criteria, and constraints.

Typical flow: understand → plan → implement → test → fix → verify → **human review** → ship.

AI may implement and verify routine work; only a human decides what is shipped.

## Quick start

```bash
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Environment variables are required for Kintone and email — see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Deploy

- `master` → production Azure (`bfp-kintone`)
- `test` → test Azure (`bfp-kintone-test`)

See GitHub Actions under `.github/workflows/`.
