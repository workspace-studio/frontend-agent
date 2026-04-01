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
- NEVER expose `sx` prop passthrough in reusable component interfaces — consumers style via `className` or dedicated props only

## Naming
- View sections use semantic names: `ReservationsSection`, `ReserveBar` — NEVER `FirstSection`/`SecondSection`
- Top-level SCSS class is `.container` (NOT `.root`)
- All SCSS classes nested inside `.container`

## File Location
- Reusable components (used on 2+ pages) → `src/components/`
- Modals reusable across pages → `src/components/`

## Styling
- Use SCSS modules + MUI component props (variant, size, color)
- MUI `sx` prop ONLY for: `mt`, `mb`, `gap`, `p`, `px`, `py`, `mx`, `my`, `typography: { lg: 'h2' }`. NOTHING ELSE.
- `sx` NEVER for: `width`, `height`, `borderRadius`, `backgroundColor`, `color`, `fontStyle`, `border`, `'&:hover'`, `minHeight`. Use SCSS class with `rem-calc()` instead.
- NEVER mix sx and SCSS on same element
- MUI Stack/Grid system props (`direction`, `spacing`, `alignItems`) generate inline styles — NEVER override them via SCSS. Use responsive prop syntax instead: `direction={{ xs: 'column', lg: 'row' }}`
- Only use MUI component variants defined in the design system — if `typings.d.ts` disables a variant (e.g., `outlined: false`), do NOT use it; if a custom variant exists (e.g., `containedSecondary`), use it instead of ad-hoc styling
- Use `cx` from `clsx` for className merging — NEVER template literals or string concatenation
- SCSS uses `@use` (not `@import`)
- Colors from theme variables — no hardcoded hex/rgba. Use `colors.xxx` from `@/styles/themes/colors` in TSX, `$xxx` from `variables.scss` in SCSS
- No hardcoded rgba/hex in theme files (components.ts, palette.ts) — define as named tokens in colors.ts
- NEVER use MUI string color references like `color="primary"` — use explicit `color={colors.green500}`
- `rem-calc()` for sizing — no hardcoded px
- Responsive via `@include media()` mixin
- No inline `style={{}}` on components — for dynamic JS values use CSS custom properties (`style={{ '--progress': value } as CSSProperties}`) consumed in SCSS via `var(--progress)`
- For elements using `component="button"`, add browser button reset in SCSS (single declarations, no duplicate `border`): `border: rem-calc(1) solid $gray-100; background: none; cursor: pointer; padding: 0`

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
- `Box component="button"` ALWAYS needs `type="button"` — prevents unintended form submission
- Toggle/selectable elements MUST have `aria-pressed={selected}`. If disableable: `aria-pressed={disabled ? undefined : selected}`
- Icon-only buttons MUST have `aria-label={translatedName}` — buttons without visible text are invisible to screen readers
- Images have descriptive `alt` text — ALWAYS translated, never empty, never hardcoded English
- ARIA labels on IconButton and custom controls — ALWAYS translated via `useTranslations`, never hardcoded English
- WCAG contrast: if background is lighter than `gray500`, text MUST be dark — never white text on light badge/chip
- Loading spinners/skeletons need `aria-label`: `<CircularProgress aria-label={t('loading')} />`
- Form inputs have associated labels
- NEVER nest interactive elements (e.g., Link wrapping Button) — use `component={Link}` on the outer element
- Custom interactive elements (non-MUI) need `tabIndex={0}`, `onKeyDown` for Enter/Space, and proper `role`
- Use correct `aria-haspopup` values: `"menu"` for menus, `"listbox"` for select/autocomplete, `"dialog"` for modals
- Wizard/stepper: move focus to new step's heading on step transition

## Config Data
- Static data arrays (nav items, tabs, sidebar links, language options) go in `src/config/*.config.ts` — NEVER hardcode inline in components
- Export a typed const array with a proper interface from `@/types/`

