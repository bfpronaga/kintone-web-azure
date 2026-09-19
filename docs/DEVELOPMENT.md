# Development

## Prerequisites

- Node.js 20.x (matches CI)
- Yarn

## Setup

```bash
yarn
```

Copy environment variables into a local `.env` (gitignored). Do not commit secrets.

### Environment variables (names only)

Commonly used (see also `src/common/env.ts` and API routes):

- Kintone: `NEXT_PUBLIC_KINTONE_USERNAME`, `NEXT_PUBLIC_KINTONE_PASSWORD`, and various `NEXT_PUBLIC_*_APPID` values
- Email: `GOOGLE_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`
- Optional / other: `SENDGRID_API_KEY`, `OPENAI_API_KEY`, `PLEDGES_APPID`, `SCM_DO_BUILD_DURING_DEPLOYMENT`

Ask a maintainer for real values. Never paste secrets into Issues, commits, or docs.

## Scripts

| Command | Purpose |
|---------|---------|
| `yarn dev` | Dev server (`next dev -H 0.0.0.0`) |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn lint` | ESLint (`next lint`) |

## Verification for AI / PR work

There is **no unit or e2e test suite** in this repo yet. For a typical change:

1. `yarn lint` when linting is relevant
2. `yarn build` for TypeScript / Next compile confidence
3. Manual or browser check of the affected apply / reference / API flow when UI or API behavior changed

Document what you ran in the Issue or PR summary.

## Branches and deploy

- `master` → production Azure app (workflow: `master_bfp-kintone.yml`)
- `test` → test Azure app (workflow: `test_bfp-kintone-test.yml`)

Do not push to production branches or change deploy workflows without explicit human request.

## Formatting

Prettier config: `.prettierrc`. Match existing file style when editing.
