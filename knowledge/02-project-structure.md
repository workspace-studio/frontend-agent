# Project Structure

## Next.js Projects

```
src/
├── app/                    # App Router
│   ├── error.tsx          # Root error fallback (hardcoded EN, no i18n)
│   ├── not-found.tsx      # Root 404 fallback (hardcoded EN, no i18n)
│   ├── robots.ts          # robots.txt generation
│   ├── sitemap.ts         # Sitemap generation
│   └── [locale]/          # Dynamic locale segment
│       ├── layout.tsx     # Root layout — NextIntlClientProvider
│       ├── providers.tsx  # ThemeProvider + Toast
│       ├── error.tsx      # Locale error — wraps own providers
│       ├── not-found.tsx  # Locale 404
│       ├── [...rest]/
│       │   └── page.tsx   # Catch-all → notFound() (REQUIRED)
│       ├── (home)/        # Route group: home layout
│       ├── (public)/      # Route group: public pages
│       └── (simple)/      # Route group: minimal layout
├── components/            # Reusable UI components
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.scss  # Only if needed
│   │   ├── Header.spec.tsx     # Playwright test
│   │   └── index.ts            # Barrel export
│   └── SvgIcons/          # SVG icon components
│       ├── Locales/       # Grouped by category
│       │   ├── EnFlag.tsx
│       │   ├── HrFlag.tsx
│       │   └── index.ts   # Named exports
│       └── ArrowLeft.tsx  # Ungrouped icons
├── views/                 # Page-level view components
│   ├── Home/
│   │   ├── HeroSection/
│   │   └── FeaturesSection/
│   ├── ErrorPage/         # 'use client', useTranslations('errors')
│   └── NotFoundPage/      # 'use client', useTranslations('errors')
├── i18n/                  # next-intl config
│   ├── routing.ts
│   ├── request.ts
│   ├── navigation.ts
│   └── global.d.ts        # next-intl AppConfig type declarations
├── proxy.ts               # next-intl routing (Next.js 16) or middleware.ts (Next.js 15)
├── config/                # Configuration files (*.config.ts)
│   ├── meta.config.ts     # Site metadata (name, url, OG defaults)
│   ├── navigation.config.ts  # Nav items, tabs, sidebar links
│   └── languages.config.ts   # Language picker options
├── styles/
│   ├── index.scss         # Global imports
│   ├── globals/           # Reset, fonts, animations
│   ├── mixins/            # Responsive breakpoints
│   ├── settings/          # SCSS variables
│   ├── utils/             # rem-calc helper
│   └── themes/            # MUI theme (6 files)
├── types/                 # TypeScript definitions
└── utils/
    ├── hooks/             # Custom hooks
    └── static/            # Pure utility functions
```

## React+Vite Projects

```
src/
├── components/            # Reusable UI components
├── views/                 # Page-level views
│   └── Customers/
│       ├── Customers.tsx
│       ├── partials/      # Sub-components (modals, drawers)
│       └── index.ts
├── routers/
│   └── AppRouter.tsx      # React Router with lazy loading
├── valtio/                # State management
│   └── customers/
│       ├── customers.store.ts
│       └── customers.actions.ts
├── services/              # API service classes
├── config/
│   ├── axios.config.ts    # Axios instance + interceptors
│   ├── constants.config.ts
│   └── forms/
│       └── form-models.config.ts
├── i18n/
│   └── i18n.ts            # i18next configuration
├── locales/               # Translation files
│   ├── en/
│   ├── hr/
│   ├── ba/
│   └── rs/
├── models/                # Data model interfaces
├── styles/
│   └── themes/            # MUI theme (6 files)
├── types/                 # TypeScript definitions
└── utils/
    ├── hooks/
    └── context/           # React context providers
```

## Shared: MUI Theme Structure

Both Next.js and React projects use the same 6-file theme:

```
src/styles/themes/
├── colors.ts          # Color constants
├── breakpoints.ts     # Breakpoint values
├── palette.ts         # MUI palette config
├── typography.ts      # Font variants
├── components.ts      # MUI component overrides
└── index.ts           # createTheme composition
```

## Component Folder Pattern

Every component lives in its own folder:

```
ComponentName/
├── ComponentName.tsx        # Component code
├── ComponentName.module.scss  # ONLY if component has custom styles
├── ComponentName.spec.tsx   # Playwright component test
└── index.ts                 # Barrel export
```

**index.ts pattern:**
```typescript
import ComponentName from './ComponentName';

export default ComponentName;
```
