# Component Patterns

## Folder Structure

Every component lives in its own folder with a mandatory barrel export:

```
ComponentName/
├── ComponentName.tsx          # Component code
├── ComponentName.module.scss  # ONLY if component needs custom styles
├── ComponentName.spec.tsx     # Playwright component test
└── index.ts                   # MANDATORY barrel export
```

## index.ts Pattern (MANDATORY)

Every component folder MUST have an `index.ts` with named import + default export:

```typescript
import ComponentName from './ComponentName';

export default ComponentName;
```

**NOT** the shorthand pattern:
```typescript
// ❌ WRONG — do not use this pattern
export { default } from './ComponentName';
```

## MUI as Building Blocks (NOT Wrappers)

Components use MUI components as building blocks to create custom UI. We do NOT create wrapper components around MUI.

**Correct — custom component using MUI blocks:**
```tsx
import { Chip, ChipProps } from '@mui/material';
import cx from 'clsx';

import styles from './StatusChip.module.scss';

interface StatusChipProps extends ChipProps {
  truncateLabel?: boolean;
}

const StatusChip = ({ color, label, truncateLabel }: StatusChipProps) => (
  <Chip
    color={color}
    label={label}
    classes={{ root: cx(styles.root, { [styles.label]: truncateLabel }) }}
    className={cx(color && styles[color])}
  />
);

export default StatusChip;
```

**Wrong — MUI wrapper:**
```tsx
// ❌ Do NOT create generic wrappers around MUI components
const MyButton = (props) => <Button {...props} variant="contained" />;
```

## Styling Approach

1. **MUI component props** (variant, size, color, component) — PREFERRED for styling
2. **SCSS modules** — for custom styles that can't be achieved with MUI props
3. **`sx` prop** — ONLY for one-off spacing (mt, mb, gap, p) — NEVER for colors, borders, backgrounds
4. **`cx` from `clsx`** — for merging multiple classNames or conditional classes. NEVER use template literals (`` `${styles.a} ${styles.b}` ``) or string concatenation

**NEVER mix sx and SCSS on the same element.**

**Skip .module.scss** if MUI components + props are sufficient. Don't create empty style files.

## Server vs Client Components (Next.js)

**Server components (default)** — no directive needed:
- Components that only render UI from props
- Components that fetch data
- Components with no hooks, event handlers, or browser APIs

**Client components** — add `'use client'` at top:
- Components using `useState`, `useEffect`, `useRef`
- Components with `onClick`, `onChange`, `onSubmit` handlers
- Components using `useTranslations` (next-intl)
- Components using browser APIs (localStorage, window)

## View Structure

Views are page-level components in `src/views/`:

```
views/
└── Customers/
    ├── Customers.tsx           # Main view component
    ├── Customers.module.scss   # View styles
    ├── partials/               # Sub-components
    │   ├── CreateModal.tsx
    │   ├── DetailDrawer.tsx
    │   └── DeleteModal.tsx
    └── index.ts                # Barrel export
```

## View Section Pattern

Every view section component MUST start with a `Container` component:

```tsx
import { Container, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import styles from './FeaturesSection.module.scss';

const FeaturesSection = () => {
  const t = useTranslations('home.features');

  return (
    <Container component="section" className={styles.container}>
      <Container disableGutters maxWidth="xl">
        <Stack textAlign="center">
          <Typography component="h2" variant="h2">
            {t('section.title')}
          </Typography>
          <Typography variant="body1">
            {t('section.description')}
          </Typography>
        </Stack>
      </Container>
    </Container>
  );
};
```

Key rules:
- Use `component="section"` for semantic HTML
- Outer `Container` controls full-width background/padding
- Inner `Container` with `maxWidth="xl"` constrains content width
- Always use `disableGutters` on inner Container when needed

## Props Interface

Always define and export a props interface:

```tsx
interface StatusChipProps extends ChipProps {
  truncateLabel?: boolean;
}
```

## Naming

- Component files: PascalCase (`StatusChip.tsx`)
- Hook files: camelCase with `use` prefix (`useCustomersView.tsx`)
- SCSS modules: match component name (`StatusChip.module.scss`)
