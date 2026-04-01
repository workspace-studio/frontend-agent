---
paths:
  - "src/styles/**"
  - "**/*.module.scss"
  - "**/*.scss"
---

# Style Rules

## SCSS Modules
- Use `@use` imports (NEVER `@import`)
- One `.module.scss` per component — only when needed
- `rem-calc()` for all sizing (no hardcoded px values)
- Responsive breakpoints via `@include media()` mixin
- Colors via SCSS variables from `@/styles/settings/variables` — no hardcoded hex/rgba anywhere in SCSS
- Top-level class ALWAYS `.container` — all other classes nested inside it, no flat siblings
- For dynamic JS values use CSS custom properties: `style={{ '--progress': value } as CSSProperties}` → SCSS `var(--progress)`. Never set CSS properties directly in `style`
- MUI Stack/Grid system props generate inline styles — NEVER override `direction`, `spacing`, `alignItems` via SCSS. Use MUI responsive prop syntax instead
- No duplicate CSS declarations (e.g., two `border:` in same rule) — write the final value once

## MUI Theme
- All colors defined in `colors.ts` — no hex/rgba in component files or theme files (components.ts, palette.ts)
- Use explicit color imports: `color={colors.primary}` — NEVER use string references like `color="primary"`
- Typography variants from `typography.ts`
- Component overrides in `components.ts`
- Breakpoints from `breakpoints.ts`
- NEVER override theme values inline — update theme file

## Naming
- BEM-style class names: `.component`, `.component__element`, `.component--modifier`
- No global styles — everything scoped via modules
