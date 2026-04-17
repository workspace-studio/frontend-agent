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
- No SCSS modules in `src/app/` directory — `app/` is for routing only. Create a component in `src/components/` or `src/views/` if a layout needs styles

## MUI + SCSS Specificity
- MUI Emotion styles inject AFTER CSS modules in `<head>` — equal specificity = Emotion wins
- ALWAYS use double-class specificity trick to override MUI: `&.container { background-color: $white; }` — never assume a single-class selector will work
- MUI state classes (`.Mui-selected`, `.Mui-focused`, `.Mui-disabled`) are global — wrap in `:global()` inside CSS modules: `&:global(.Mui-selected) { ... }`
- Third-party libraries (ApexCharts, etc.) apply inline `style=""` — `!important` is the correct and ONLY way to override inline styles. Don't fight it, document why it's needed
- NEVER use `all: unset` to override third-party styles — it destroys ALL properties including positioning (`top`, `left`, `position`), not just visual ones
- After refactoring component markup, grep for orphaned SCSS classes in the module — dead CSS accumulates silently

## Sticky/Fixed Layout
- Define shared heights as SCSS variables: `$header-height`, `$progress-bar-height`, `$bottom-tab-height`
- Before setting `top`/`bottom`/`padding-bottom`/`z-index` for sticky/fixed elements: list all elements, calculate exact heights (don't guess), define z-index hierarchy
- `scrollIntoView` needs `scroll-margin-top`/`scroll-margin-bottom` CSS when fixed/sticky elements exist — browser doesn't know about overlays
- Calculate required clearance mathematically: `fixed_height + offset - existing_padding + buffer` — never trial-and-error

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
