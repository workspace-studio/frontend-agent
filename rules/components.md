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
- When using MUI component as building block, extend its Props type (e.g., `interface StatusChipProps extends ChipProps`) and add custom props as needed
- NEVER use raw HTML elements (`<div>`, `<header>`, `<nav>`, `<span>`, `<section>`) — always use MUI equivalents: `Box`, `Stack`, `AppBar`, `Toolbar`, `Container`, `Typography`, etc. Use the `component` prop for semantic HTML (e.g., `<Stack component="nav">`, `<Container component="section">`, `<Typography component="h2">`)

## Naming
- Page-level views use `*Page` suffix: `LoginPage`, `NotFoundPage` (NOT `*View`)
- Top-level SCSS class is `.container` (NOT `.root`)
- All SCSS classes nested inside `.container`

## Styling
- Use SCSS modules + MUI component props (variant, size, color)
- MUI `sx` prop ONLY for spacing (mt, mb, gap, p) AND responsive typography (`sx={{ typography: { lg: 'h2' } }}`)
- NEVER mix sx and SCSS on same element
- Only use MUI component variants defined in the design system — if `typings.d.ts` disables a variant (e.g., `outlined: false`), do NOT use it; if a custom variant exists (e.g., `containedSecondary`), use it instead of ad-hoc styling
- Use `cx` from `clsx` for className merging — NEVER template literals or string concatenation
- SCSS uses `@use` (not `@import`)
- Colors from theme variables — no hardcoded hex. Use `colors.xxx` from `@/styles/themes/colors` in TSX, `$xxx` from `variables.scss` in SCSS
- NEVER use MUI string color references like `color="primary"` — use explicit `color={colors.green500}`
- `rem-calc()` for sizing — no hardcoded px
- Responsive via `@include media()` mixin
- No inline `style={{}}` on components — use SCSS classes or `sx` for spacing only

## Images (next/image)
- Always use WebP format — convert PNG/JPG during download
- Always add descriptive `alt` text — never empty `alt=""`
- Always add `sizes` prop when using `fill` layout
- Use SCSS class for `object-fit` — never inline `style={{ objectFit: 'cover' }}`
- One Image element with responsive CSS — never duplicate for desktop/mobile

## Typography
- Always add `component` prop for semantic HTML: `<Typography component="h1" variant="h2">`
- Responsive variants via sx: `sx={{ typography: { xs: 'h3', lg: 'h2' } }}`

## Accessibility
- Semantic HTML via MUI `component` prop: `<Stack component="nav">`, `<Box component="main">`, `<Container component="section">`
- All interactive elements keyboard accessible
- Images have descriptive `alt` text — never empty
- ARIA labels on IconButton and custom controls
- Form inputs have associated labels

## Config Data
- Static data arrays (nav items, tabs, sidebar links, language options) go in `src/config/*.config.ts` — NEVER hardcode inline in components
- Export a typed const array with a proper interface from `@/types/`

## SVG Icons
- All icons in `src/components/SvgIcons/`, grouped by category in subfolders with `index.ts` barrel exports
- MANDATORY props: `props?: SVGProps<SVGSVGElement>`, `fill?: string` (default `'currentColor'`), `size?: string | number` (default `24`)
- Spread `{...props}` on `<svg>`, use `width={size} height={size}`, keep original `viewBox`

## Exports
- Always `const X = () => ...` + `export default X` — NEVER `export default function`

## Reusable Wrappers
- If multiple pages share the same shell (image panel + content panel), extract a wrapper component that accepts `children` + config props
- Layout files (`layout.tsx`) MUST be server components — extract client logic (`usePathname`, hooks) into a separate client component

## Forms
- Always create `form-models.config.ts` (default values + types) and `form-names.config.ts` (form ID constants)
- `<Form>` — no generic types, always pass `id={FORM_NAME}` and `mode="onBlur"`
- `<FormInput>` — use `label` prop (filled variant), NOT `placeholder`
- Use `useToggleState` hook for password visibility toggle — never manual `useState` + toggle

## Security
- NEVER `console.log` form data or user credentials — security risk

## Forbidden
- NEVER use `React.memo`, `useMemo`, or `useCallback`
- NEVER use `any` or `unknown` — define proper types
- NEVER use `as` type assertions
- No prop drilling past 2 levels — use store
