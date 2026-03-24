# Figma MCP Integration

## Overview

The Figma MCP server exposes design data (frames, tokens, components) directly to the agent. This enables generating components from Figma designs, syncing design tokens to the MUI theme, and reviewing implementations against Figma specs.

**Boundary:** The agent only READS from Figma. Figma remains the tool for design exploration ("eight to ten different ways"). The agent translates Figma output into code — it does not replace Figma for design work.

## Foundations First

The Figma MCP integration **enhances** an existing design system — it does not replace creating one. AI-generated design systems from scratch produce poor quality without human foundation.

**Recommended workflow:**
1. Set up tokens, typography, spacing, and brand logic **manually first** in Figma (or use a ready-made UI kit like MUI's default theme)
2. Then use `/sync-tokens` to sync those established tokens to code
3. Use `/figma-to-component` to translate designed components to code
4. Use `/figma-review` to iterate and refine

**If no design system exists yet:** consider starting with a ready-made UI kit (MUI defaults, Ant Design, Chakra) rather than generating one from scratch. The agent works best when it has a solid foundation to build on.

**Expectation setting:** first generation from Figma is typically 70-80% correct. The workflow is iterative — generate, review, fix, review again. `/figma-review` is the iteration tool.

## Auto-Detection

When any user prompt contains a Figma URL (`figma.com/design/...` or `figma.com/file/...`), automatically:
1. Parse the URL to extract `fileKey` and `nodeId`
2. Call the appropriate Figma MCP tool to fetch context
3. Use the design data to inform the current task

No special command needed — engineers can paste a Figma URL into any prompt.

## Available Figma MCP Tools

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `get_file` | File metadata, pages, top-level frames | Browsing file structure |
| `get_node` | Specific node by ID (frame, component, group) | Component generation, design review |
| `get_variable_defs` | Design variables applied to a **specific node** (NOT all file variables) | Supplementary token data for a specific component — for complete token lists, request a screenshot of the Variables panel |
| `get_styles` | Published styles (color, text, effect, grid) | Token sync, style extraction |
| `get_components` | Component definitions in a file | Understanding design system |
| `get_code_connect_map` | Code Connect mappings (Figma component → code component) | Component generation — reuse real components |

### Complementary MCP Strategy

Official Figma MCP and Console MCP are **complementary, not competitive**. Use both together:

| Phase | Use | Why |
|-------|-----|-----|
| **Design phase** | Console MCP (southleft) | Create/manage tokens, search components, modify files (59+ tools, read+write) |
| **Handoff phase** | Official Figma MCP | Code Connect mappings, code generation, variable code syntax (13 tools, read-only) |

You can configure both simultaneously — install.sh options 1+3 or 2+3 together.

## Code Connect

Code Connect maps Figma design components to **actual code components** in the codebase. When configured, the AI reuses real components instead of inventing new ones.

**Why critical:** Our agent uses "MUI as building blocks". Code Connect ensures Figma Button → our MUI Button override, Figma Input → our MuiFilledInput, etc.

**How to use:**
1. Call `get_code_connect_map` before generating any component
2. If Figma component has a Code Connect mapping → use the mapped import path and props
3. If no mapping → fall back to MUI component inference from the Figma node

**Setup (team responsibility):**
- **Code Connect UI** (quick) — in Figma Dev Mode, Library → Connect components to code. Visual linking, language-agnostic.
- **Code Connect CLI** (advanced) — local repo, supports property mappings and dynamic code examples. Best for MUI prop mapping (e.g., Figma `variant=Primary` → MUI `variant="contained"`).

**Agent behavior with Code Connect:**
```
Figma Button (variant=Primary, size=Large)
  ↓ get_code_connect_map
  → maps to: import Button from '@/components/Button'
  → props: variant="contained" size="large"
  ↓
Agent uses REAL component, not generic MUI <Button>
```

## Figma URL Parsing

Extract `fileKey` and `nodeId` from Figma URLs:

```
https://www.figma.com/design/{fileKey}/{name}?node-id={nodeId}
https://www.figma.com/file/{fileKey}/{name}?node-id={nodeId}
```

- `fileKey` — alphanumeric string after `/design/` or `/file/`
- `nodeId` — URL-encoded node ID (e.g., `1-234` or `1%3A234`)
- Decode `%3A` → `:` for the API call

## Token Mapping — Figma → MUI Theme

### colors.ts

Figma color primitives map directly to `colors.ts`:

| Figma Variable | colors.ts Key | Rule |
|---------------|---------------|------|
| `colors/orange/500` (#fa541c) | `orange500: '#fa541c'` | Strip slashes, camelCase + scale |
| `colors/gray-blue/200` (#d1dde6) | `grayBlue200: '#d1dde6'` | Hyphen → camelCase |
| `colors/black/900` (#3d3d3d) | `black900: '#3d3d3d'` | Group by hue |

**Naming rules:**
- Strip the collection prefix (e.g., `colors/`)
- **Preserve Figma group names exactly** — if Figma calls it "Green", use `green`. Do NOT rename to `success`, `emerald`, or any other name
- Convert hyphens to camelCase (`gray-blue` → `grayBlue`)
- Append the scale number (`/500` → `500`)
- Group entries by Figma group name in the file

### palette.ts

Figma semantic tokens map to MUI palette — always reference `colors.ts`, never hardcode hex:

| Figma Semantic Token | palette.ts | Example |
|---------------------|------------|---------|
| `semantic/primary` | `primary.main` | `colors.orange500` |
| `semantic/on-primary` | `primary.contrastText` | `colors.white` |
| `semantic/secondary` | `secondary.main` | `colors.black900` |
| `semantic/error` | `error.main` | `colors.red600` |
| `semantic/warning` | `warning.main` | `colors.yellow300` |
| `semantic/success` | `success.main` | `colors.green300` |

### typography.ts

Figma text styles map to MUI typography variants:

| Figma Text Style | typography.ts Variant | Properties |
|-----------------|----------------------|------------|
| `Heading/H1` (32px, 700, Poppins) | `h1` | `fontSize`, `fontWeight`, `fontFamily` |
| `Heading/H2` (24px, 700, Poppins) | `h2` | Same |
| `Heading/H3` (18px, 600, Poppins) | `h3` | Same |
| `Body/Regular` (16px, 400, Inter) | `body1` | `fontSize`, `fontWeight` |
| `Body/Small` (14px, 400, Inter) | `body2` | Same |
| `Button/Label` (14px, 600, Inter) | `button` | Same + `textTransform: 'none'` |

### components.ts

Figma component variants map to MUI component overrides:

| Figma Property | MUI Override | Example |
|---------------|-------------|---------|
| Button borderRadius: 8 | `MuiButton.styleOverrides.root.borderRadius` | `8` |
| Input borderRadius: 12 | `MuiFilledInput.styleOverrides.root.borderRadius` | `12` |
| Card padding: 16 | `MuiPaper.styleOverrides.rounded.padding` | `16` |
| Button height: 36 | `MuiButton.styleOverrides.sizeMedium.height` | `36` |

## Layout Mapping — Figma → MUI Components

| Figma Concept | MUI Component | Notes |
|--------------|---------------|-------|
| Auto-layout horizontal | `<Stack direction="row">` | `gap` → `spacing` prop |
| Auto-layout vertical | `<Stack>` | Default direction is column |
| Auto-layout wrap | `<Stack flexWrap="wrap">` | |
| Frame with padding | `<Box>` or `<Paper>` | Map padding values |
| Frame with fill | `<Paper>` | If has background |
| Text node | `<Typography variant={mapped}>` | Match to closest variant |
| Rectangle (decorative) | `<Box>` | With SCSS styling |
| Image fill | `<Box>` with background or `<img>` | Next.js: use `next/image` |
| Component instance | Check if MUI equivalent exists | Button, Chip, TextField, etc. |
| Auto-layout gap | `spacing` prop | Convert px: `gap / 8` for MUI spacing units |

### Auto-Layout → Stack Translation

```
Figma auto-layout:
  direction: horizontal
  gap: 16
  padding: 24
  alignItems: center

→ MUI:
  <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 3 }}>
```

## Annotations

Figma annotations provide behavioral context that the MCP server sends to the agent. Use them to inform implementation beyond visual layout:

| Annotation Type | Implementation |
|----------------|----------------|
| Hover state | SCSS `:hover` in `.module.scss` or MUI component's built-in hover (Button, Link) |
| Loading state | Add `loading` prop → render `<Skeleton>` or `<CircularProgress>` |
| Transition/animation | CSS `transition` in SCSS module |
| Responsive behavior | `@include media()` breakpoint mixin in SCSS |
| Accessibility note | `aria-label`, `role`, semantic HTML (`component="nav"`, `component="section"`) |
| Interaction (click, toggle) | Marks component as `'use client'` (Next.js), add event handler props |
| Content state (empty, error) | Add conditional rendering with state-specific UI |

**When annotations are present:** use them to determine:
- Whether the component needs `'use client'` (any interaction → yes)
- Whether to create a `.module.scss` file (hover/transition → yes)
- What props interface to define (loading, error states → boolean props)

**When annotations are absent:** fall back to inferring behavior from the Figma node type (Button → clickable, Input → interactive, static frame → server component).

## Figma File Preparation (for Designers)

AI generates much better code when Figma files are structured properly. Share these guidelines with your design team:

**Naming:**
- Replace default names (`Frame1268`, `Group5`) with intent-driven names (`CardContainer`, `ProductImage`, `CTAButton`)
- Layer names become component structure — `HeaderNav` → agent understands this is navigation

**Variables:**
- Use Figma variables for **everything**: spacing, colors, radius, typography
- Variables with code syntax get passed directly to the AI agent as exact code
- Raw hex values without variables = agent has to guess the token mapping

**Auto Layout:**
- Apply auto layout on every frame — it maps directly to Stack/Box in MUI
- Resize the frame in Figma to verify responsive behavior before generating code
- Set explicit gap, padding, and alignment — these become MUI spacing props

**Annotations:**
- Add annotations for hover states, transitions, loading states, accessibility
- These are sent to the AI agent and reduce implementation guesswork

**Component Sizing:**
- Break designs into component-sized frames, not full pages
- Large selections slow MCP tools down and produce worse results
- One component per frame = one `/figma-to-component` invocation

**Figma Components:**
- Use Figma components for repeated elements — they map to Code Connect
- Variants in Figma → props in code (Primary/Secondary → `variant="contained"/"outlined"`)

## Working with Incomplete Designs

Designs are often "good enough" rather than pixel-perfect (mocking is now 30-40% of design work). The agent should handle incomplete frames gracefully:

**Sketch mode indicators** (suggest sketch mode when):
- Frame has fewer than 3 child layers
- No Figma variables are applied (raw hex values only)
- Frame uses default Figma styling (no custom fills/strokes)
- Node metadata suggests it's a wireframe or exploration

**In sketch mode:**
- Extract only: layout direction, spacing, approximate sizing
- Generate a scaffold component with TODO comments for details
- Use existing theme colors (best-match by hex proximity)
- Don't create SCSS module — rely on MUI props only

**In full mode:**
- Map every child node to a MUI component
- Extract exact spacing, colors, typography
- Flag any Figma color not in `colors.ts`
- Create SCSS module if custom styles are needed

## Single Component Focus

Always process ONE component at a time — never batch multiple components in a single generation. Claude produces significantly better results with focused, single-component work:

- If a Figma frame contains multiple distinct components, list them and ask the user which to generate first
- Complete one component fully (tsx, scss, spec, index) before starting the next
- This matches how designers work — focused refinement beats broad generation

## Atomic Design

When a Figma frame contains complex nested structures, break it into smaller atom components first, then compose:

**Decomposition examples:**
- **Calendar** → `CalendarDay` atom → `CalendarWeek` → `Calendar` composed
- **Data table** → `TableCell` atom → `TableRow` → `DataTable` composed
- **Tabs** → `Tab` atom → `TabPanel` → `TabGroup` composed
- **Navigation** → `NavItem` atom → `NavGroup` → `Navigation` composed

**When to decompose:**
- Frame has repeating identical structures (list items, grid cells, table rows)
- Frame has interactive sub-elements (selectable dates, toggleable tabs)
- Frame nests 3+ levels of auto-layout

**When NOT to decompose:**
- Simple components (Button, Chip, Badge, Avatar)
- Components with 1-2 levels of nesting
- Components that already map to a single MUI component

## Composability

Generated components MUST have configurable content via props — never hardcode repeating content:

```tsx
// ✅ CORRECT — configurable
interface DataTableProps {
  columns: Column[];
  rows: Row[];
  onRowClick?: (row: Row) => void;
}

// ❌ WRONG — hardcoded
const DataTable = () => (
  <Table>
    <TableRow>Name</TableRow>
    <TableRow>Email</TableRow>
  </Table>
);
```

**Composability props by component type:**
- Lists: `items`, `renderItem`
- Tables: `columns`, `rows`
- Tabs: `tabs` (array of `{ label, content }`)
- Navigation: `items` (array of `{ label, href, icon? }`)
- Cards: `children` or specific content props (`title`, `description`, `actions`)

## Rules

1. **NEVER invent colors** — only use colors from `colors.ts` or flag new ones for addition
2. **Flag unknowns** — if a Figma color/style doesn't match the theme, report it clearly
3. **Figma context is supplementary** — it doesn't override agent patterns (MUI as building blocks, no sx for styling, etc.)
4. **Graceful degradation** — if Figma MCP is not configured or unreachable, tell the user what's needed and continue without it
5. **Incremental approach** — sync only what changed, never destructive full reimport
6. **Match existing patterns** — always read existing components before generating from Figma
7. **Single component focus** — ONE component per invocation, never batch
8. **Atomic decomposition** — break complex frames into atoms before composing
9. **Composability** — use props for repeating content, never hardcode items/rows/tabs
