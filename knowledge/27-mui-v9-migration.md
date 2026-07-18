# MUI v9 Migration Cheat Sheet (upgrading existing projects)

Read when: a project is on Material UI v5/v6/v7 and needs the current major. There is **no v8** — Material UI jumped v7 → v9 to align versioning with MUI X. Docs: `https://mui.com/material-ui/migration/upgrade-to-v9.md` (append `.md` to any docs URL for the markdown twin).

## Order of operations

1. Get to v7 first if older (v5→v6→v7 guides + codemods), THEN v7→v9
2. `yarn add @mui/material@^9 @mui/icons-material@^9` (Emotion peers unchanged)
3. Run the codemods (below), then fix what they can't reach (composed classes in SCSS, DOM/semantics assumptions in tests)
4. MUI X packages move to their own v9 majors together (`@mui/x-date-pickers@^9` etc.)
5. `yarn build && yarn lint` + visual pass on forms, menus, dialogs, pickers

## Codemods (run these before manual fixes)

```bash
npx @mui/codemod@latest deprecations/all <path>        # v7: converts all deprecated APIs (InputProps→slotProps etc.)
npx @mui/codemod@latest v9.0.0/system-props <path>     # mt/px/... system props → sx
npx @mui/x-codemod@latest v9.0.0/preset-safe <path>    # MUI X (pickers, grid, charts)
```

## Breaking changes that hit OUR patterns

| Area | v5–v7 | v9 |
|---|---|---|
| Customization API | `InputProps`, `inputProps`, `InputLabelProps`, `FormHelperTextProps`, `componentsProps`, `MenuListProps`, `PaperProps`, `TransitionComponent` | **`slots` / `slotProps` only**: `slotProps.input`, `slotProps.htmlInput`, `slotProps.inputLabel`, `slotProps.formHelperText`, `slotProps.list`, `slotProps.paper`, `slotProps.transition` |
| Grid | `GridLegacy`, `Grid2 as Grid`, `item`/`xs` props | `import { Grid } from '@mui/material'` + `size={{ xs: 12, sm: 6 }}` — GridLegacy/aliases removed |
| System props | `<Box mt={2} px={3}>` | removed — `<Box sx={{ mt: 2, px: 3 }}>` |
| Autocomplete | `renderTags`, `getTagProps`, `ChipProps`, `params.InputProps` | `renderValue`, `getItemProps`, `slotProps.chip`, `params.slotProps?.input` / `params.slotProps.htmlInput` |
| Composed classes | `.MuiButton-textPrimary`, `.MuiAlert-standardSuccess`, … | removed on Alert, Button, ButtonGroup, Chip, CircularProgress, Dialog, Drawer, ImageListItemBar, LinearProgress, PaginationItem, Select, Slider, StepConnector, TableSortLabel, Tab, Tabs, ToggleButtonGroup → target `.MuiButton-text.MuiButton-colorPrimary` or theme `variants: []`. **Grep SCSS modules too** — codemods don't touch them |
| Dialog/Modal | `disableEscapeKeyDown` | removed → `onClose={(e, reason) => reason !== 'escapeKeyDown' && close()}` |
| ButtonBase | `onClick: ReactMouseEvent` narrowings | passes native-flavored `MouseEvent`; custom `component` needs `nativeButton` prop |
| Semantics | Stepper `<div>`s, `<TextField select>` label `<label>` | Stepper renders `<ol>/<li>`; select label is `<div>` — **update Playwright/RTL selectors** (`getByLabelText` breaks) |
| Keyboard nav | Menu/Tabs tab through items | roving tabindex — one Tab stop, arrows navigate (update e2e flows) |
| Icons | `*Outline` names | `*Outlined` only |
| TouchRipple | `MuiTouchRipple` theme key | style via `MuiButtonBase` + `& .MuiTouchRipple-root` |
| Typography types | `@mui/material/styles/createTypography` deep import | `import type { TypographyVariantsOptions } from '@mui/material/styles'` |
| Theme defaults | precomputed hover/dark values | derived via native `color-mix()`; `cssVariables: true` is the house default (see @knowledge/04-mui-theming.md) |

## MUI X v9 (pickers — hits our DatePicker shared components)

- `PickersDay` → **`PickerDay`**, `PickersDayProps` → `PickerDayProps`, theme key `MuiPickersDay` → `MuiPickerDay`
- Classes: `.MuiPickersDay-*` → `.MuiPickerDay-*`; `hiddenDaySpacingFiller`/`hiddenDayFiller` → **`fillerCell`**; `outsideCurrentMonth` → `dayOutsideMonth`; `dayWithMargin`/`dayWithoutMargin` removed
- Day cell is now a **single ButtonBase** — selection/today highlights via `::before`/`::after` pseudo-elements; custom day styling that targeted nested elements needs a re-check
- Field/picker text field customization nests as `slotProps.textField.slotProps.{input,htmlInput,...}`

## Post-migration checklist

- [ ] `grep -rn "InputProps\|componentsProps\|renderTags\|getTagProps\|Grid2\|GridLegacy\|PickersDay\|hiddenDay"` returns nothing
- [ ] `grep -rn "MuiButton-text[A-Z]\|MuiAlert-standard\|MuiChip-label[A-Z]"` in `.scss` and `.tsx` returns nothing (composed classes)
- [ ] Playwright component tests green — pay attention to label/select/stepper selectors and menu keyboard flows
- [ ] Visual pass: forms (adornments/labels), dialogs, pickers at both sizes
- [ ] `typings.d.ts` still compiles (variant overrides unchanged in v9)
