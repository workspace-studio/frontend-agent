# MUI Theming

## Theme Structure

The MUI theme is organized in 6 files under `src/styles/themes/`:

```
themes/
├── colors.ts          # Color constants
├── breakpoints.ts     # Breakpoint values
├── palette.ts         # MUI palette mapping
├── typography.ts      # Font variants
├── components.ts      # Component overrides
└── index.ts           # Theme composition
```

## colors.ts

Define project color constants organized by hue:

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
import type { ThemeOptions } from '@mui/material';

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
import type { ThemeOptions } from '@mui/material';
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

```typescript
import type { TypographyOptions } from '@mui/material/styles/createTypography';

const typography: TypographyOptions = {
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
import type { CSSProperties } from '@mui/material/styles/createTypography';

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

Override MUI components for consistent look:

```typescript
import type { ThemeOptions } from '@mui/material';
import colors from './colors';
import typography from './typography';

const overrides: ThemeOptions['components'] = {
  MuiButtonBase: {
    defaultProps: { disableTouchRipple: true, disableRipple: true },
  },
  MuiButton: {
    defaultProps: { variant: 'contained' },
    styleOverrides: {
      root: { borderRadius: 8, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      sizeMedium: { ...typography.body2, paddingInline: '12px', height: 36 },
      sizeLarge: { ...typography.body1, paddingInline: '16px', height: 48, borderRadius: 12 },
      contained: {
        backgroundColor: colors.orange500,
        color: colors.white,
        '&:hover': { backgroundColor: colors.orange600 },
        '&:disabled': { backgroundColor: colors.orange200, color: colors.orange300 },
      },
      outlined: {
        borderColor: colors.black100,
        color: colors.grayBlue600,
        '&:hover': { backgroundColor: colors.grayBlue50 },
      },
    },
  },
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      rounded: { borderRadius: 12, padding: 16 },
    },
  },
  MuiTextField: {
    defaultProps: { variant: 'filled' },
  },
  MuiFilledInput: {
    defaultProps: { disableUnderline: true },
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: `1px solid ${colors.grayBlue200}`,
        backgroundColor: colors.white,
        '&:hover': { borderColor: colors.grayBlue400, backgroundColor: colors.white },
        '&.Mui-focused': { borderColor: colors.grayBlue600, backgroundColor: colors.white },
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { padding: 0, maxWidth: 704, maxHeight: '90vh' },
    },
  },
  MuiTypography: {
    defaultProps: { variant: 'body2' },
  },
};

export default overrides;
```

## index.ts

```typescript
import { createTheme } from '@mui/material';
import breakpoints from './breakpoints';
import components from './components';
import palette from './palette';
import typography from './typography';

const theme = createTheme({ breakpoints, components, palette, typography });
export default theme;
```

## ThemeProvider Wiring

**Next.js** — in `src/app/[locale]/providers.tsx`:
```tsx
'use client';
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/themes';

const Providers = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
```

**React** — in `src/App.tsx`:
```tsx
import { ThemeProvider } from '@mui/material';
import theme from '@/styles/themes';

const App = () => (
  <ThemeProvider theme={theme}>
    <AppRouter />
  </ThemeProvider>
);
```
