# Domain and business rules

Documented here so developers and AI sessions can share the same product rules. **Do not invent or change business rules** when requirements are unclear — ask a human.

## Product context

Bridges for Peace volunteer application portal. Applicants apply for volunteer programs; national offices and staff work from data stored in Kintone.

## Application types

Defined in `src/constants/applicationTypes.ts`:

- `Short Term`
- `Long Term`
- `Zealous`

Behavior (required documents, forms, URLs) often differs by type. Check existing conditionals before changing shared form logic.

## National offices

Listed in `src/constants/nationalOffices.ts` (Australia, Canada, Japan, New Zealand, South Africa, South Korea, United Kingdom, USA, Other). USA often has extra document requirements (e.g. SSN).

## Required documents

Defined in `src/constants/necessaryDocuments.ts`:

| Set | Documents |
|-----|-----------|
| Default long-term style | passport, recent photo, medical status form, doctor letter, criminal check, criminal check apostille |
| USA (+ default) | above + SSN / social security card |
| Short Term | passport, recent photo, medical status form, doctor letter |
| Short Term USA | Short Term set + SSN |

Document upload UI lives under `src/pages/apply/documents/` and shared submit logic under `src/features/common/documents/`.

## Main applicant flows

Typical path (details vary by type and progress):

1. Login (`/apply/login`, …)
2. Dashboard / checklist (`/apply/dashboard`)
3. Application form (`/apply/form`)
4. Health questionnaire (`/apply/health-questionnaire`)
5. Financial obligation (where applicable)
6. Document uploads
7. Privacy policy and related steps

Reference writers use `/reference` (separate from applicant login).

## Kintone apps (logical)

Configured via env (IDs only; values are not committed). Conceptually:

| Concern | Env / accessor (approx.) |
|---------|---------------------------|
| Application master (login / online application) | `NEXT_PUBLIC_VOLUNTEER_APPLICATION_MASTER_APPID` |
| Volunteer application form | `NEXT_PUBLIC_VOLUNTEER_APPLICATION_FORM_APPID` |
| Temp application form | `NEXT_PUBLIC_TEMP_VOLUNTEER_APPLICATION_FORM_APPID` |
| Personal health questionnaire | `NEXT_PUBLIC_PERSONAL_HEALTH_QUESTIONNAIRE_APPID` |
| Reference form | `NEXT_PUBLIC_VOLUNTEER_REFERENCE_FORM_APPID` |
| Volunteer profile | `NEXT_PUBLIC_VOLUNTEER_PROFILE_APPID` |
| Error logs | `NEXT_PUBLIC_ERROR_LOGS_APPID` / API key |
| Timesheet / pledges | timesheet and pledges-related env vars |

Field names and record shapes appear in `src/types/` and in API route mappings. Prefer matching existing field keys over renaming.

## Auth model (business level)

- Applicants sign in with credentials stored/checked against Kintone application master records (email + password fields).
- Session is represented by cookies used across the apply dashboard.
- Changing login, password creation, or cookie behavior is security-sensitive and requires human approval.

## Rules of thumb

- Prefer reading `src/constants/` and existing form enums before hard-coding new lists.
- Checklist / completion flags are updated through API routes under `src/pages/api/application/checklist/`.
- Notifications and emails are part of submission flows — changing copy or recipients may be a business decision.
- External Kintone public form URLs also exist in `src/common/env.ts` for some application types; do not change them casually.
