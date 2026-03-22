---
name: create-pr
description: Create branch, commit changes, push, and open a pull request
disable-model-invocation: true
---

# Create PR

Create a PR for the current changes. Usage: `/create-pr`

## Steps

### Step 1: Determine Branch Name

Based on the type of change:
- `feature/` — new functionality
- `fix/` — bug fix
- `refactor/` — code restructuring
- `chore/` — maintenance, dependencies
- `docs/` — documentation only

### Step 2: Create Branch (if not already on feature branch)

```bash
git checkout -b {type}/{short-description}
```

### Step 3: Validate Before Commit

```bash
yarn build
yarn lint
yarn test:ct
```

All must pass before committing.

### Step 4: Stage Specific Files

```bash
git add <specific-file-paths>
```

NEVER use `git add -A` or `git add .` — always stage specific files.

### Step 5: Commit

```bash
git commit -m "{type}: {description}"
```

### Step 6: Push

```bash
git push -u origin {branch-name}
```

### Step 7: Create PR

```bash
gh pr create --title "{type}: {description}" --body "## Summary
- {change 1}
- {change 2}

## Test Plan
- [ ] Build passes
- [ ] Lint passes
- [ ] Component tests pass
- [ ] Manual verification"
```

## Rules

- NEVER force push
- NEVER push to main/master directly
- Stage specific files only
- Validate build + lint + tests before committing
