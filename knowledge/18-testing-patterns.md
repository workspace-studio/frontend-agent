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

## E2E Testing with Playwright (Pages & Flows)

E2E tests live in `tests/e2e/` at the project root. They test full pages and user flows.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Customers Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('displays customer list', async ({ page }) => {
    await page.goto('/customers');
    await expect(page.getByRole('heading', { name: /customers/i })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('creates new customer', async ({ page }) => {
    await page.goto('/customers');
    await page.click('button:has-text("Create")');
    await page.fill('[name="name"]', 'Test Customer');
    await page.click('button:has-text("Save")');
    await expect(page.getByText('Test Customer')).toBeVisible();
  });
});
```

### Responsive E2E Tests

```typescript
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const viewport of viewports) {
  test(`pricing page on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/pricing');
    // Assert layout
  });
}
```

### E2E Test Structure

```
tests/
├── e2e/
│   ├── auth.spec.ts           # Auth flows
│   ├── navigation.spec.ts     # Page navigation
│   ├── {feature}.spec.ts      # Feature CRUD flow
│   └── responsive.spec.ts     # Viewport tests
├── fixtures/
│   └── test-data.ts           # Mock data
└── playwright.config.ts
```

Use `/test-page` for page-level tests, `/test-flow` for user flow tests.

## Run Commands

```bash
yarn test:ct          # Playwright component tests (co-located .spec.tsx)
yarn test:e2e         # Playwright E2E tests (tests/e2e/)
yarn test             # Vitest unit tests (if configured)
```

## Rules

- **NO snapshot tests** — they break on every style change
- Test **behavior**, not implementation details
- Co-locate tests inside component folders
- NEVER use `any` in test files
- Test all meaningful prop variations
- Test both success and error paths

## Selector Rules

- Use stable selectors: `getByRole`, `getByLabel`, `getByText`, `data-testid` — NEVER select by CSS class names (`[class*="phoneField"]`, `.MuiChip-root`)
- Avoid positional selectors (`.nth(3)`) — they break when elements are added/removed
- If no semantic selector exists, add `data-testid` to the component

## Assertion Rules

- Assertions must assert something meaningful — getting a bounding box without comparing values is useless
- Test the contract (form submits correct data, callback receives correct args), not just DOM presence
- Test negative paths: invalid input, error states, empty states, boundary conditions
- Test complex interactions: paste handlers, keyboard navigation, disabled states

## Test Organization

- Smoke tests should be minimal (renders, key elements visible) — do NOT duplicate regression tests
- No `test.skip()` without a tracking issue URL: `test.skip('TODO: fix flaky picker — #123')`
- No `console.log` or unused `_data` params in test files
- When replacing placeholder pages with real content, proactively find and update E2E tests that assert on the old placeholder text — don't wait for tests to fail
