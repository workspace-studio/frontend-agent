---
name: sync-tokens
description: Extract design tokens from Figma and sync to MUI theme files — incremental diff with user approval
---

# Sync Tokens

Extract design tokens from Figma and sync to the MUI theme. Usage: `/sync-tokens https://figma.com/design/...`

**Partial sync flags:**
- `/sync-tokens URL --colors-only` — sync only color tokens
- `/sync-tokens URL --typography-only` — sync only typography tokens
- `/sync-tokens URL --all` — sync everything (default)

## Pre-Work

1. READ the project's CLAUDE.md for project-specific instructions
2. READ @knowledge/21-figma-integration.md for token mapping rules
3. READ @knowledge/04-mui-theming.md for theme file structure
4. READ existing theme files from `src/styles/themes/`

## Steps

### Step 1: Parse Figma URL

Extract `fileKey` from the URL. This skill operates on the entire file, not a specific node.

### Step 2: Fetch Figma Tokens

Call Figma MCP tools:
- `get_variable_defs` — fetch all design variables (colors, spacing, typography)
- `get_styles` — fetch published styles (color styles, text styles, effect styles)

If MCP is unavailable:
- Tell the user: "Figma MCP is not configured. Run `claude mcp add --transport http figma https://mcp.figma.com/mcp` to set it up."
- Stop.

### Step 3: Read Existing Theme

Read all current theme files:
- `src/styles/themes/colors.ts`
- `src/styles/themes/palette.ts`
- `src/styles/themes/typography.ts`
- `src/styles/themes/components.ts`
- `src/styles/themes/breakpoints.ts`
- `src/styles/themes/index.ts`

Also check for SCSS variables:
- `src/styles/settings/variables` (if exists)

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

On approval, update only changed theme files:

1. **colors.ts** — add new entries, update changed hex values. Keep organized by hue.
2. **palette.ts** — update semantic mappings if colors changed. Always reference `colors.ts`.
3. **typography.ts** — update font sizes, weights, families. Keep variant structure.
4. **components.ts** — update overrides (borderRadius, padding, spacing). Reference `colors.ts` and `typography.ts`.

**SCSS sync** — if `src/styles/settings/variables` exists, update corresponding SCSS variables to match.

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
Source:       {Figma file URL}
Scope:        All / Colors only / Typography only
Changes:
  colors.ts:      3 added, 1 updated
  palette.ts:     1 updated
  typography.ts:  1 added, 1 updated
  components.ts:  2 updated
  SCSS vars:      synced
Build:        Pass
═══════════════════════════════════════════
```

## Rules

- **NEVER delete existing tokens** — only add or update
- **NEVER auto-apply** — always present diff and wait for approval
- **Always reference colors.ts in palette.ts** — never hardcode hex in palette
- **Preserve hue grouping** in colors.ts when adding new entries
- **Follow the 6-file theme structure** from @knowledge/04-mui-theming.md
- **Naming convention**: strip Figma collection prefix, camelCase + scale (e.g., `grayBlue200`)
- **Incremental by design** — only sync what changed, not full reimport
