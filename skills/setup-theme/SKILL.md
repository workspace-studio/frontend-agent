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

### Step 5: Create typography.ts

Define fontFamily and variant overrides (h1, h2, h3, body1, body2, button).

### Step 6: Create components.ts

Override MUI components: MuiButton (sizes, variants), MuiTextField, MuiFilledInput, MuiDialog, MuiPaper, MuiChip, MuiTab, etc. Disable ripple and elevation by default.

### Step 7: Create index.ts

```typescript
import { createTheme } from '@mui/material';
import breakpoints from './breakpoints';
import components from './components';
import palette from './palette';
import typography from './typography';

const theme = createTheme({ breakpoints, components, palette, typography });
export default theme;
```

### Step 8: Wire ThemeProvider

- Next.js: wrap in `src/app/[locale]/providers.tsx`
- React: wrap in `src/App.tsx`

### Step 9: Validate

```bash
yarn build
```
