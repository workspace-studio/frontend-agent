---
name: fix-issue
description: Analyze and fix a GitHub issue with tests and PR
---

# Fix Issue

Fix a GitHub issue. Usage: `/fix-issue 42`

## Steps

### Step 1: Read the Issue

```bash
gh issue view $ARGUMENTS --json title,body,labels,comments
```

Extract the issue number and title for branch naming.

### Step 2: Analyze the Problem

- Understand the bug or feature request
- Identify affected files and components
- Plan the fix

### Step 3: Create Branch

Use `{issue_number}-{issue-name}` format:

```bash
gh issue view $ARGUMENTS --json title -q '.title' | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | head -c 50
git checkout -b $ARGUMENTS-{issue-name-slug}
```

Example: `42-fix-header-scroll-on-mobile`

### Step 4: Implement Fix

- Read existing code for context
- Implement the minimal fix needed
- Follow all project patterns (SCSS > sx, no any, no memo, index.ts pattern)

### Step 5: Write Regression Test

Create or update `.spec.tsx` to cover the fixed scenario.

### Step 6: Validate

```bash
yarn build
yarn lint
yarn test:ct
```

### Step 7: Commit and PR

Use `/create-pr` skill which will:
- Stage specific files
- Commit with `#{issue_number}: {description}` format
- Ask for reviewer
- Create PR with `Resolves #{issue_number}: {issue title}` and detailed description
