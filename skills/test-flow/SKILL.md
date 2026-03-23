---
name: test-flow
description: Write Playwright E2E tests for a user flow — login, CRUD, forms, multi-step processes
---

# Test Flow

Test a complete user flow end-to-end. Usage: `/test-flow create-customer` or `/test-flow booking-checkout`

## Pre-Work

1. READ the views/components involved in the flow
2. READ @knowledge/18-testing-patterns.md for E2E patterns
3. READ the Valtio stores/services to understand data flow
4. Identify all pages/modals/forms in the flow

## Steps

### Step 1: Map the Flow

Document each step of the user journey:

```
Flow: Create Customer
1. Login as admin
2. Navigate to /customers
3. Click "Create" button → modal opens
4. Fill form: name, email, phone
5. Submit → modal closes → customer in list
```

### Step 2: Create E2E Test File

Create `tests/e2e/{flow-name}.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Create Customer Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Auth setup
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('creates customer successfully', async ({ page }) => {
    // Navigate
    await page.goto('/customers');
    await expect(page.getByRole('heading', { name: /customers/i })).toBeVisible();

    // Open create modal
    await page.click('button:has-text("Create")');
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill form
    await page.fill('[name="name"]', 'Test Customer');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="phone"]', '+385911234567');

    // Submit
    await page.click('button:has-text("Save")');

    // Verify modal closed
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Verify customer in list
    await expect(page.getByText('Test Customer')).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/customers');
    await page.click('button:has-text("Create")');
    await page.click('button:has-text("Save")');

    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('handles duplicate email', async ({ page }) => {
    await page.goto('/customers');
    await page.click('button:has-text("Create")');

    await page.fill('[name="name"]', 'Duplicate');
    await page.fill('[name="email"]', 'existing@example.com');
    await page.click('button:has-text("Save")');

    await expect(page.getByText(/already exists/i)).toBeVisible();
  });
});
```

### Step 3: Test Edge Cases

- Empty form submission (validation)
- Duplicate data (conflict handling)
- Network errors (API failures)
- Unauthorized access (redirect to login)
- Very long input data
- Special characters in input

### Step 4: Run Tests

```bash
yarn test:e2e --grep "{flow-name}"
```

Fix failures and re-run until green.

## Common Flow Patterns

### Auth Flow
Login → verify redirect → access protected page → logout → verify redirect to login

### CRUD Flow
List page → Create → verify in list → Edit → verify updated → Delete → verify removed

### Search/Filter Flow
List page → search → verify filtered results → clear → verify all results

### Multi-Step Form
Step 1 → validate → Step 2 → validate → Step 3 → submit → verify
