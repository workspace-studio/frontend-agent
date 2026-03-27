# SCSS Patterns

## SCSS Modules

Components use SCSS Modules (`.module.scss`) for scoped styling. Styles are imported as objects:

```tsx
import styles from './Header.module.scss';

<AppBar className={styles.container}>
```

## @use Imports

Always use `@use` (not `@import`):

```scss
@use '@/styles/settings/variables' as *;
@use '@/styles/utils/rem-calc' as *;
@use '@/styles/mixins/breakpoints' as *;
```

## rem-calc() Function

Use `rem-calc()` for all sizing instead of hardcoded px:

```scss
.container {
  padding: rem-calc(16 24);
  margin-top: rem-calc(72);
  border-radius: rem-calc(12);
  height: rem-calc(410);
}
```

## Responsive Breakpoints

Use the `@include media()` mixin:

```scss
// Mobile first (min-width)
@include media('lg') {
  // styles for lg and up
}

// Range (min to max)
@include media(0, 'md') {
  // styles for xs to md
}

// Custom values
@include media(0, 768px) {
  // styles for 0 to 768px
}
```

## SCSS Variables

Variables are defined in `src/styles/settings/variables.scss`:

```scss
// Colors (matching colors.ts)
$white: #ffffff;
$black: #000000;
$black-200: #d1d1d1;
$orange-500: #fa541c;
$gray-blue-50: #f5f8fa;
$gray-blue-100: #eaeff4;
$gray-blue-200: #d1dde6;
$gray-blue-400: #7b9db5;
$gray-blue-600: #476882;
$blue-200: #c0eafd;
$blue-500: #3db0f4;
$red-50: #fff0f0;
$red-600: #e70808;
$green-50: #f0fdf9;
$green-600: #0e8c79;
$yellow-50: #fffbeb;
$yellow-700: #b75406;

// Animation
$animation-duration__normal: 0.3s;
```

## Global SCSS Structure

```
src/styles/
├── index.scss           # Imports all global styles
├── globals/
│   ├── reset.scss       # CSS reset / normalize
│   ├── fonts.scss       # @font-face declarations (self-hosted .woff2 files)
│   └── animations.scss  # Keyframe animations
├── mixins/
│   └── breakpoints.scss # @include media() mixin
├── settings/
│   └── variables.scss   # $color and $spacing variables
└── utils/
    └── rem-calc.scss    # rem-calc() function
```

**fonts.scss** — Self-hosted `@font-face` declarations. Font `.woff2` files live in `public/fonts/` (Next.js) or `src/assets/fonts/` (React+Vite). Always use `.woff2` format with `font-display: swap`. NEVER use Google Fonts links, CDN imports, or `next/font/google`.

## Styling Priority

1. **MUI component props** (variant, size, color) — PREFERRED
2. **SCSS modules** — for custom styles beyond MUI props
3. **`sx` prop** — ONLY for one-off spacing (mt, mb, gap, p)

### Rules

- **SCSS modules PREFERRED** over sx prop
- **sx ONLY for spacing** — never for colors, borders, backgrounds, fonts
- **NEVER mix sx and SCSS** on the same element
- **Skip .module.scss** if MUI components + props are sufficient
- Use `classes` prop to override MUI component internal classes:

```tsx
<Chip
  classes={{ root: styles.root }}
  className={styles.highlighted}
/>
```

## SCSS Class Nesting

Top-level class is ALWAYS `.container` (never `.root`). All other classes nested inside:

```scss
.container {
  display: flex;
  padding: rem-calc(24);

  .title {
    color: $gray-blue-600;
  }

  .content {
    flex: 1;
  }
}
```

## Image Styling

Use SCSS class for `object-fit` — never inline `style={{ objectFit: 'cover' }}`:

```scss
.image {
  object-fit: cover;
}
```

## Complete Example

```scss
// StatusChip.module.scss
@use '@/styles/settings/variables' as *;
@use '@/styles/utils/rem-calc' as *;
@use '@/styles/mixins/breakpoints' as *;

.container {
  height: rem-calc(24);

  &.error {
    background-color: $red-50;
    color: $red-600;
  }

  &.success {
    background-color: $green-50;
    color: $green-600;
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;

    @include media('lg') {
      max-width: rem-calc(264);
    }
  }
}
```
