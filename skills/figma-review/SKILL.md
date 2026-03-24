---
name: figma-review
description: Compare an implemented component against its Figma design — report discrepancies with actionable fixes
---

# Figma Review

Compare an implemented component against its Figma design and report discrepancies with actionable fixes. Usage: `/figma-review ComponentName https://figma.com/design/...`

## Pre-Work

1. READ the project's CLAUDE.md for project-specific instructions
2. READ @knowledge/21-figma-integration.md for Figma MCP workflow and mapping rules
3. READ @knowledge/03-component-patterns.md for component patterns
4. READ @knowledge/04-mui-theming.md for theme structure

## Steps

### Step 1: Parse Figma URL

Extract `fileKey` and `nodeId` from the URL. Decode `%3A` → `:`.

### Step 2: Fetch Figma Design Data

Call Figma MCP `get_node` with the extracted fileKey and nodeId.

If MCP is unavailable:
- Tell the user: "Figma MCP is not configured. Run `claude mcp add --transport http figma https://mcp.figma.com/mcp` to set it up."
- Stop.

### Step 3: Read Implemented Component

Find and read the component files:
- `src/components/ComponentName/ComponentName.tsx`
- `src/components/ComponentName/ComponentName.module.scss` (if exists)

Also check `src/views/` if not found in `src/components/`.

Read theme files for context:
- `src/styles/themes/colors.ts`
- `src/styles/themes/typography.ts`
- `src/styles/themes/components.ts`

### Step 4: Compare

Analyze the Figma node against the implemented component:

**Layout:**
- Figma auto-layout direction vs Stack/Box direction
- Figma gap vs spacing prop
- Figma padding vs component padding
- Figma alignment vs MUI alignment props

**Colors:**
- Figma fills vs colors used in component (from `colors.ts` or SCSS variables)
- Figma strokes/borders vs component borders

**Typography:**
- Figma text styles (fontSize, fontWeight, fontFamily) vs Typography variant
- Figma line-height vs theme typography

**Spacing:**
- Figma auto-layout spacing vs MUI spacing
- Figma padding vs component padding

**Sizing:**
- Figma fixed dimensions vs component sizing
- Figma min/max constraints vs CSS constraints

**Border & Effects:**
- Figma border radius vs component borderRadius
- Figma shadows vs MUI elevation or box-shadow

### Step 5: Generate Report

```
═══════════════════════════════════════════
FIGMA REVIEW: ComponentName
═══════════════════════════════════════════

✓ MATCHES
  - Layout: Stack direction="row" matches horizontal auto-layout
  - Typography: h2 variant matches 24px/700 Poppins
  - Colors: primary button uses orange500 correctly

✗ DISCREPANCIES
  1. Color mismatch
     Figma: Button fill #eb350b
     Code:  colors.orange500 (#fa541c)
     Fix:   Update colors.ts orange500 or add orange600: '#eb350b'

  2. Spacing difference
     Figma: gap 12px
     Code:  spacing={2} (16px)
     Fix:   Change to spacing={1.5}

  3. Border radius
     Figma: 12px
     Code:  borderRadius: 8 (from MuiButton override)
     Fix:   Update components.ts MuiButton.root.borderRadius to 12

═══════════════════════════════════════════
```

### Step 6: Offer Fixes

Categorize each discrepancy:

**Simple fixes** (spacing, colors, border-radius) — offer to auto-apply:
> "I can auto-apply fixes 2 and 3 (spacing and border-radius). Apply? (y/N)"

On approval:
- Edit the component file or theme file directly
- Run `yarn lint` to verify

**Complex fixes** (layout restructure, new components needed) — provide instructions:
> "Fix 1 requires adding a new color to colors.ts. Use `/sync-tokens` to sync all tokens, or manually add `orange600: '#eb350b'` to colors.ts."

### Step 7: Validate (if fixes applied)

```bash
yarn lint          # Must pass
yarn build         # Must compile
yarn test:ct       # Must pass component tests
```

## Rules

- **NEVER modify code without user approval** — always present findings first
- **Simple fixes only for auto-apply** — spacing values, color references, border-radius
- **Complex fixes require manual action** — layout changes, new components, structural changes
- **Always reference theme files** — don't compare raw hex values, compare against `colors.ts` entries
- **Be specific** — exact line numbers, exact values, exact fix commands
- **Acknowledge intentional deviations** — if the implementation is clearly intentional (e.g., responsive adjustments), note it as "possible intentional deviation" rather than an error
