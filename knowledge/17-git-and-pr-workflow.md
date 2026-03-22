# Git & PR Workflow

## Branch Naming

| Type | Prefix | Example |
|------|--------|---------|
| Feature | `feature/` | `feature/add-pricing-page` |
| Bug fix | `fix/` | `fix/header-scroll-bug` |
| Refactor | `refactor/` | `refactor/extract-card-component` |
| Chore | `chore/` | `chore/update-dependencies` |
| Test | `test/` | `test/add-header-tests` |
| Docs | `docs/` | `docs/update-readme` |

## Commit Messages

Use conventional commit format:

```
feat: add pricing page with plan cards
fix: resolve header scroll issue on mobile
refactor: extract shared StatusChip component
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

## PR Template

```markdown
## Summary
- Add PricingCard component with 3 plan variants
- Add pricing page with generateMetadata
- Add translations for en and hr

## Test Plan
- [ ] Build passes (`yarn build`)
- [ ] Lint passes (`yarn lint`)
- [ ] Component tests pass (`yarn test:ct`)
- [ ] Manual verification of responsive layout
```

## Rules

- **NEVER** force push
- **NEVER** push directly to main/master
- **NEVER** use `git reset --hard` without explicit approval
- Always validate (build + lint + tests) before committing
- Stage specific files only
- Include co-authored-by line when working with AI
