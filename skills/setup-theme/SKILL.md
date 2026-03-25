---
name: setup-theme
description: Set up a complete MUI theme with colors, breakpoints, palette, typography, and component overrides
---

# Setup Theme

Set up a complete MUI theme. Usage: `/setup-theme — primary=#1976d2, font=Inter`

## Pre-Work

1. READ @knowledge/04-mui-theming.md for theme patterns
2. READ @examples/theme/ for reference implementation
3. CHECK if `src/styles/themes/` already exists

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

Define fontFamily and variant overrides (h1, h2, h3, body1, body2, button).

### Step 7: Create typings.d.ts (if needed)

If the theme uses custom variants (e.g., `body3`) or doesn't use some MUI defaults (e.g., `h4`, `h5`, `h6`, `caption`, `overline`), generate `src/types/typings.d.ts` to add/disable variants. See @knowledge/04-mui-theming.md for the exact pattern.

### Step 8: Create components.ts

Override MUI components: MuiButton (sizes, variants), MuiTextField, MuiFilledInput, MuiDialog, MuiPaper, MuiChip, MuiTab, etc. Disable ripple and elevation by default.

### Step 9: Create index.ts

```typescript
import { createTheme } from '@mui/material';
import breakpoints from './breakpoints';
import components from './components';
import palette from './palette';
import typography from './typography';

const theme = createTheme({ breakpoints, components, palette, typography });
export default theme;
```

### Step 10: Wire ThemeProvider

- Next.js: wrap in `src/app/[locale]/providers.tsx`
- React: wrap in `src/App.tsx`

### Step 11: Validate

```bash
yarn build
```
