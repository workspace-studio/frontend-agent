# MUI Theming (Material UI v9)

Current major: **v9** (9.2.0). Note: there is NO Material UI v8 — versioning jumped v7 → v9 to align with MUI X. Upgrading an older project first → @knowledge/27-mui-v9-migration.md.

## Theme Structure

The MUI theme is organized in 6 files under `src/styles/themes/`:

```
themes/
├── colors.ts          # Color constants
├── breakpoints.ts     # Breakpoint values
├── palette.ts         # MUI palette mapping
├── typography.ts      # Font variants
├── components.ts      # Component overrides
└── index.ts           # Theme composition (cssVariables: true)
```

## colors.ts

Define project color constants organized by hue (Figma group names preserved exactly):

```typescript
export default {
  black900: '#3d3d3d',
  black800: '#454545',
  black500: '#6d6d6d',
  black200: '#d1d1d1',
  black100: '#e7e7e7',
  black50: '#f6f6f6',
  orange600: '#eb350b',
  orange500: '#fa541c',
  orange400: '#fc743b',
  orange300: '#fc9d6e',
  orange200: '#fecaaa',
  orange50: '#fff4ed',
  grayBlue600: '#476882',
  grayBlue400: '#7b9db5',
  grayBlue200: '#d1dde6',
  grayBlue100: '#eaeff4',
  grayBlue50: '#f5f8fa',
  green300: '#60e8cb',
  yellow300: '#ffd64a',
  red600: '#e70808',
  white: '#ffffff',
  black: '#000000',
};
```

## breakpoints.ts

```typescript
import{ ThemeOptions } from '@mui/material';

const breakpoints: ThemeOptions['breakpoints'] = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

export default breakpoints;
```

## palette.ts

```typescript
import{ ThemeOptions } from '@mui/material';
import colors from './colors';

const palette: ThemeOptions['palette'] = {
  primary: { main: colors.orange500, contrastText: colors.white },
  secondary: { main: colors.black900, contrastText: colors.white },
  error: { main: colors.red600 },
  warning: { main: colors.yellow300 },
  success: { main: colors.green300 },
  info: { main: colors.black500 },
};

export default palette;
```

## typography.ts

v9 type import comes from `@mui/material/styles` — the old deep import `@mui/material/styles/createTypography` is private API; don't use it:

```typescript
import type { TypographyVariantsOptions } from '@mui/material/styles';

const typography: TypographyVariantsOptions = {
  allVariants: { lineHeight: 'normal' },
  fontFamily: 'Inter, sans-serif',
  h1: { fontSize: '32px', fontWeight: 700, lineHeight: '110%', fontFamily: 'Poppins, sans-serif' },
  h2: { fontSize: '24px', fontWeight: 700, fontFamily: 'Poppins, sans-serif' },
  h3: { fontSize: '18px', fontWeight: 600, fontFamily: 'Poppins, sans-serif' },
  body1: { fontSize: '16px' },
  body2: { fontSize: '14px' },
  button: { fontSize: '14px', fontWeight: 600, textTransform: 'none' },
};

export default typography;
```

## typings.d.ts

When the project uses custom typography variants (e.g., `body3`) or disables unused MUI defaults (e.g., `h4`, `h5`, `h6`, `caption`, `overline`), create `src/types/typings.d.ts`:

```typescript
import type { CSSProperties } from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body3: CSSProperties;
  }
  interface TypographyVariantsOptions {
    body3?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h4: false;
    h5: false;
    h6: false;
    caption: false;
    overline: false;
    body3: true;
  }
}
```

- Disable any MUI default variant NOT used in the project's design system
- Add any custom variant that exists in Figma but not in MUI defaults
- Using `theme.vars` in TypeScript? Add once (e.g., in typings.d.ts): `import type {} from '@mui/material/themeCssVarsAugmentation';`

Apply the same pattern to **any MUI component with variant overrides** (Button, Chip, TextField, etc.):

