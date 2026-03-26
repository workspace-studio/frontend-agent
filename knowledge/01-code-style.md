# Code Style & Conventions

## ESLint Configuration

The project uses `@typescript-eslint` with Airbnb and Prettier integration:

```js
{
  parser: '@typescript-eslint/parser',
  extends: ['@typescript-eslint/recommended', 'airbnb', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/order': ['error', {
      groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],
  },
}
```

## Prettier Configuration

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 120,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

Import sorting via `@trivago/prettier-plugin-sort-imports`:
- React/Next imports first
- Third-party packages
- `@/` aliased imports
- Relative imports
- `.module.scss` imports last

## Stylelint Configuration

```json
{
  "extends": ["stylelint-config-standard-scss", "stylelint-config-prettier-scss"],
  "plugins": ["stylelint-scss"],
  "rules": {
    "at-rule-no-unknown": null,
    "selector-class-pattern": null
  }
}
```

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components/files | PascalCase | `StatusChip.tsx` |
| SCSS modules | PascalCase | `StatusChip.module.scss` |
| Hooks | camelCase + use | `useToggleState` |
| Variables/functions | camelCase | `getBookings` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Store files | camelCase | `bookings.store.ts` |
| Action files | camelCase | `bookings.actions.ts` |
| Service files | camelCase | `bookings.service.ts` |
| Test files | PascalCase | `StatusChip.spec.tsx` |

## File Suffixes

| Type | Suffix | Example |
|------|--------|---------|
| Component | `.tsx` | `StatusChip.tsx` |
| SCSS module | `.module.scss` | `StatusChip.module.scss` |
| Test | `.spec.tsx` | `StatusChip.spec.tsx` |
| Store | `.store.ts` | `bookings.store.ts` |
| Actions | `.actions.ts` | `bookings.actions.ts` |
| Service | `.service.ts` | `bookings.service.ts` |
| Hook | `.ts` | `useAuth.ts` |
| Type | `.type.ts` | `response.type.ts` |
| Model | `.model.ts` | `booking.model.ts` |
| Config | `.config.ts` | `axios.config.ts`, `navigation.config.ts` |

### Config Files Pattern

Static data arrays/objects (navigation items, tabs, sidebar links, language options, etc.) go in `src/config/*.config.ts`. Export a typed const array with a proper interface from `@/types/`.

```typescript
// src/config/navigation.config.ts
import Home from '@/components/SvgIcons/Home';
import Reservations from '@/components/SvgIcons/Reservations';
import Book from '@/components/SvgIcons/Book';
import Profile from '@/components/SvgIcons/Profile';

import NavigationLink from '@/types/navigation-link.type';

const navItems: NavigationLink[] = [
  { text: 'home', href: '/', icon: Home },
  { text: 'reserve', href: '/reserve', icon: Reservations },
  { text: 'myBookings', href: '/bookings', icon: Book },
  { text: 'profile', href: '/profile', icon: Profile },
];

export default navItems;
```

Never hardcode static data arrays inline in components — always extract to a `.config.ts` file.

## Import Order

Always follow this order with blank lines between groups:

```typescript
// 1. React / Next.js imports
import React from 'react';
import { useTranslation } from 'react-i18next';

// 2. Third-party imports
import { Stack, Typography } from '@mui/material';

// 3. Absolute imports from @/
import StatusChip from '@/components/StatusChip';
import colors from '@/styles/themes/colors';

// 4. Relative imports
import styles from './Bookings.module.scss';
```

## Import Alias

**ALWAYS** use `@/` alias. **NEVER** use relative parent imports:

```typescript
import Component from '@/components/Component';   // ✅
import Component from '../components/Component';  // ❌
```

## Type Imports

Use `import type` for type-only imports:

```typescript
import type { BookingModel } from '@/models/booking.model';
import type { PaginatedResponse } from '@/types/response.type';
```

## Exports

- **Named exports only** — no default exports (except pages/layouts for Next.js and index.ts barrel files)
- One component per file
- File name must match component name

## Strict Rules

- **NEVER** use `any`, `unknown`, or untyped objects — always define proper interfaces/types
- **NEVER** use `React.memo`, `useMemo`, or `useCallback` — write simple, straightforward code
- **NEVER** use MUI `sx` prop for styling — use SCSS modules + MUI component props