## SVG Icons
- All icons in `src/components/SvgIcons/`, grouped by category in subfolders with `index.ts` barrel exports
- MANDATORY props: `props?: SVGProps<SVGSVGElement>`, `fill?: string` (default `'currentColor'`), `size?: string | number` (default `24`)
- Spread `{...props}` on `<svg>`, use `width={size} height={size}`, keep original `viewBox`
- In SSR-rendered components: avoid `fill="currentColor"` if it causes hydration mismatch — use explicit color value instead

## Exports
- Always `const X = () => ...` + `export default X` — NEVER `export default function`
- Barrel exports (index.ts): `import X from './X'; export default X;` only — NEVER `export *`

## Reusable Wrappers
- If multiple pages share the same shell (image panel + content panel), extract a wrapper component that accepts `children` + config props
- Layout files (`layout.tsx`) MUST be server components — extract client logic (`usePathname`, hooks) into a separate client component

## Forms
- Always create `form-models.config.ts` (default values) and `form-names.config.ts` (form ID constants)
- Form value types belong in `@/types/forms/*.type.ts` — NEVER in config files or inline in views
- `defaultValues` ALWAYS from `formModels` in config — NEVER defined inline in views
- `<Form>` — no generic types, always pass `id={FORM_NAME}` and `mode="onBlur"`
- `<FormInput>` — use `label` prop (filled variant), NOT `placeholder`
- In custom `renderInput` with Controller, always call `field.onBlur()` — RHF needs it for validation
- Use `useToggleState` hook for password visibility toggle — never manual `useState` + toggle

## Security
- NEVER `console.log` form data, user credentials, tokens, or reset codes — especially not in server actions
- Every `.then()` on a server action needs a `.catch()` — every async call needs try/catch. Without error handling, the UI can hang forever on `CircularProgress`
- Server actions that mutate (POST/PUT/DELETE) MUST derive user identity server-side via `getLoggedInUser()` — NEVER accept `userId` as a client parameter (can be tampered)

## Forbidden
- NEVER use `React.memo`, `useMemo`, or `useCallback`
- NEVER use `any` or `unknown` — use proper library types (e.g., `FieldErrors`, `FieldError` from RHF)
- NEVER use `as` type assertions — design types so casts are unnecessary
- NEVER use `eslint-disable` or `@ts-ignore` — fix the underlying type or lint issue
- NEVER use `typeof`/`keyof`/`as Record`/`as keyof typeof` for runtime type introspection — use explicit data
- NEVER create per-action response types (`LoginResult`, `RegisterResult`) — use one `ActionResponse<T>`
- NEVER use `useActionState` + `useEffect` for form submission — use `useTransition` + direct `await`
- NEVER use `ButtonBase` — use `Box component="button"` with SCSS reset + `type="button"`
- Figma data values (numbers, dates, codes, names) are PLACEHOLDERS — check API model for the field and render dynamically
- Conditional hint/helper text MUST be inside the same conditional as the data it describes
- Don't create wrapper components for pages when `page.tsx` can import sections directly
- NEVER copy patterns from existing code without validating against these rules — existing code may contain bugs. Common bugs copied between files: hardcoded `aria-label`, `sx={{ backgroundColor }}`, `mode="onSubmit"`, inline `defaultValues`
- NEVER duplicate a helper/pattern across 3+ files — after the 2nd occurrence, extract to a shared component
- When touching a file, FIX ALL existing rule violations in that file — `mode="onSubmit"` → `"onBlur"`, hardcoded `aria-label` → translated, `sx` abuse → SCSS class, missing `component` prop → add it, `.root` → `.container`, inline `defaultValues` → config
- Don't use growing hardcoded pathname lists or inline arrays — put them in `src/config/*.config.ts`
- No inline arrow functions in JSX event handlers — use handler factories: `const handleClick = (id: string) => () => action(id)`
- Components that always appear with a specific label should include it inside — parent's `.map()` should be clean
- Modals triggered from list items (cards) → valtio store tracks which item, modal renders ONCE at section level — not per card
- Responsive grid layouts → MUI `<Grid container>` + `<Grid size={{ xs, md, xl }}>` — NEVER CSS Grid in SCSS
- No prop drilling past 2 levels — use store
