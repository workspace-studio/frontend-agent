---
paths:
  - "**"
---

# Git Rules

## Branch Names
- Flat names only — NEVER use `feature/`, `fix/`, `chore/` prefixes
- With issue: `{issue_number}-{issue-name}` (e.g. `42-fix-header-scroll`)
- Without issue: `descriptive-name` (e.g. `add-pricing-page`)

## Commits
- With issue: `#{issue_number}: {description}`
- Without issue: conventional format (`feat:`, `fix:`, `refactor:`, etc.)
- Stage specific files — NEVER use `git add -A` or `git add .`

## Safety
- NEVER force push
- NEVER push directly to main/master
- NEVER use `git reset --hard` without explicit approval
- NEVER use `git commit --no-verify` — always run hooks
- Validate (build + lint + tests) before committing
