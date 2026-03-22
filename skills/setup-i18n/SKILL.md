---
name: setup-i18n
description: Set up or extend internationalization — add locales or translation keys
---

# Setup i18n

Set up or extend i18n. Usage: `/setup-i18n add-locale de` or `/setup-i18n add-keys namespace.keygroup`

## Pre-Work

1. Detect stack from package.json
2. READ @knowledge/08-i18n-nextintl.md (Next.js) or @knowledge/09-i18n-i18next.md (React)
3. READ existing i18n config and message/locale files

## Steps — Add New Locale

### Next.js (next-intl)

1. Add locale to `src/i18n/routing.ts` locales array
2. Create `messages/{locale}/` directory
3. Copy all JSON files from default locale (en/) as starting point
4. Update `src/i18n/request.ts` imports if using static imports
5. Add translated pathnames if using `pathnames` in routing
6. Run `yarn build` to verify

### React+Vite (i18next)

1. Create `src/locales/{locale}/` directory with all namespace JSON files
2. Import all JSON files in `src/i18n/i18n.ts`
3. Add resources entry for new locale in i18n config
4. Add locale to `supportedLngs` array
5. Run `yarn build` to verify

## Steps — Add Translation Keys

1. Identify the namespace for the new keys
2. Add keys to ALL supported locale files
3. Use the keys in components via `useTranslations`/`useTranslation`
4. Run `yarn build` to verify no missing keys

## Rules

- ALWAYS add translations to ALL supported locales
- Copy English as the base for new locales
- Use consistent namespace naming (kebab-case for React, camelCase for Next.js)
- Never hardcode user-facing strings