```typescript
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    outlined: false;
    containedError: true;
    containedSecondary: true;
  }
}
```

- If the design system only defines `contained` and `containedSecondary` buttons, disable `outlined` and `text`
- If custom variants exist (e.g., `containedError`), add them with `true`
- This ensures TypeScript enforces only the variants your design system actually uses

## components.ts

Override MUI components for consistent look. Import both `colors` and `typography` for use in overrides.

**v9 notes for overrides:**
- `styleOverrides.root` accepts a callback `({ theme, ownerState }) => ({ ... })` — use it when an override needs theme values, and reference `theme.vars.palette.*` inside (resolves to `var(--mui-...)`)
- Composed CSS classes are REMOVED on: Alert, Button, ButtonGroup, Chip, CircularProgress, Dialog, Drawer, ImageListItemBar, LinearProgress, PaginationItem, Select, Slider, StepConnector, TableSortLabel, Tab, Tabs, ToggleButtonGroup. `.MuiButton-textPrimary` no longer exists — target `.MuiButton-text.MuiButton-colorPrimary`, or better: the `variants: [{ props, style }]` array. (IconButton's `.MuiIconButton-colorPrimary` is NOT affected.)
- `MuiTouchRipple` is no longer a theme components key — style ripples via `MuiButtonBase` + `& .MuiTouchRipple-root`

### Button & IconButton

```typescript
MuiButtonBase: {
  defaultProps: { disableTouchRipple: true, disableRipple: true },
},
MuiButton: {
  defaultProps: { variant: 'contained' },
  styleOverrides: {
    root: { borderRadius: 8, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
    sizeMedium: { ...typography.body2, paddingInline: '12px', height: 36 },
    contained: { backgroundColor: colors.primary, '&:hover': { backgroundColor: colors.primaryDark } },
  },
},
MuiIconButton: {
  styleOverrides: {
    root: {
      borderRadius: 8, backgroundColor: colors.gray50,
      '&:hover': { backgroundColor: colors.gray100 },
      '&.Mui-disabled': { backgroundColor: colors.gray50, color: colors.gray200 },
      // Color variants nest inside root
      '&.MuiIconButton-colorPrimary': { backgroundColor: 'transparent', ... },
      '&.MuiIconButton-colorSecondary': { backgroundColor: 'transparent', ... },
    },
    sizeSmall: { padding: 8 },
    sizeMedium: { padding: 12 },
  },
},
```

### TextField family (5 components)

TextField overrides require **5 coordinated MUI components**:

**Placeholder trick** — set `placeholder: ' '` as a defaultProp on MuiFilledInput. This enables the CSS selector `:has(input:not(:placeholder-shown))` to detect when the input has a value (filled state), allowing different styling for empty vs filled inputs.

**Focus double-border effect** — use `boxShadow: inset 0 0 0 1px ${color}` on `&.Mui-focused` to create a visual double border without changing layout.

```typescript
MuiTextField: {
  defaultProps: { variant: 'filled', size: 'small' },
},
MuiFilledInput: {
  defaultProps: { disableUnderline: true, placeholder: ' ' },
  styleOverrides: {
    root: {
      borderRadius: 12, border: '1px solid ...', backgroundColor: 'transparent',
      '&:hover': { borderColor: '...', backgroundColor: 'transparent' },
      '&.Mui-focused': { borderColor: '...', boxShadow: 'inset 0 0 0 1px ...' },
      // Filled state — white bg when user has typed something
      '&:not(.Mui-disabled):not(.Mui-error):not(.Mui-focused):has(input:not(:placeholder-shown))': {
        backgroundColor: colors.white, borderColor: '...',
      },
      '&.Mui-error': { borderColor: colors.red, color: colors.red },
      '&.Mui-disabled': { borderColor: '...lighter...' },
      '&.Mui-disabled:has(input:not(:placeholder-shown))': {
        backgroundColor: colors.white, // disabled but has value
      },
    },
    input: {
      paddingTop: 20, paddingBottom: 3,
      '&.Mui-disabled': { WebkitTextFillColor: colors.gray200 },
    },
  },
},
MuiInputLabel: {
  styleOverrides: {
    root: {
      ...typography.body1, color: colors.gray400,
      '&.Mui-focused': { color: colors.gray600 },
      '&.Mui-error': { color: colors.red },
      '&.Mui-disabled': { color: colors.gray200 },
    },
    shrink: { ...typography.body2, fontWeight: 600, color: colors.gray800 },
  },
},
MuiInputAdornment: {
  styleOverrides: {
    positionStart: { marginRight: 6 },
    positionEnd: { marginLeft: 6 },
  },
},
MuiFormControl: {
  styleOverrides: {
    root: {
      // Reset adornment margin when label is not shrunk
      '&:has(.MuiInputLabel-filled:not(.MuiInputLabel-shrink)) .MuiInputAdornment-positionStart': {
        marginTop: '0 !important',
      },
      // Shift label right when start adornment present
      '&:has(.MuiInputBase-adornedStart) .MuiInputLabel-filled:not(.MuiInputLabel-shrink)': {
        transform: 'translate(42px, 13px) scale(1)',
      },
    },
  },
},
```

**Usage side (v9):** the per-instance equivalents are `slotProps.input`, `slotProps.htmlInput`, `slotProps.inputLabel`, `slotProps.formHelperText` — the old `InputProps`/`inputProps`/`InputLabelProps`/`FormHelperTextProps` props are REMOVED.

See `@examples/theme/components.ts` for a complete working implementation.

## index.ts — theme composition (v9)

Enable **CSS theme variables** — the v9-era standard. The theme is emitted as CSS custom properties (`--mui-palette-primary-main`, …), `theme.vars` becomes available in overrides/sx, and dark mode (if ever added) switches without SSR flicker:

```typescript
import { createTheme } from '@mui/material/styles';

import breakpoints from './breakpoints';
import components from './components';
import palette from './palette';
import typography from './typography';

const theme = createTheme({
  cssVariables: true,
  breakpoints,
  components,
  palette,
  typography,
});

export default theme;
```

- In overrides/sx prefer `theme.vars.palette.primary.main` over `theme.palette.primary.main`; outside a provider use the fallback `(theme.vars || theme).palette.primary.main`
- v9 derives hover/overlay colors with native `color-mix()` — no precomputed alternates needed
- Configurable: `cssVariables: { cssVarPrefix: 'app', colorSchemeSelector: 'class' }`

### Dark mode (only when the design defines it)

```typescript
const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: { light: true, dark: true }, // or full palettes per scheme
});
```

- In component styles: `theme.applyStyles('dark', { ... })` — NEVER `theme.palette.mode === 'dark'` checks (SSR flicker)
- Toggling: `useColorScheme()` → `{ mode, setMode }`
- SSR (Next.js): render `<InitColorSchemeScript attribute="class" />` first inside `<body>` in the root layout

## ThemeProvider Wiring

**Next.js (App Router)** — two pieces. Emotion cache for streaming SSR in `src/app/layout.tsx` (`yarn add @mui/material-nextjs @emotion/cache`):

```tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'; // same path serves Next 15/16

<body>
  <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
</body>
```

Theme in `src/app/[locale]/providers.tsx`:

```tsx
'use client';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/themes';

const Providers = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
```

Next.js 16 note: wrap `next/link` in a small client component before passing it to MUI's `component` prop.

**React (Vite)** — in `src/App.tsx`:

```tsx
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/styles/themes';

const App = () => (
  <ThemeProvider theme={theme}>
    <AppRouter />
  </ThemeProvider>
);
```

## Engine notes

Emotion is still the styled engine in v9 (`@emotion/react` + `@emotion/styled` peers unchanged). Pigment CSS (zero-runtime) is officially **on hold** — do not adopt it. React 17/18/19 all supported; TypeScript ≥ 4.9.
