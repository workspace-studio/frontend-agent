---
paths:
  - "src/components/**"
  - "src/views/**"
  - "components/**"
---

# Component Rules

## Structure
- PascalCase file and folder names
- Every component folder has `index.ts`: `import X from './X'; export default X;`
- SCSS module ONLY if component has custom styles — skip if MUI props suffice
- Props interface exported from component file

## Styling
- Use SCSS modules + MUI component props (variant, size, color)
- MUI `sx` prop ONLY for spacing (mt, mb, gap, p) — nothing else
- NEVER mix sx and SCSS on same element
- SCSS uses `@use` (not `@import`)
- Colors from theme variables — no hardcoded hex
- `rem-calc()` for sizing — no hardcoded px
- Responsive via `@include media()` mixin

## Accessibility
- Semantic HTML: nav, main, section, article, aside
- All interactive elements keyboard accessible
- Images have descriptive `alt` text
- ARIA labels on IconButton and custom controls
- Form inputs have associated labels

## Forbidden
- NEVER use `React.memo`, `useMemo`, or `useCallback`
- NEVER use `any` or `unknown` — define proper types
- NEVER use `as` type assertions
- No prop drilling past 2 levels — use store
