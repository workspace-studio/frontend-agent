# Accessibility

## Semantic HTML

Use proper HTML elements:

```tsx
<nav>           {/* Navigation */}
<main>          {/* Main content */}
<section>       {/* Thematic section */}
<article>       {/* Self-contained content */}
<aside>         {/* Sidebar */}
<header>        {/* Page/section header */}
<footer>        {/* Page/section footer */}
```

Use MUI `component` prop for semantic elements:

```tsx
<Container component="section">
<Stack component="nav">
<Box component="aside">
```

## ARIA Labels

Add `aria-label` to interactive elements without visible text. **ALWAYS translate aria-labels** — they are user-facing (screen readers read them):

```tsx
// ✅ Correct — translated
<IconButton aria-label={t('actions.openNav')} onClick={toggleNav}>
  <MenuIcon />
</IconButton>

// ❌ Wrong — hardcoded English
<IconButton aria-label="Open navigation drawer" onClick={toggleNav}>
  <MenuIcon />
</IconButton>
```

Use correct `aria-haspopup` values — not just `true`:
- `aria-haspopup="menu"` — for dropdown menus
- `aria-haspopup="listbox"` — for select/autocomplete dropdowns
- `aria-haspopup="dialog"` — for modal triggers

## Images

All images MUST have descriptive `alt` text:

```tsx
<Image
  src="/images/team.webp"
  alt="Our development team working together"
  fill
/>
```

For decorative images, use empty alt:
```tsx
<Image src="/decorative-bg.svg" alt="" role="presentation" />
```

## Interactive Element Nesting

NEVER nest interactive elements inside other interactive elements:
- `<Link><Button>Click</Button></Link>` — screen readers announce both, tab order breaks
- `<Button component={Link} href="/path">Click</Button>` — single interactive element

## Custom Interactive Elements

Non-MUI elements acting as buttons/controls MUST have:
- Proper `role` attribute (`role="button"`, etc.)
- `tabIndex={0}` for keyboard focus
- `onKeyDown` handler for Enter and Space keys
- Visual focus indicator
- Browser button reset in SCSS if using `component="button"`: `border: none; background: none; cursor: pointer; padding: 0`

## Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use proper tab order (natural DOM order)
- Focus management for modals (focus trap):

```tsx
<Dialog open={open} onClose={handleClose}>
  {/* MUI Dialog handles focus trap automatically */}
</Dialog>
```

## Color Contrast

Minimum WCAG AA contrast ratios:
- Normal text: 4.5:1
- Large text (18px+ or 14px+ bold): 3:1
- UI components: 3:1

## Form Labels

Every input must have an associated label:

```tsx
<TextField label={t('fields.email')} />

{/* For custom inputs: */}
<FormLabel htmlFor="custom-input">{t('fields.name')}</FormLabel>
<input id="custom-input" />
```

## Skip Navigation

Add skip link for keyboard users:

```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
<main id="main-content">
```

## MUI Built-in Accessibility

MUI components include:
- ARIA attributes on interactive elements
- Keyboard navigation for menus, dialogs, tabs
- Focus management for modals
- Screen reader announcements for alerts/snackbars
