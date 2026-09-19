# Agent and development rules

This file is the project-wide guide for AI-assisted work on this repository. Prefer existing patterns over new architecture.

For system shape, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).  
For business rules, see [docs/DOMAIN.md](docs/DOMAIN.md).  
For local commands and deploy, see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## Shared work list: GitHub Issues

GitHub Issues are the main place humans and AI record work.

A normal Issue should include:

- Problem or requested improvement
- Desired result
- Scope
- Acceptance criteria
- Important constraints
- Relevant notes or decisions

When working on an Issue, treat it as the source of truth for the task.

Do not silently expand scope. Newly discovered bugs, improvements, or tech debt should become a **separate Issue** (or a clear suggestion for one), not extra work on the current task.

Update the Issue with useful progress and final results. Do not paste an internal AI transcript into the Issue.

## Task workflow

For a normal Issue:

### 1. Understand

Read the Issue. Inspect the relevant code, existing behavior, architecture, and any available checks.

### 2. Plan

Briefly identify:

- what will change
- where it will change
- what must not change
- how it will be tested
- important risks

Low-risk work may continue without waiting.  
High-risk work (see **Human-controlled decisions**) must stop and ask before implementing.

### 3. Implement

Make the smallest change that satisfies the Issue. Match existing project patterns and libraries. Do not introduce new frameworks or major abstractions without a strong reason and human approval.

### 4. Test

Run the relevant checks available in this project (see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)): typically lint, build, and manual/browser checks for the affected flows. There is no automated test suite yet.

### 5. Fix and repeat

If something fails, investigate, fix, and re-check until acceptance criteria are met, checks pass, or human input is required.

### 6. Review (before ready)

Summarize for a human:

- what changed
- what was tested
- important files affected
- risks or assumptions
- what the human should review

Distinguish clearly:

| State | Meaning | Who decides |
|-------|---------|-------------|
| **Implemented** | Code changes exist for the Issue | AI may claim this |
| **Verified** | Relevant checks and acceptance criteria appear met | AI may claim this carefully |
| **Shipped** | Merged / deployed / released | **Human only** |

## Human-controlled decisions

Investigate, implement, test, and revise routine work freely within Issue scope.

**Stop and ask** before:

- major architectural changes
- Kintone field/schema or data changes that could corrupt or destroy records
- authentication or authorization changes
- security-sensitive changes
- unclear changes to important business rules
- production or deployment changes
- other irreversible or high-impact actions

When unsure, ask rather than guess.

## Code quality

Prioritize correctness, consistency with this codebase, maintainability, and safe changes. Do not maximize volume of code.

- Do not make unrelated improvements while working on an Issue.
- Do not rewrite working code only because another approach looks cleaner.
- Prefer editing existing files over adding new abstractions.
- Keep documentation accurate when behavior that docs describe changes.

## Git discipline

Before preparing a commit or pull request:

- Inspect the diff; remove unrelated changes
- Exclude accidental or generated files (e.g. `.next`, `node_modules`)
- Ensure docs match the change when relevant
- Never commit secrets (`.env`, credentials, API keys, publish profiles)
- Keep changes traceable to their GitHub Issue (reference the Issue number in commits/PRs when applicable)

Only create commits or PRs when the human asks for them.
