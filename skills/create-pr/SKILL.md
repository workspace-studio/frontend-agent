---
name: create-pr
description: Create branch, commit changes, push, and open a pull request with reviewer assignment
disable-model-invocation: true
---

# Create PR

Create a PR for the current changes. Usage: `/create-pr`

## Steps

### Step 1: Determine Branch Name

If working on a GitHub issue, use: `{issue_number}-{issue-name}`
Example: `42-fix-header-scroll`, `15-add-pricing-page`

If no issue, use descriptive name: `add-pricing-page`, `fix-header-scroll`

### Step 2: Create Branch (if not already on feature branch)

```bash
git checkout -b {branch-name}
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

When linked to an issue, use `#{issueNumber}: {description}` format:

```bash
git commit -m "#{issueNumber}: {description}"
```

Example: `#42: Fix header scroll bug`

When NOT linked to an issue, use conventional commit format:

```bash
git commit -m "{type}: {description}"
```

### Step 6: Push

```bash
git push -u origin {branch-name}
```

### Step 7: Ask for Reviewer

Use the AskUserQuestion tool to ask: "Koga želiš za review ovog PR-a? (GitHub usernames, odvojeni zarezom)"

- First username → assign as reviewer with `--reviewer`
- Additional usernames → mention in PR body as "Additional reviewers"

### Step 8: Create PR

Write a DETAILED PR body describing ALL changes made:

```bash
gh pr create \
  --title "Resolves #{issueNumber}: {issue name}" \
  --reviewer {first_reviewer_username} \
  --body "$(cat <<'EOF'
Resolves #{issueNumber}: {issue name}

## Summary

Detailed description of what was done and why.

## Changes

- **{file/component 1}**: {what was changed and why}
- **{file/component 2}**: {what was changed and why}
- **{file/component 3}**: {what was changed and why}

## Files Modified

- `src/components/Header/Header.tsx` — added mobile drawer
- `src/components/Header/Header.module.scss` — responsive styles
- `messages/en/navigation.json` — new translation keys
- `messages/hr/navigation.json` — Croatian translations

## Additional Reviewers

@username2, @username3

## Test Plan

- [x] Build passes (`yarn build`)
- [x] Lint passes (`yarn lint`)
- [x] Component tests pass (`yarn test:ct`)
- [ ] Manual verification of {specific scenario}
EOF
)"
```

If NOT related to an issue, use descriptive title without `Resolves #`:

```bash
gh pr create --title "{type}: {description}" --reviewer {reviewer} --body "..."
```

## Rules

- NEVER force push
- NEVER push to main/master directly
- Stage specific files only
- Validate build + lint + tests before committing
- ALWAYS ask for reviewer before creating PR
- ALWAYS write detailed PR body with all changes listed
- Branch name format: `{issue_number}-{issue-name}` when linked to issue
