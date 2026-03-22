---
name: refactor
description: Refactor code safely while keeping build and tests green
---

# Refactor

Refactor code safely. Usage: `/refactor description of what to refactor`

## Pre-Work

1. READ the code to be refactored
2. READ related tests if they exist
3. Understand the current behavior before changing anything

## Steps

### Step 1: Establish Baseline

```bash
yarn build && yarn lint && yarn test:ct
```

All must pass before starting. If not, fix first.

### Step 2: Plan Changes

- Identify all files affected
- Plan incremental steps (one logical change at a time)
- Ensure each step keeps build green

### Step 3: Implement Incrementally

For each change:
1. Make the change
2. Run `yarn build` — must still compile
3. Run `yarn lint` — must still pass
4. If tests exist, run `yarn test:ct`

### Step 4: Update Tests

If the refactor changes component APIs or behavior, update the corresponding `.spec.tsx` files.

### Step 5: Update CLAUDE.md

If structural changes were made (moved files, renamed components, changed architecture).

### Step 6: Final Validation

```bash
yarn build && yarn lint && yarn test:ct
```

All must pass.

## Rules

- NEVER break the build — each step must compile
- Preserve existing behavior unless intentionally changing it
- Update tests to reflect changes
- Follow all project patterns (SCSS > sx, no any, no memo, index.ts)
