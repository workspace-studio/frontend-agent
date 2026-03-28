---
name: setup-forms
description: Set up the form system — copy Form/FormInput/Select/Autocomplete from shared-components and generate MUI input overrides from Figma
---

# Setup Forms

Set up the complete form system in the project. Usage: `/setup-forms https://figma.com/design/.../Input-Fields`

## Pre-Work

1. READ @knowledge/07-forms-validation.md for form patterns
2. READ @knowledge/04-mui-theming.md for MUI override patterns
3. READ @examples/shared-components/ to see available form components
4. CHECK if form components already exist in `src/components/`
5. CHECK if `src/styles/themes/components.ts` exists

## Steps

### Step 1: Copy Form Components

Copy these from `@examples/shared-components/` to `src/components/`:

| Component | What it does |
|-----------|-------------|
| `Form/` | react-hook-form useForm + FormProvider wrapper |
| `FormInput/` | Controller + MUI TextField wrapper (label, validation, adornments) |
| `Select/` | MUI Select + MenuItem wrapper |
| `Autocomplete/` | MUI Autocomplete wrapper |

For each component:
1. Read source from `@examples/shared-components/{Name}/`
2. Copy ALL files (.tsx, .module.scss if exists, index.ts)
3. Copy required SvgIcons (e.g., ChevronDown for Select)
4. Fix import paths if project uses different aliases

Do NOT copy components that already exist in the project.

### Step 2: Read Figma Input Design

If a Figma URL was provided:

1. Use Figma MCP to read the Input Fields frame
2. Extract these properties for EACH input state (default, hover, focus, error, disabled, filled):
   - **Border**: color, width, radius
   - **Background**: color per state
   - **Label**: color, font-size, font-weight (both normal and shrunk/floating)
   - **Input text**: color, font-size, padding
   - **Placeholder**: color
   - **Helper text**: color, font-size
   - **Adornment/icon**: color, size
   - **Focus indicator**: box-shadow or border change
   - **Error state**: border color, label color, helper text color
   - **Disabled state**: border color, background, text color (WebkitTextFillColor)
   - **Filled state** (has value, not focused): border color, background

3. Map Figma values to `colors.ts` constants — NEVER hardcode hex in overrides

### Step 3: Generate MUI Input Overrides

Add/update these overrides in `src/styles/themes/components.ts`:

**MuiTextField** — defaultProps (variant, size)

**MuiFilledInput** — the most complex override:
- `defaultProps`: `disableUnderline: true`, `placeholder: ' '`
- `root`: border, borderRadius, backgroundColor, overflow
- `root:hover`: borderColor, backgroundColor
- `root.Mui-focused`: borderColor, boxShadow (inset), backgroundColor
- `root:not(.Mui-disabled):not(.Mui-error):not(.Mui-focused):has(input:not(:placeholder-shown))`: filled state
- `root.Mui-error`: borderColor, backgroundColor, color
- `root.Mui-disabled`: borderColor, backgroundColor
- `root.Mui-disabled:has(input:not(:placeholder-shown))`: disabled + filled
- `input`: paddingTop, paddingBottom
- `input.Mui-disabled`: WebkitTextFillColor

**MuiInputLabel** — label positioning and colors:
- `root`: typography (body1), color, focused/error/disabled states
- `shrink`: typography (body2), fontWeight 600, color

**MuiInputAdornment** — spacing:
- `positionStart`: marginRight
- `positionEnd`: marginLeft

**MuiFormControl** — label offset when start adornment present:
- `:has(.MuiInputLabel-filled:not(.MuiInputLabel-shrink)) .MuiInputAdornment-positionStart`: marginTop fix
- `:has(.MuiInputBase-adornedStart) .MuiInputLabel-filled:not(.MuiInputLabel-shrink)`: transform offset

**MuiSelect** — if Select component was copied:
- Icon color, padding, border matching FilledInput

### Step 4: Add Missing Colors

If Figma uses colors not yet in `src/styles/themes/colors.ts`, add them.
Also add corresponding SCSS variables to `src/styles/settings/variables.scss`.

### Step 5: Validate

```bash
yarn build && yarn lint
```

Render a test page with all input states to verify visually:
- Empty input with label
- Focused input
- Filled input (has value)
- Error state with helper text
- Disabled state (empty + filled)
- Input with start/end adornment

## Rules

- Copy source code exactly — do NOT modify component logic
- ALL colors via `colors.xxx` constants — NEVER hardcode hex in overrides
- The `:has()` selectors in MuiFormControl are critical for label positioning with adornments — do not skip
- `placeholder: ' '` on MuiFilledInput is required for the floating label animation to work
- If no Figma URL is provided, copy components only and skip override generation
- NEVER overwrite existing components — skip if they already exist
