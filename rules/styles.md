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
- Typography variants from `typography.ts`
- Component overrides in `components.ts`
- Breakpoints from `breakpoints.ts`
- NEVER override theme values inline — update theme file

## Dark Mode
- Dark mode FIRST, light mode via overrides
- Use theme palette tokens — no hardcoded colors
- Test both modes when modifying styles

## Naming
- BEM-style class names: `.component`, `.component__element`, `.component--modifier`
- No global styles — everything scoped via modules
