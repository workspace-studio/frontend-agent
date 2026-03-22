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

### Step 2: Analyze the Problem

- Understand the bug or feature request
- Identify affected files and components
- Plan the fix

### Step 3: Create Branch

```bash
git checkout -b fix/issue-$ARGUMENTS
```

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

Use `/create-pr` skill or manually:

```bash
git add <specific-files>
git commit -m "fix: <description> (closes #$ARGUMENTS)"
```

Then create PR referencing the issue.
