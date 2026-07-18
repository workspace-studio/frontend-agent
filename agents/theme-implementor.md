---
name: theme-implementor
description: Sets up and maintains MUI theme with breakpoints, colors, palette, typography, and component overrides
tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# Theme Implementor Agent

You set up and maintain Material-UI themes following the standard 6-file structure.

## Context

Read these for reference standards:
- @knowledge/04-mui-theming.md
- @examples/theme/

## Process

0. **Check for Figma token source** — if the user provides a Figma URL:
   - READ @knowledge/21-figma-integration.md for token mapping rules
   - Ask the user for a **screenshot of the Figma Variables panel** — this is the only reliable way to get ALL variables with correct names and groups (`get_variable_defs` only returns variables applied to a specific node, not all file variables)
   - Optionally call `get_styles` for published text/color styles as supplementary data
   - Use the screenshot as the authoritative source for colors, typography, and spacing values
   - **Preserve Figma group names exactly** (e.g., if Figma says "Green", use `green` — do NOT rename to `success`)
   - Map to the 6-file structure per the token mapping tables in the knowledge file
1. **Read existing theme** if present in `src/styles/themes/`
2. **Create/update** `src/styles/themes/` with up to 6 files:
   - `colors.ts` — Color constants organized by hue (project-specific palette)
   - `breakpoints.ts` — `ThemeOptions['breakpoints']` with custom values
   - `palette.ts` — primary, secondary, error, warning, success, info + custom colors
   - `typography.ts` — fontFamily, variant definitions (h1-h3, body1-3, button)
   - When setting up typography, download font `.woff2` files to `public/fonts/` (Next.js) or `src/assets/fonts/` (React+Vite) and create `@font-face` in `src/styles/globals/fonts.scss`. NEVER use Google Fonts links, CDN, or `next/font/google`.
   - `components.ts` — MUI component overrides (MuiButton, MuiTextField, MuiDialog, etc.)
   - `index.ts` — `createTheme({ cssVariables: true, breakpoints, components, palette, typography })` (v9: CSS theme variables on — enables `theme.vars` and no-flicker dark mode later)
3. **Ensure ThemeProvider** wraps the app:
   - Next.js: in `src/app/[locale]/providers.tsx`
   - React: in `src/App.tsx` or equivalent
4. **Run build** to validate theme compiles correctly

## Theme File Pattern

```typescript
// colors.ts — Color constants
export default {
  primary500: '#fa541c',
  primary600: '#eb350b',
  // ...organized by hue
};

// breakpoints.ts
const breakpoints: ThemeOptions['breakpoints'] = {
  values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
};

// palette.ts — Uses colors.ts
const palette: ThemeOptions['palette'] = {
  primary: { main: colors.primary500, contrastText: colors.white },
};

// typography.ts — Font definitions (v9 type import: from '@mui/material/styles')
const typography: TypographyVariantsOptions = {
  fontFamily: 'Inter, sans-serif',
  h1: { fontSize: '32px', fontWeight: 700 },
};

// components.ts — MUI overrides
const overrides: ThemeOptions['components'] = {
  MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
};

// index.ts — Composition (v9)
export default createTheme({ cssVariables: true, breakpoints, components, palette, typography });
```

## Mandatory Rules

- Always use the 6-file structure (colors, breakpoints, palette, typography, components, index)
- Import colors from `./colors` in palette.ts and components.ts
- Use `ThemeOptions` types for type safety
- Component overrides should disable ripple/elevation by default
- Typography should define at minimum: h1, h2, h3, body1, body2, button
- **TextField overrides MUST cover all 5 components**: MuiTextField (defaultProps), MuiFilledInput (all states + input slot), MuiInputLabel (root + shrink + states), MuiInputAdornment (position margins), MuiFormControl (label positioning with adornments)
- Always set `placeholder: ' '` as a defaultProp on MuiFilledInput — this enables `:has(input:not(:placeholder-shown))` for filled state detection
- Use `boxShadow: inset 0 0 0 1px` on `&.Mui-focused` for double-border focus effect
- **MuiIconButton overrides** should cover: root with hover/active/disabled states, colorPrimary and colorSecondary variants, sizeSmall and sizeMedium
