# Testing Patterns

## Playwright Component Testing (Primary)

We use `@playwright/experimental-ct-react` for component testing. Tests are co-located inside component folders.

### Setup

```bash
yarn add -D @playwright/experimental-ct-react
```

Configure `playwright-ct.config.ts` at project root.

### Test File Location

Tests live inside the component folder:

```
StatusChip/
├── StatusChip.tsx
├── StatusChip.module.scss
├── StatusChip.spec.tsx      # ← Test file here
└── index.ts
```

### Basic Test Pattern

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import StatusChip from './StatusChip';

test.describe('StatusChip', () => {
  test('renders with label', async ({ mount }) => {
    const component = await mount(<StatusChip label="Active" color="success" />);
    await expect(component.getByText('Active')).toBeVisible();
  });

  test('applies correct color class', async ({ mount }) => {
    const component = await mount(<StatusChip label="Error" color="error" />);
    await expect(component.locator('.error')).toBeVisible();
  });

  test('truncates long labels when truncateLabel is true', async ({ mount }) => {
    const component = await mount(
      <StatusChip label="Very Long Label Text" truncateLabel />
    );
    await expect(component.locator('.label')).toBeVisible();
  });
});
```

### Testing Interactions

```typescript
test('button triggers onClick', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <ActionButton onClick={() => { clicked = true; }} label="Delete" />
  );

  await component.getByRole('button').click();
  expect(clicked).toBe(true);
});

test('toggle switches state', async ({ mount }) => {
  const component = await mount(<ToggleSwitch />);
  const toggle = component.getByRole('switch');

  await toggle.click();
  await expect(toggle).toBeChecked();

  await toggle.click();
  await expect(toggle).not.toBeChecked();
});
```

### Testing Accessibility

```typescript
test('has correct aria-label', async ({ mount }) => {
  const component = await mount(
    <IconButton aria-label="Close dialog" onClick={() => {}}>
      <CloseIcon />
    </IconButton>
  );

  await expect(component.getByLabel('Close dialog')).toBeVisible();
});

test('is keyboard focusable', async ({ mount, page }) => {
  const component = await mount(<ActionButton label="Submit" onClick={() => {}} />);

  await page.keyboard.press('Tab');
  await expect(component.getByRole('button')).toBeFocused();
});
```

### Testing Responsive Layout

```typescript
test('stacks vertically on mobile', async ({ mount, page }) => {
  await page.setViewportSize({ width: 375, height: 812 });

  const component = await mount(<PricingCards plans={mockPlans} />);
  // Assert mobile layout
});
```

## What to Test Per Component

```
ComponentName.spec.tsx
├── Rendering
│   ├── renders with default props
│   ├── renders with all prop variations
│   └── renders translated text correctly
├── Interaction
│   ├── click handlers fire correctly
│   ├── toggles/switches change state
│   └── forms validate and submit
├── Accessibility
│   ├── has correct aria attributes
│   ├── keyboard navigable
│   └── focus management works
└── Responsive (if applicable)
    ├── mobile layout
    └── desktop layout
```

## Vitest for Utilities/Hooks

Use Vitest for pure functions and hooks:

```typescript
import { describe, it, expect } from 'vitest';
import { createQueryParams } from './queryParams';

describe('createQueryParams', () => {
  it('creates query string from params', () => {
    const result = createQueryParams({ page: 1, search: 'test' });
    expect(result).toBe('?page=1&search=test');
  });

  it('skips undefined values', () => {
    const result = createQueryParams({ page: 1, search: undefined });
    expect(result).toBe('?page=1');
  });
});
```

## Run Commands

```bash
yarn test:ct          # Playwright component tests
yarn test             # Vitest unit tests (if configured)
```

## Rules

- **NO snapshot tests** — they break on every style change
- Test **behavior**, not implementation details
- Co-locate tests inside component folders
- NEVER use `any` in test files
- Test all meaningful prop variations
- Test both success and error paths
