---
name: setup-theme
description: Set up a complete MUI v9 theme with colors, breakpoints, palette, typography, and component overrides
---

# Setup Theme

Set up a complete MUI theme. Usage: `/setup-theme — primary=#1976d2, font=Inter`

## Pre-Work

1. READ @knowledge/04-mui-theming.md for theme patterns (MUI v9 — cssVariables, slotProps era)
2. READ @examples/theme/ for reference implementation
3. CHECK if `src/styles/themes/` already exists
4. CHECK installed MUI major in package.json — a v5/v6/v7 project gets migrated FIRST (@knowledge/27-mui-v9-migration.md), never a v9 theme on an old install

## Steps

### Step 1: Create Theme Directory

```bash
mkdir -p src/styles/themes
```

### Step 2: Create colors.ts

Define project color constants organized by hue:

```typescript
export default {
  primary500: '#fa541c',
  primary600: '#eb350b',
  // ...full palette
  white: '#ffffff',
  black: '#000000',
};
```

### Step 3: Create breakpoints.ts

```typescript
const breakpoints: ThemeOptions['breakpoints'] = {
  values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
};
```

### Step 4: Create palette.ts

Map colors to MUI palette roles (primary, secondary, error, warning, success, info).

### Step 5: Download Font Files

1. Identify required fonts from the user's request (e.g., Inter, Poppins)
2. Download `.woff2` files — for each font, download only the weights needed:
   - Regular (400) and SemiBold (600) are typical minimums
   - Bold (700) if used for headings
3. Save to `public/fonts/` (Next.js) or `src/assets/fonts/` (React+Vite)
4. Create `src/styles/globals/fonts.scss` with `@font-face` declarations (see @knowledge/14-performance.md for example)
5. Import fonts.scss in `src/styles/index.scss`: `@use 'globals/fonts';`

**NEVER use Google Fonts links, CDN imports, or `next/font/google`.** Fonts must be local `.woff2` files.

### Step 6: Create typography.ts

Define fontFamily and variant overrides (h1, h2, h3, body1, body2, button). v9 type import:
`import type { TypographyVariantsOptions } from '@mui/material/styles';` — NEVER the old `@mui/material/styles/createTypography` deep import.

### Step 7: Create typings.d.ts (if needed)

If the theme uses custom variants (e.g., `body3`) or doesn't use some MUI defaults (e.g., `h4`, `h5`, `h6`, `caption`, `overline`), generate `src/types/typings.d.ts` to add/disable variants. See @knowledge/04-mui-theming.md for the exact pattern (CSSProperties comes from `react`). Add `import type {} from '@mui/material/themeCssVarsAugmentation';` when overrides reference `theme.vars`.

### Step 8: Create components.ts

Override MUI components. Disable ripple and elevation by default. Each component group has specific requirements:

**Button family:**
- MuiButtonBase — disable ripple
- MuiButton — sizes (small, medium, large), variant styles (contained, outlined, text) with hover/active/disabled
- MuiIconButton — root with hover/active/disabled, colorPrimary/colorSecondary variants, sizeSmall/sizeMedium

**TextField family (all 5 required):**
- MuiTextField — `defaultProps: { variant: 'filled', size: 'small' }`
- MuiFilledInput — `defaultProps: { disableUnderline: true, placeholder: ' ' }`, root states (hover, focused with inset box-shadow, filled via `:has(input:not(:placeholder-shown))`, error, disabled, disabled+filled), input slot (padding, WebkitTextFillColor for disabled)
- MuiInputLabel — root typography (body1) + color states (focused, error, disabled), shrink (body2, fontWeight 600)
- MuiInputAdornment — positionStart/positionEnd margins
- MuiFormControl — `:has()` selectors for label positioning when start adornment is present

**Other:** MuiPaper, MuiDialog, MuiTypography, MuiChip, MuiTab, etc.

**v9 rules:** no composed classes in selectors (`.MuiButton-textPrimary` is gone — use `.MuiButton-text.MuiButton-colorPrimary` or the `variants: []` array); theme-value-dependent overrides use the `({ theme }) => ({...})` callback with `theme.vars.*`.

### Step 9: Create index.ts

```typescript
import { createTheme } from '@mui/material/styles';
import breakpoints from './breakpoints';
import components from './components';
import palette from './palette';
import typography from './typography';

const theme = createTheme({ cssVariables: true, breakpoints, components, palette, typography });
export default theme;
```

`cssVariables: true` is the house default — enables `theme.vars`, `color-mix()`-derived states, and flicker-free color schemes later. Dark mode ONLY when the design defines it: `colorSchemes` + `theme.applyStyles('dark', ...)` + `<InitColorSchemeScript />` (see @knowledge/04-mui-theming.md).

### Step 10: Wire ThemeProvider

- Next.js: `AppRouterCacheProvider` (from `@mui/material-nextjs/v15-appRouter`) in `src/app/layout.tsx`, theme in `src/app/[locale]/providers.tsx`
- React: wrap in `src/App.tsx`

### Step 11: Validate

```bash
yarn build
```
