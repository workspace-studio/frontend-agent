---
name: test-page
description: Write Playwright E2E tests for a specific page — rendering, SEO, navigation, responsive, accessibility
---

# Test Page

Test a specific page end-to-end. Usage: `/test-page /pricing` or `/test-page /customers`

## Pre-Work

1. READ the page component (page.tsx for Next.js, view for React)
2. READ @knowledge/18-testing-patterns.md for E2E patterns
3. READ project routes to understand navigation context

## Steps

### Step 1: Analyze the Page

- What content renders (headings, images, lists, tables)
- What interactions exist (buttons, links, forms, modals)
- What translations are used
- SEO metadata (Next.js: generateMetadata)
- Responsive behavior

### Step 2: Create E2E Test File

Create `tests/e2e/{page-name}.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  // Rendering
  test('renders page title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('renders all plan cards', async ({ page }) => {
    const cards = page.locator('[data-testid="plan-card"]');
    await expect(cards).toHaveCount(3);
  });

  // SEO (Next.js)
  test('has correct meta title', async ({ page }) => {
    await expect(page).toHaveTitle(/pricing/i);
  });

  // Navigation
  test('CTA links to contact page', async ({ page }) => {
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/contact/);
  });

  // Responsive
  test('stacks cards on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    // Assert vertical layout
  });

  // Accessibility
  test('is keyboard navigable', async ({ page }) => {
    await page.keyboard.press('Tab');
    // Assert focus moves correctly
  });
});
```

### Step 3: Run Tests

```bash
yarn test:e2e --grep "{page-name}"
```

Fix failures and re-run until green.

## Test Categories Per Page

- **Rendering**: headings, content, images, dynamic data
- **SEO** (Next.js): meta title, description, OG tags
- **Navigation**: links, breadcrumbs, back buttons
- **Interactions**: buttons, forms, modals, toggles
- **i18n**: translated text, locale switching
- **Responsive**: mobile (375px), tablet (768px), desktop (1280px)
- **Accessibility**: keyboard nav, aria-labels, focus management
