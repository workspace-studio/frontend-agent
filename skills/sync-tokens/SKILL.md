---
name: sync-tokens
description: Extract design tokens from Figma and sync to MUI theme files — incremental diff with user approval
---

# Sync Tokens

Extract design tokens from Figma and sync to the MUI theme. Usage: `/sync-tokens`

**Partial sync flags:**
- `/sync-tokens --colors-only` — sync only color tokens
- `/sync-tokens --typography-only` — sync only typography tokens
- `/sync-tokens --all` — sync everything (default)

## Pre-Work

1. READ the project's CLAUDE.md for project-specific instructions
2. READ @knowledge/21-figma-integration.md for token mapping rules
3. READ @knowledge/04-mui-theming.md for theme file structure
4. READ existing theme files from `src/styles/themes/`

## Steps

### Step 1: Request Variables Panel Screenshot

Ask the user:
> "Please paste a screenshot of your Figma Variables panel showing all tokens (colors, spacing, typography). This is the most reliable way to capture ALL variables with their exact names and groups.
>
> In Figma: click the Variables icon (◆) → expand all groups → take a screenshot."

**Why screenshot is required:** Figma MCP's `get_variable_defs` only returns variables applied to a specific node, NOT all variables defined in the file. A screenshot of the Variables panel is the only reliable way to get the complete list with correct names and group structure.

**Typography fallback:** If typography is not defined as Variables, also ask for a screenshot of the **Text Styles** panel:
> "If your typography is defined as Text Styles (not Variables), please also paste a screenshot of the Text Styles panel.
>
> In Figma: right sidebar → Design → Local styles (text icon `Aa`) → screenshot all text styles."

Typography can come from either source — Variables or Text Styles. Use whichever is present.

If the user also provides a Figma URL, use `get_styles` as a **supplementary** source for published text and color styles — but the screenshot is the primary source of truth for variable definitions.

### Step 2: Parse Screenshot

