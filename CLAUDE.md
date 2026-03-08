# pomodoro-timer — Project Rules

## Project overview

- **Name**: pomodoro-timer
- **Language**: typescript
- **Framework**: nextjs
- **Tech stack**: Next.js + TypeScript + Tailwind CSS v4 + App Router
- **Repo**: https://github.com/reveleven92-dot/pomodoro-timer

## Code quality gates

- **800-line max** per file. If a file exceeds 800 lines, split it.
- **80-line max** per function/method. If a function exceeds 80 lines, decompose it.
- **80% test coverage minimum**. No PR merges below this threshold.
- Run the linter before committing: `npx eslint .`
- Run tests before committing: `npx jest --passWithNoTests`

## Communication

- **Plain English only.** No jargon, no acronyms without definition.
- When reporting status, include: what was done, what's next, and any blockers.
- When asking questions, prefer multiple-choice format so the owner can answer quickly: `1a, 2c, 3b (+note...)`.
- When blocked or uncertain, stop and ask rather than guessing.

## Worktree isolation

- All code changes happen inside the worktree. Never edit the repo root worktree.
- Run `pwd` and `git branch --show-current` at the start of every task to confirm location.
- If you are not in the expected worktree, STOP and ask.

## Secret handling

- `.env*` files are sensitive. Never print, log, or commit secrets/tokens.
- Never hardcode credentials in source code or prompts.
- If you need a secret value, ask the owner to set it in `.env`.

## Testing requirements

- Every implementation must include:
  - **1 happy-path E2E scenario** (proves the feature works)
  - **3 negative E2E scenarios** (bad input, missing config, dependency failure)
- Run the repo's test commands before opening a PR: `npx jest --passWithNoTests`

## PR conventions

- Every PR body must include exactly one `Fixes #<ISSUE_NUM>` to auto-close the issue.
- PR titles should be concise and descriptive.
- Keep diffs minimal and cohesive — one concern per PR.

## Agent workflow rules

- Read the project's docs before doing anything: `README.md`, `CONTRIBUTING.md`, `CLAUDE.md`, `openspec/project.md`.
- Before starting any work, read `LEARNINGS.md` for project context.
- After completing work, if you discovered something new, append it to `LEARNINGS.md`.
- EPICs are never closed by PRs. PRs close TASKs only.
- Every TASK must include `Epic: #<N>` as the first line of the body.
- "Solved" means executed end-to-end with concrete evidence, not "code written".

## Learnings

- Read `LEARNINGS.md` at the start of every task.
- After completing work, append discoveries to the appropriate section of `LEARNINGS.md`.
