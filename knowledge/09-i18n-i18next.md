# Internationalization — i18next (React+Vite)

## Configuration

```typescript
// src/i18n/i18n.ts
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { Locale, SUPPORTED_LOCALES } from '@/config/constants.config';

// Import all locale files
import commonEn from '@/locales/en/common.json';
import navigationEn from '@/locales/en/navigation.json';
import tableEn from '@/locales/en/table.json';
import actionsEn from '@/locales/en/actions.json';

import commonHr from '@/locales/hr/common.json';
import navigationHr from '@/locales/hr/navigation.json';
import tableHr from '@/locales/hr/table.json';
import actionsHr from '@/locales/hr/actions.json';

export const defaultNS = 'common';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        navigation: navigationEn,
        table: tableEn,
        actions: actionsEn,
      },
      hr: {
        common: commonHr,
        navigation: navigationHr,
        table: tableHr,
        actions: actionsHr,
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    supportedLngs: SUPPORTED_LOCALES,
    fallbackLng: Locale.EN,
    ns: ['common', 'navigation', 'table', 'actions'],
    defaultNS,
  });

export default i18n;
```

## Locale Files

```
src/locales/
├── en/
│   ├── common.json
│   ├── navigation.json
│   ├── table.json
│   └── actions.json
├── hr/
│   ├── common.json
│   └── ...
├── ba/
│   └── ...
└── rs/
    └── ...
```

## Usage

```tsx
import { useTranslation } from 'react-i18next';

const CustomersList = () => {
  const { t } = useTranslation('customers');

  return (
    <Typography>{t('title')}</Typography>
    <Button>{t('actions.create')}</Button>
  );
};
```

## Language Switching

```typescript
import i18n from '@/i18n/i18n';

i18n.changeLanguage('hr');
```

## Adding a New Namespace

1. Create JSON files in ALL locale directories
2. Import the files in `src/i18n/i18n.ts`
3. Add to the `resources` object for each locale
4. Add namespace name to `ns` array

## Adding a New Locale

1. Create `src/locales/{locale}/` directory
2. Copy all JSON files from `en/` as starting point
3. Import all files in `i18n.ts`
4. Add resources entry
5. Add to `SUPPORTED_LOCALES` in constants

## Rules

- ALWAYS add translations to ALL supported locales
- Never hardcode user-facing strings
- Use consistent namespace naming (kebab-case)
- Import i18n.ts in main.tsx