Extract from the Variables panel screenshot:
- **Group names** exactly as shown (e.g., Green, Gray, Red, Blue — use Figma's names, do NOT rename)
- **Variable names** within each group (e.g., green/100, green/200, green/300)
- **Hex values** for each variable
- **Collection structure** (e.g., "Colors" collection, "Spacing" collection)

**Critical:** Preserve the exact group names from Figma. If Figma calls it "Green", use `green` — do NOT rename to `success` or `emerald` or anything else.

**If typography comes from Text Styles** (not Variables):
- Extract style names exactly as shown (e.g., Heading/H1, Body/Regular, Button/Label)
- Extract font family, size, weight, line-height for each style
- Map to MUI typography variants (h1, h2, h3, body1, body2, body3, button)

### Step 3: Read Existing Theme

Read all current theme files:
- `src/styles/themes/colors.ts`
- `src/styles/themes/palette.ts`
- `src/styles/themes/typography.ts`
- `src/styles/themes/components.ts`
- `src/styles/themes/breakpoints.ts`
- `src/styles/themes/index.ts`

Also read SCSS variables (REQUIRED sync target):
- `src/styles/settings/_variables.scss`

### Step 4: Generate Diff Report

Compare Figma tokens against existing theme files. Apply partial sync filter if specified.

**Color diff:**
```
COLORS DIFF
═══════════════════════════════════════
  + NEW     blue500: '#1976d2'         (Figma: colors/blue/500)
  ~ CHANGED orange500: '#eb350b'       (was: '#fa541c', Figma: colors/primary/500)
  = SAME    black900: '#3d3d3d'
  = SAME    white: '#ffffff'
═══════════════════════════════════════
```

**Typography diff:**
```
TYPOGRAPHY DIFF
═══════════════════════════════════════
  ~ CHANGED h1.fontSize: '36px'       (was: '32px')
  + NEW     subtitle1: { fontSize: '20px', fontWeight: 500 }
  = SAME    body1, body2, button
═══════════════════════════════════════
```

**Component override diff:**
```
COMPONENTS DIFF
═══════════════════════════════════════
  ~ CHANGED MuiButton borderRadius: 12  (was: 8)
  ~ CHANGED MuiPaper padding: 24        (was: 16)
  = SAME    MuiFilledInput, MuiDialog
═══════════════════════════════════════
```

### Step 5: Present for Approval

Show the complete diff report and ask the user:
> "Apply these changes? You can also respond with specific items to include/exclude."

**NEVER auto-apply.** Always wait for user approval.

### Step 6: Apply Changes

On approval, update theme files. **Figma tokens override existing values — do NOT keep default/placeholder colors that aren't defined in Figma.**

1. **colors.ts** — **Replace** the entire color definitions with Figma values. Group by Figma group names (Green, Gray, Red, etc.). Use camelCase naming: `green50`, `green100`, `gray950`, etc.

2. **`_variables.scss`** (MANDATORY) — Sync every color from `colors.ts` to SCSS format. This is NOT optional.

   Format:
   ```scss
   @use 'sass:map';

   // Colors — synced with Figma variables
   $black: #000000;
   $white: #ffffff;

   // Green
   $green-50: #f2fcfa;
   $green-100: #d3f8ef;
   $green-200: #a6f0df;
   $green-300: #75e1cc;
   $green-400: #4fcab5;
   $green-500: #3aae9c;
   $green-600: #2d8c80;
   $green-700: #256f67;
   $green-800: #205a54;
   $green-900: #1d4b46;
   $green-950: #0b2d2b;

   // Gray
   $gray-50: #f6f6f6;
   $gray-100: #e7e7e7;
   ...
   ```

   Rules for `_variables.scss`:
   - `@use 'sass:map';` at the top
   - `$black` and `$white` base colors first
   - Each Figma group as a commented section header (e.g., `// Green`, `// Gray`, `// Red`)
   - Kebab-case variable names: `$green-50`, `$gray-950`, `$red-500`
   - Every color in `colors.ts` must have a corresponding SCSS variable

3. **palette.ts** — Update semantic mappings if colors changed. Always reference `colors.ts`.
4. **typography.ts** — Update font sizes, weights, families. Keep variant structure.
   If typography sync includes new font families not already in the project:
   - Download the `.woff2` files for the new font
   - Save to `public/fonts/` (Next.js) or `src/assets/fonts/` (React+Vite)
   - Add `@font-face` declarations to `src/styles/globals/fonts.scss`
   - NEVER use Google Fonts links or CDN — always local `.woff2` files
5. **components.ts** — Update overrides (borderRadius, padding, spacing). Reference `colors.ts` and `typography.ts`.

6. **typings.d.ts** (MANDATORY when custom or disabled variants exist) — Generate `src/types/typings.d.ts`:
   - Compare Figma text styles against MUI defaults (`h1`-`h6`, `subtitle1`-`2`, `body1`-`2`, `caption`, `overline`, `button`)
   - Any MUI default NOT present in Figma → disable with `false`
   - Any Figma style NOT in MUI defaults → add as custom variant with `true`

   Example:
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

### Step 7: Validate

```bash
yarn build         # Must compile with updated theme
yarn lint          # Must pass
```

### Step 8: Report

```
═══════════════════════════════════════════
TOKEN SYNC COMPLETE
═══════════════════════════════════════════
Source:       Variables panel screenshot
Scope:        All / Colors only / Typography only
Changes:
  colors.ts:        3 added, 1 updated, 2 removed (defaults)
  _variables.scss:  synced (all colors)
  palette.ts:       1 updated
  typography.ts:    1 added, 1 updated
  typings.d.ts:     3 disabled, 1 custom variant added
  components.ts:    2 updated
Build:          Pass
═══════════════════════════════════════════
```

## Rules

- **Override existing defaults** — Figma tokens replace existing values entirely; do NOT keep placeholder colors that aren't defined in Figma
- **NEVER auto-apply** — always present diff and wait for approval
- **Always reference colors.ts in palette.ts** — never hardcode hex in palette
- **Follow the 6-file theme structure** from @knowledge/04-mui-theming.md
- **Preserve Figma group names** — if Figma says "Green", use `green` not `success` or `emerald`
- **colors.ts naming**: camelCase + scale (e.g., `green200`, `grayBlue200`)
- **_variables.scss naming**: kebab-case + scale (e.g., `$green-200`, `$gray-blue-200`)
- **Always sync `_variables.scss`** — every color in `colors.ts` must have a corresponding SCSS variable in `_variables.scss`
- **Screenshot is source of truth** — never rely solely on `get_variable_defs` for the complete token list
- **Incremental by design** — only sync what changed, not full reimport
