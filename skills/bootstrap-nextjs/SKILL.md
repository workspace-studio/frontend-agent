---
name: bootstrap-nextjs
description: Bootstrap a new Next.js project from the workspace-studio boilerplate with MUI, SCSS, next-intl, and SEO
---

# Bootstrap Next.js Project

Bootstrap a new Next.js project. Usage: `/bootstrap-nextjs project-name — description, locales`

## Steps

### Step 1: Clone Boilerplate

```bash
git clone https://github.com/workspace-studio/nextjs-boilerplate.git {project-name}
cd {project-name}
rm -rf .git
git init
```

### Step 2: Install Dependencies

The boilerplate includes React, TypeScript, Sass, ESLint, Stylelint, Prettier, Husky. Install additional packages:

```bash
yarn install
yarn add @mui/material @emotion/react @emotion/styled @mui/material-nextjs next-intl react-hook-form
yarn add -D @playwright/experimental-ct-react
```

### Step 3: Set Up i18n

Create `src/i18n/` with routing.ts, request.ts, navigation.ts, global.d.ts (use RELATIVE import `./routing` in global.d.ts). Create `src/proxy.ts` (Next.js 16) or `src/middleware.ts` (Next.js 15). Create `messages/{locale}/` with initial JSON files including `errors.json`. Configure `next.config.js` with `withNextIntl` and `createMessagesDeclaration` array.

### Step 3b: Set Up Global Store

Create `src/valtio/global/global.store.ts` + `global.actions.ts` with toast and isFormDirty (see @examples/valtio-store/global.*). Create `src/types/toast.type.ts`. Create `src/components/Toast/Toast.tsx` with Snackbar + Alert + custom SVG icons. Place `<Toast />` in root layout/providers.

### Step 4: Set Up MUI Theme

Create `src/styles/themes/` with 6 files (colors, breakpoints, palette, typography, components, index).

### Step 5: Create Root Layout

Create `src/app/[locale]/layout.tsx` with providers, metadata, JSON-LD, NextIntlClientProvider.

### Step 6: Create Home Page

Create `src/app/[locale]/(home)/layout.tsx` (Header + Footer), `page.tsx`, and `src/views/Home/HeroSection/`. View sections start with `<Container component="section">`.

### Step 7: Configure next.config.js

Add `withNextIntl`, `sassOptions`, `images.remotePatterns`.

### Step 8: Create Error & Not-Found Pages

Three-level architecture (see @knowledge/10-nextjs-app-router.md):
- Root `src/app/error.tsx` + `src/app/not-found.tsx` — hardcoded EN, no i18n, MUI with AppRouterCacheProvider + ThemeProvider
- `src/app/[locale]/error.tsx` — wraps own providers (error boundary destroys layout)
- `src/app/[locale]/not-found.tsx` — simple, uses providers from layout
- `src/app/[locale]/[...rest]/page.tsx` — catch-all calls `notFound()` (REQUIRED for locale 404 to work)
- `src/views/ErrorPage/` + `src/views/NotFoundPage/` — use `useTranslations('errors')`

### Step 9: Create SEO Files

Create `src/app/robots.ts` and `src/app/sitemap.ts`.

### Step 10: Generate CLAUDE.md

Create from `@templates/CLAUDE.md.nextjs.template`.

### Step 11: Validate

```bash
yarn build && yarn lint
```

### Step 12: Commit

```bash
git add .
git commit -m "chore: bootstrap Next.js project from workspace-studio boilerplate"
```

## Boilerplate Reference

The [nextjs-boilerplate](https://github.com/workspace-studio/nextjs-boilerplate) includes:
- Next.js with TypeScript and App Router
- Sass with organized styles (settings, mixins, utils)
- ESLint (Airbnb) + Stylelint + Prettier
- Husky pre-commit hooks
- Project structure (components, views, config, utils, types)
