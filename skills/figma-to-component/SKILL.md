---
name: figma-to-component
description: Generate a component from a Figma frame — maps Figma layout, colors, and typography to MUI components
---

# Figma to Component

Generate a component from a Figma design frame. Usage: `/figma-to-component https://figma.com/design/... — ComponentName`

Add `--sketch` flag for incomplete/early designs: `/figma-to-component https://figma.com/... — Header --sketch`

## Pre-Work

1. READ the project's CLAUDE.md for project-specific instructions
2. READ @knowledge/21-figma-integration.md for Figma MCP workflow and token mapping
3. READ @knowledge/03-component-patterns.md for component structure
4. READ @knowledge/04-mui-theming.md for theme structure
5. READ 2-3 existing components from `src/components/` for patterns
6. Detect stack from package.json (next → Next.js, vite → React+Vite)

## Steps

### Step 1: Parse Figma URL

Extract `fileKey` and `nodeId` from the URL:
```
https://www.figma.com/design/{fileKey}/{name}?node-id={nodeId}
```
Decode `%3A` → `:` in nodeId.

### Step 2: Fetch Figma Design Data

Call Figma MCP `get_node` with the extracted fileKey and nodeId.

If MCP is unavailable:
- Tell the user: "Figma MCP is not configured. Run `claude mcp add --transport http figma https://mcp.figma.com/mcp` to set it up."
- Stop — do not guess the design.

### Step 3: Detect Mode

**Auto-detect sketch mode** if:
- Frame has fewer than 3 child layers
- No Figma variables are applied (raw hex values only)
- User passed `--sketch` flag

If sketch mode is detected but not explicitly requested, ask the user:
> "This frame looks like an early design (few layers, no variables). Use sketch mode for a quick scaffold, or full mode for detailed mapping?"

### Step 3.5: Check Code Connect

Call `get_code_connect_map` to check if Figma components in the frame have Code Connect mappings to existing code components.

- If a Figma component maps to an existing code component → use the real import path and props, do NOT generate from scratch
- If no Code Connect is configured → fall back to MUI component inference from the Figma node
- Code Connect provides: import path, prop mappings (Figma property → code prop), usage examples

### Step 4: Read Theme Files

Read existing theme files to match colors and typography:
- `src/styles/themes/colors.ts`
- `src/styles/themes/palette.ts`
- `src/styles/themes/typography.ts`

### Step 5: Check Scope

**Single component focus** — process ONE component per invocation.

If the Figma frame contains multiple distinct components (e.g., a page with Header, Sidebar, and ContentArea):
1. List the identified components
2. Ask the user which to generate first
3. Generate only that one component

### Step 6: Atomic Decomposition

Before generating, check if the frame needs decomposition (see @knowledge/21-figma-integration.md Atomic Design section):

**Decompose when:**
- Frame has repeating identical structures (list items, grid cells, table rows, tab panels)
- Frame has interactive sub-elements (selectable dates, toggleable tabs, sortable columns)
- Frame nests 3+ levels of auto-layout

**Decomposition flow:**
1. Identify atom components (e.g., `TableRow`, `TabItem`, `NavLink`)
2. Generate atom components first (each with own folder, tsx, spec, index)
3. Then compose the parent component using the atoms

**Skip decomposition when:**
- Simple components (Button, Chip, Badge, Avatar)
- Components with 1-2 levels of nesting
- Components that map to a single MUI component

### Step 7: Analyze Figma Node

Map the Figma node structure to MUI components using @knowledge/21-figma-integration.md:

**Layout:**
- Auto-layout horizontal → `<Stack direction="row">`
- Auto-layout vertical → `<Stack>`
- Auto-layout gap → `spacing` prop (px / 8)
- Padding → sx spacing or SCSS

**Children:**
- Text nodes → `<Typography variant={closest_match}>`
- Buttons → `<Button variant={mapped}>`
- Inputs → `<TextField>`
- Images → `next/image` (Next.js) or `<img>` (React)
- Nested frames → nested Stack/Box
- Component instances → check MUI equivalents first

**Colors:**
- Match Figma fill hex to `colors.ts` entries
- If no match found → flag as new color needed

**Composability:**
- Lists/grids with repeating items → `items` prop + `renderItem` or typed array
- Tables → `columns` + `rows` props
- Tabs → `tabs` array prop with `{ label, content }`
- Navigation → `items` array with `{ label, href, icon? }`
- NEVER hardcode list items, table rows, or tab content

**In sketch mode:** extract only layout direction, spacing, and primary colors. Generate scaffold with TODO comments.

### Step 8: Generate Component

Delegate to component-creator pattern:

1. Create `src/components/ComponentName/ComponentName.tsx`
   - Props interface (exported)
   - Arrow function component
   - MUI components as building blocks (NOT wrappers)
   - MUI component props for styling (variant, size, color) — NOT sx
   - `'use client'` only if needed (Next.js)

2. Create `src/components/ComponentName/ComponentName.module.scss` — ONLY if custom styles needed
   - Use `@use` imports for variables, mixins, rem-calc
   - In sketch mode: skip this file

3. Create `src/components/ComponentName/ComponentName.spec.tsx` — Playwright component test

4. Create `src/components/ComponentName/index.ts` (MANDATORY):
   ```typescript
   import ComponentName from './ComponentName';
   export default ComponentName;
   ```

### Step 9: Report

Print a summary:
```
═══════════════════════════════════════════
FIGMA → COMPONENT
═══════════════════════════════════════════
Component:   ComponentName
Mode:        Full / Sketch
Figma frame: {nodeId}
Files:       4 created
Colors:      All matched / 2 new colors needed
Typography:  All matched / 1 variant unmapped
Layout:      Stack(row) > Typography + Button
═══════════════════════════════════════════
```

If new colors are needed, list them:
```
New colors needed in colors.ts:
  - #e8461c (closest: orange500 #fa541c)
  - #2d5f8a (no match — suggest: blue600)
```

### Step 10: Validate

```bash
yarn lint          # Must pass
yarn test:ct       # Must pass Playwright tests
```

## Rules

- Follow ALL component-creator rules (no sx, no memo, index.ts mandatory, etc.)
- Colors MUST come from `@/styles/themes/colors` — if a Figma color is not present, flag it and suggest adding
- NEVER invent components not shown in the Figma frame
- NEVER guess design details — use only what Figma MCP returns
- In sketch mode: TODO comments for details, MUI props only, no SCSS module
- Always check `@examples/shared-components/` before creating — copy if exists
- **Single component focus** — ONE component per invocation, never batch. If frame has multiple components, list them and ask which to generate first
- **Atomic decomposition** — break complex frames with repeating structures into atom sub-components before composing the parent
- **Composability** — NEVER hardcode list items, table rows, or tab content. Use typed array props (`items`, `columns`, `rows`, `tabs`)
