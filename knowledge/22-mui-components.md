# MUI Component Usage (Material UI v9)

## HTML → MUI Mapping

NEVER use raw HTML elements. Always use the MUI equivalent with `component` prop for semantic HTML.

| HTML | MUI Component | Example |
|------|--------------|---------|
| `<div>` | `Box` or `Stack` | `<Stack direction="row" gap={2}>` |
| `<header>` | `AppBar` + `Toolbar` | `<AppBar position="static"><Toolbar>...</Toolbar></AppBar>` |
| `<nav>` | `Stack component="nav"` | `<Stack component="nav" direction="row">` |
| `<main>` | `Box component="main"` | `<Box component="main">` |
| `<section>` | `Container component="section"` | `<Container component="section">` |
| `<footer>` | `Box component="footer"` | `<Box component="footer">` |
| `<aside>` | `Drawer` or `Box component="aside"` | `<Drawer variant="permanent">` |
| `<ul>` / `<li>` | `List` + `ListItem` | `<List><ListItem>...</ListItem></List>` |
| `<table>` | `Table` + `TableHead` + `TableBody` + `TableRow` + `TableCell` | — |
| `<input>` | `TextField` | `<TextField label="Name" />` |
| `<select>` | `Select` or `TextField select` | `<TextField select>` (v9: its label renders a `<div>`, not `<label>`) |
| `<button>` | `Button` or `IconButton` | `<Button variant="contained">` |
| `<a>` | `Link` (next/link) | Wrap with MUI styling via className |
| `<span>` / `<p>` | `Typography` | `<Typography variant="body1">` |
| `<img>` | `Box component="img"` or `next/image` | `<Box component="img" src={...} alt={...} />` |
| `<hr>` | `Divider` | `<Divider />` |
| `<dialog>` | `Dialog` | `<Dialog open={open}>` |

## Semantic HTML via `component` Prop

MUI components accept a `component` prop that changes the rendered HTML element while keeping MUI styling:

```tsx
// ✅ Correct — MUI component with semantic HTML
<Stack component="nav" direction="row" gap={2}>
  <Link href="/">Home</Link>
  <Link href="/about">About</Link>
</Stack>

<Container component="section" className={styles.hero}>
  <Typography component="h1" variant="h1">Title</Typography>
</Container>

// ❌ Wrong — raw HTML elements
<nav className={styles.nav}>
  <a href="/">Home</a>
</nav>
```

## v9 API essentials (write it right the first time)

- **`slots` / `slotProps` is the ONLY customization API** — `components`/`componentsProps` and per-component shortcuts are removed. TextField: `slotProps.input` / `slotProps.htmlInput` / `slotProps.inputLabel` / `slotProps.formHelperText` (old `InputProps`/`inputProps`/`InputLabelProps` are gone). Menu: `slotProps.list` / `slotProps.paper` / `slotProps.transition`. Since 9.2, `slotProps` also accepts `data-*` attributes.
- **Grid**: `import { Grid } from '@mui/material'` with the `size` prop — `<Grid size={{ xs: 12, sm: 6 }}>`. `GridLegacy` and the old `item`/`xs`-props API are removed; don't import `Grid2` aliases.
- **System props are removed** on Box-like components — `mt`/`px`/etc. go through `sx`.
- **Autocomplete**: `renderValue` (not `renderTags`) + `getItemProps` (not `getTagProps`); `renderInput` params follow the TextField shape — spread `params.slotProps?.input`, not `params.InputProps`. `slotProps.chip` replaces `ChipProps`.
- **Dialog/Modal**: no `disableEscapeKeyDown` — handle `onClose={(e, reason) => reason !== 'escapeKeyDown' && ...}`.
- **Semantics changed under you**: Stepper renders `<ol>`/`<li>`; `<TextField select>` label is a `<div>`; Menu/Tabs use roving tabindex; ButtonBase passes `MouseEvent` to onClick and takes `nativeButton` for custom root components.
- **Icons**: `*Outline` icon names are gone — use `*Outlined`.
- **MUI X v9** (aligned major): `PickerDay`/`PickerDayProps`/`MuiPickerDay` (renamed from `PickersDay`), `.MuiPickerDay-fillerCell` replaces `hiddenDaySpacingFiller`, day cell is a single ButtonBase styled via `::before`/`::after`.

Full upgrade path for older projects: @knowledge/27-mui-v9-migration.md.

## MUI Component Categories

**Layout:** Box, Stack, Container, Grid, Toolbar
**Navigation:** AppBar, Drawer, Tabs, Tab, Breadcrumbs, Link, BottomNavigation, Menubar (docs pattern)
**Inputs:** TextField, Select, Checkbox, Radio, Switch, Slider, Autocomplete, Rating, NumberField (docs pattern)
**Data Display:** Typography, Table, List, Chip, Avatar, Badge, Tooltip, Divider
**Feedback:** Dialog, Snackbar, Alert, Skeleton, Backdrop, CircularProgress, LinearProgress
**Surfaces:** Paper, Card, CardContent, CardActions, Accordion, AccordionSummary, AccordionDetails

Note: NumberField and Menubar are v9 docs patterns composed on **Base UI** (`@base-ui/react`) — adding one pulls that dependency; ask before introducing it.

## MUI Docs Lookup (official — MCP + llms.txt)

Before creating a component, fetch up-to-date docs from MUI's own sources:

**1. MUI MCP (preferred when configured)** — the plugin ships `.mcp.json` with the official server (`npx -y @mui/mcp@latest`, stdio):
- `useMuiDocs` — loads the docs catalog for a package (version-aware: resolves `@mui/material@9.x` to the matching docs)
- `fetchDocs` — fetches specific docs pages; use ONLY URLs returned by `useMuiDocs`
- Known issue: responses can exceed Claude Code's MCP output cap — set `MAX_MCP_OUTPUT_TOKENS=50000` in the shell profile if you see "exceeds maximum allowed tokens"

**2. llms.txt / .md twins (zero setup, works always)**:
- Index: `https://mui.com/material-ui/llms.txt` · MUI X: `https://mui.com/x/llms.txt`
- Version-pinned: `https://llms.mui.com/material-ui/9.2.0/llms.txt`
- EVERY docs page has a markdown twin — append `.md`: `https://mui.com/material-ui/react-autocomplete.md`, `https://mui.com/material-ui/api/text-field.md`

### When to Look Up Docs

- Creating a component that uses MUI components you haven't used yet
- Unsure which props/variants a component supports
- Need the exact `slots`/`slotProps` names for a component
- Building complex components (Tables, Forms, Dialogs, Navigation, Pickers)
- ALWAYS match the docs version to the project's installed MUI major
