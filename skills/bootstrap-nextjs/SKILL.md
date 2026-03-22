---
name: bootstrap-nextjs
description: Bootstrap a new Next.js project with MUI, SCSS, next-intl, and SEO from scratch
---

# Bootstrap Next.js Project

Bootstrap a new Next.js project. Usage: `/bootstrap-nextjs project-name — description, locales`

## Steps

### Step 1: Create Project

```bash
npx create-next-app@latest {project-name} --typescript --eslint --app --src-dir
cd {project-name}
```

### Step 2: Install Dependencies

```bash
yarn add @mui/material @emotion/react @emotion/styled next-intl react-hook-form sass
yarn add -D @playwright/experimental-ct-react stylelint stylelint-config-standard-scss
```

### Step 3: Set Up i18n

Create `src/i18n/` with routing.ts, request.ts, navigation.ts. Create `src/middleware.ts`. Create `messages/{locale}/` with initial JSON files. Configure `next.config.js` with `withNextIntl`.

### Step 4: Set Up MUI Theme

Create `src/styles/themes/` with 6 files (colors, breakpoints, palette, typography, components, index).

### Step 5: Set Up SCSS Structure

```
src/styles/
├── index.scss          # Global imports
├── globals/reset.scss  # CSS reset
├── mixins/breakpoints.scss
├── settings/variables.scss
└── utils/rem-calc.scss
```

### Step 6: Create Root Layout

Create `src/app/[locale]/layout.tsx` with providers, metadata, JSON-LD, NextIntlClientProvider.

### Step 7: Create Home Page

Create `src/app/[locale]/(home)/layout.tsx` (Header + Footer), `page.tsx`, and `src/views/Home/HeroSection/`.

### Step 8: Set Up Linting

Configure ESLint (@typescript-eslint + airbnb + prettier), Stylelint, Prettier, Husky.

### Step 9: Configure next.config.js

Add `withNextIntl`, `sassOptions`, `images.remotePatterns`.

### Step 10: Create SEO Files

Create `src/app/robots.ts` and `src/app/sitemap.ts`.

### Step 11: Generate CLAUDE.md

Create from `@templates/CLAUDE.md.nextjs.template`.

### Step 12: Validate

```bash
yarn build && yarn lint
```

### Step 13: Commit

```bash
git checkout -b chore/bootstrap-project
git add .
git commit -m "chore: bootstrap Next.js project with MUI, i18n, and SEO"
```
