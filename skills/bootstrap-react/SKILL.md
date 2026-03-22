---
name: bootstrap-react
description: Bootstrap a new React+Vite project from the workspace-studio boilerplate with MUI, SCSS, Valtio, i18next, and Axios
---

# Bootstrap React+Vite Project

Bootstrap a new React+Vite project. Usage: `/bootstrap-react project-name — description, locales`

## Steps

### Step 1: Clone Boilerplate

```bash
git clone https://github.com/workspace-studio/react-vite-boilerplate.git {project-name}
cd {project-name}
rm -rf .git
git init
```

### Step 2: Install Dependencies

The boilerplate includes React, TypeScript, Sass, React Router, ESLint, Stylelint, Prettier, Husky, clsx. Install additional packages:

```bash
yarn install
yarn add @mui/material @emotion/react @emotion/styled valtio i18next react-i18next i18next-browser-languagedetector axios react-hook-form
yarn add -D @playwright/experimental-ct-react
```

### Step 3: Set Up MUI Theme

Create `src/styles/themes/` with 6 files (colors, breakpoints, palette, typography, components, index).

### Step 4: Set Up i18n

Create `src/i18n/i18n.ts` with LanguageDetector. Create `src/locales/{locale}/` with JSON files.

### Step 5: Set Up Valtio Auth Store

Create `src/valtio/auth/auth.store.ts` + `auth.actions.ts` with token management.

### Step 6: Set Up Axios

Create `src/config/axios.config.ts` with token interceptor and refresh queue.

### Step 7: Configure Router

Update `src/routers/AppRouter.tsx` with login (anonymous) and home (protected) routes using AppRoute wrapper.

### Step 8: Generate CLAUDE.md

Create from `@templates/CLAUDE.md.react.template`.

### Step 9: Validate

```bash
yarn build && yarn lint
```

### Step 10: Commit

```bash
git add .
git commit -m "chore: bootstrap React+Vite project from workspace-studio boilerplate"
```

## Boilerplate Reference

The [react-vite-boilerplate](https://github.com/workspace-studio/react-vite-boilerplate) includes:
- React with TypeScript and Vite
- React Router for routing
- Sass with organized styles (settings, mixins, utils)
- ESLint (Airbnb) + Stylelint + Prettier
- Husky pre-commit hooks
- clsx for conditional classNames
- Project structure (components, views, routers, services, config, utils, types, models)
