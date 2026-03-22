---
name: write-tests
description: Write Playwright component tests for existing components
---

# Write Tests

Write Playwright component tests for existing components. Usage: `/write-tests ComponentName` or `/write-tests src/components/Header`

## Pre-Work

1. READ @knowledge/18-testing-patterns.md
2. READ the component to be tested — understand props, interactions, translations
3. READ existing `.spec.tsx` files for project test patterns

## Steps

### Step 1: Analyze Component

- Identify all props and their types
- Identify interactive behavior (clicks, toggles, form inputs)
- Identify translated strings
- Identify responsive behavior (breakpoint-dependent styles)

### Step 2: Create Test File

Create `ComponentName.spec.tsx` inside the component folder:

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import ComponentName from './ComponentName';

test.describe('ComponentName', () => {
  test('renders with default props', async ({ mount }) => {
    const component = await mount(<ComponentName />);
    await expect(component).toBeVisible();
  });

  test('renders with all prop variations', async ({ mount }) => {
    // Test each meaningful prop combination
  });

  test('handles click correctly', async ({ mount }) => {
    let clicked = false;
    const component = await mount(
      <ComponentName onClick={() => { clicked = true; }} />
    );
    await component.getByRole('button').click();
    expect(clicked).toBe(true);
  });

  test('is accessible', async ({ mount }) => {
    const component = await mount(<ComponentName />);
    // Check aria-labels, roles, keyboard focus
    await expect(component.getByRole('button')).toBeVisible();
  });
});
```

### Step 3: Test Categories

Cover these categories:
- **Rendering**: default props, all prop variations, translated text
- **Interaction**: click handlers, toggles, form submissions
- **Accessibility**: aria attributes, keyboard navigation, roles
- **Responsive** (if applicable): mobile vs desktop layout

### Step 4: Run Tests

```bash
yarn test:ct
```

Fix any failures and re-run until green.

## Rules

- Test file MUST be co-located inside the component folder
- File name: `ComponentName.spec.tsx`
- NO snapshot tests — they break on every style change
- Test behavior, not implementation details
- NEVER use `any` in test files — always type properly
