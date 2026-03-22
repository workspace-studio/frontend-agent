---
name: bootstrap-react
description: Bootstrap a new React+Vite project with MUI, SCSS, Valtio, i18next, and Axios from scratch
---

# Bootstrap React+Vite Project

Bootstrap a new React+Vite project. Usage: `/bootstrap-react project-name — description, locales`

## Steps

### Step 1: Create Project

```bash
npm create vite@latest {project-name} -- --template react-ts
cd {project-name}
```

### Step 2: Install Dependencies

```bash
yarn add @mui/material @emotion/react @emotion/styled react-router-dom valtio i18next react-i18next i18next-browser-languagedetector axios react-hook-form sass
yarn add -D @playwright/experimental-ct-react stylelint stylelint-config-standard-scss
```

### Step 3: Set Up Path Alias

Configure `@/` alias in `vite.config.ts` (resolve.alias) and `tsconfig.json` (paths).

### Step 4: Set Up MUI Theme

Create `src/styles/themes/` with 6 files.

### Step 5: Set Up SCSS Structure

Same as Next.js: globals, mixins, settings, utils.

### Step 6: Set Up i18n

Create `src/i18n/i18n.ts` with LanguageDetector. Create `src/locales/{locale}/` with JSON files.

### Step 7: Set Up Valtio Auth Store

Create `src/valtio/auth/auth.store.ts` + `auth.actions.ts` with token management.

### Step 8: Set Up Axios

Create `src/config/axios.config.ts` with token interceptor and refresh queue.

### Step 9: Create Router

Create `src/routers/AppRouter.tsx` with login (anonymous) and home (protected) routes.

### Step 10: Set Up Linting

Configure ESLint, Stylelint, Prettier, Husky.

### Step 11: Configure vite.config.ts

Add path alias, SCSS modern API, chunkSizeWarningLimit.

### Step 12: Generate CLAUDE.md

Create from `@templates/CLAUDE.md.react.template`.

### Step 13: Validate

```bash
yarn build && yarn lint
```

### Step 14: Commit

```bash
git checkout -b chore/bootstrap-project
git add .
git commit -m "chore: bootstrap React+Vite project with MUI, Valtio, i18n, and Axios"
```
