# Git & PR Workflow

## Branch Naming

When working on a GitHub issue, use `{issue_number}-{issue-name}` format:

```
42-fix-header-scroll
15-add-pricing-page
8-refactor-card-component
```

When NOT linked to an issue, use descriptive names:

```
add-pricing-page
fix-header-scroll
refactor-card-component
```

## Commit Messages

When linked to an issue, use `#{issue_number}: {description}` format:

```
#15: Add pricing page with plan cards
#42: Fix header scroll issue on mobile
#8: Refactor extract shared StatusChip component
```

When NOT linked to an issue, use conventional commit format:

```
feat: add pricing page with plan cards
fix: resolve header scroll issue on mobile
chore: update MUI to v7.4
test: add Playwright tests for Header
docs: update CLAUDE.md with new routes
```

## File Staging

**NEVER** use `git add -A` or `git add .` — always stage specific files:

```bash
git add src/components/PricingCard/PricingCard.tsx
git add src/components/PricingCard/PricingCard.module.scss
git add src/components/PricingCard/index.ts
git add messages/en/pricing.json
git add messages/hr/pricing.json
```

## PR Creation

### Title Format

When linked to an issue:
```
Resolves #42: Fix header scroll on mobile
Resolves #15: Add pricing page with plan cards
```

When NOT linked to an issue:
```
feat: add pricing page with plan cards
fix: resolve header scroll on mobile
```

### PR Body — DETAILED Description

Always write a detailed PR body listing ALL changes:

```markdown
Resolves #42: Fix header scroll on mobile

## Summary

Fixed the header scroll behavior on mobile devices. The header was not properly
transitioning between transparent and solid backgrounds when scrolling.

## Changes

- **Header/Header.tsx**: Added scroll event listener with proper cleanup, fixed
  background transition logic for mobile breakpoint
- **Header/Header.module.scss**: Added responsive styles for mobile header
  height and transition timing
- **Header/Header.spec.tsx**: Added test for scroll behavior

## Files Modified

- `src/components/Header/Header.tsx`
- `src/components/Header/Header.module.scss`
- `src/components/Header/Header.spec.tsx`

## Additional Reviewers

@username2, @username3

## Test Plan

- [x] Build passes (`yarn build`)
- [x] Lint passes (`yarn lint`)
- [x] Component tests pass (`yarn test:ct`)
- [ ] Manual verification on mobile Safari
- [ ] Manual verification on Chrome Android
```

### Reviewer Assignment

- **Ask the user** who should review the PR before creating it
- First person → assign with `gh pr create --reviewer {username}`
- Additional people → list in PR body under "Additional Reviewers"

## Rules

- **NEVER** force push
- **NEVER** push directly to main/master
- **NEVER** use `git reset --hard` without explicit approval
- Always validate (build + lint + tests) before committing
- Stage specific files only
- Include co-authored-by line when working with AI
- Always ask for reviewer before creating PR
- Always write detailed PR description
