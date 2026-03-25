# MUI Component Usage

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
| `<select>` | `Select` or `TextField select` | `<TextField select>` |
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

## MUI Component Categories

**Layout:** Box, Stack, Container, Grid, Toolbar
**Navigation:** AppBar, Drawer, Tabs, Tab, Breadcrumbs, Link, BottomNavigation
**Inputs:** TextField, Select, Checkbox, Radio, Switch, Slider, Autocomplete, Rating
**Data Display:** Typography, Table, List, Chip, Avatar, Badge, Tooltip, Divider
**Feedback:** Dialog, Snackbar, Alert, Skeleton, Backdrop, CircularProgress, LinearProgress
**Surfaces:** Paper, Card, CardContent, CardActions, Accordion, AccordionSummary, AccordionDetails

## Context7 MUI Docs Lookup

Before creating a component, use context7 MCP to fetch up-to-date MUI docs:

1. **Resolve library:** Call `mcp__context7__resolve-library-id` with `libraryName: "@mui/material"`
2. **Fetch docs:** Call `mcp__context7__get-library-docs` with the resolved library ID and `topic` set to the component name (e.g., "AppBar", "TextField", "Stack")

This gives you the full component API — all props, slots, variants, and examples. Always do this for components you haven't used before in the current session.

### When to Look Up Docs

- Creating a component that uses MUI components you haven't used yet
- Unsure which props/variants a component supports
- Need to know available slots for `classes` or `slotProps`
- Building complex components (Tables, Forms, Dialogs, Navigation)
