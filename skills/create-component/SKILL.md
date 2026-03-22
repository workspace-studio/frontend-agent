---
name: create-component
description: Create a new component with MUI building blocks, SCSS module (if needed), Playwright test, and barrel export
---

# Create Component

Create a new component following project patterns. Usage: `/create-component ComponentName — description`

## Pre-Work

1. READ the project's CLAUDE.md for project-specific instructions
2. READ @knowledge/03-component-patterns.md for component structure
3. READ 2-3 existing components from `src/components/` for patterns
4. Detect stack from package.json (next → Next.js, vite → React+Vite)

## Steps

### Step 1: Gather Requirements

Ask the user (if not already specified):
- Component name (PascalCase)
- What the component does
- Interactive behavior (clicks, toggles, forms)
- Whether it needs custom styles beyond MUI props

### Step 2: Create Component Folder

```bash
mkdir -p src/components/ComponentName
```

### Step 3: Create ComponentName.tsx

- Define props interface (exported)
- Arrow function component
- Use MUI components as building blocks (Stack, Box, Typography, Paper, Button, etc.)
- Use MUI component props for styling (variant, size, color) — NOT sx
- Import translations if i18n present: `useTranslations('namespace')` (Next.js) or `useTranslation('namespace')` (React)
- For Next.js: add `'use client'` only if component uses hooks, event handlers, or browser APIs

### Step 4: Create ComponentName.module.scss (ONLY if needed)

Skip this file if MUI components + props are sufficient. If custom styles are needed:

```scss
@use '@/styles/settings/variables' as *;
@use '@/styles/utils/rem-calc' as *;
@use '@/styles/mixins/breakpoints' as *;

.container {
  // custom styles here
}
```

### Step 5: Create ComponentName.spec.tsx

Playwright component test co-located in the component folder:

```typescript
import { test, expect } from '@playwright/experimental-ct-react';
import ComponentName from './ComponentName';

test('renders with default props', async ({ mount }) => {
  const component = await mount(<ComponentName />);
  await expect(component).toBeVisible();
});

test('renders all prop variations', async ({ mount }) => {
  // Test each meaningful prop combination
});

test('handles interactions correctly', async ({ mount }) => {
  // Test click handlers, toggles, form inputs
});
```

### Step 6: Create index.ts (MANDATORY)

```typescript
import ComponentName from './ComponentName';

export default ComponentName;
```

### Step 7: Add Translations

If i18n is present, add translation keys to ALL supported locales.

### Step 8: Validate

```bash
yarn lint          # Must pass
yarn test:ct       # Must pass Playwright tests
```

Fix any failures and re-run until green.

## Rules

- Use MUI as building blocks — NEVER create MUI wrapper components
- MUI component props for styling — NOT sx (sx only for spacing: mt, gap, p)
- SCSS module only when component has custom styles
- NEVER use `any`, `unknown` — always define proper types
- NEVER use `React.memo`, `useMemo`, `useCallback`
- Always create index.ts with named import + default export pattern
