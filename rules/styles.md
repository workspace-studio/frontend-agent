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
- Colors via SCSS variables from `@/styles/settings/variables`

## MUI Theme
- All colors defined in `colors.ts` — no hex in component files
- Use explicit color imports: `color={colors.primary}` — NEVER use string references like `color="primary"`
- Typography variants from `typography.ts`
- Component overrides in `components.ts`
- Breakpoints from `breakpoints.ts`
- NEVER override theme values inline — update theme file

## Naming
- BEM-style class names: `.component`, `.component__element`, `.component--modifier`
- No global styles — everything scoped via modules
