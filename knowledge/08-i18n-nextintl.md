# Internationalization — next-intl (Next.js)

Complete guide for setting up internationalization with next-intl in Next.js App Router projects. Covers routing, translations, error pages, and common pitfalls.

## Setup Files

### next.config.js

Wrap config with next-intl plugin. **Must include `createMessagesDeclaration`** for type-safe translations:

```js
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: [
      './messages/en/common.json',
      './messages/en/navigation.json',
      './messages/en/errors.json',
    ],
  },
});

module.exports = withNextIntl(nextConfig);
```

**When adding a new namespace**: add its English JSON path to `createMessagesDeclaration`.

### src/i18n/routing.ts

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/reserve': { hr: '/rezerviraj' },
    '/bookings': { hr: '/rezervacije' },
    '/profile': { hr: '/profil' },
  },
});
```

**When adding a new page**: add its pathname here, otherwise `Link` from `@/i18n/navigation` will throw a type error.

### src/i18n/request.ts

Each namespace must be **manually listed** with `as const`:

```typescript
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    navigation: (await import(`../../messages/${locale}/navigation.json`)).default,
    errors: (await import(`../../messages/${locale}/errors.json`)).default,
  } as const;

  return { locale, messages };
});
```

### src/i18n/navigation.ts

```typescript
import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### src/i18n/global.d.ts

**Critical**: use `import { routing } from './routing'` (relative, not `@/`). This is the only pattern that works reliably with linters:

```typescript
import { routing } from './routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof import('../../messages/en/common.json').default;
      navigation: typeof import('../../messages/en/navigation.json').default;
      errors: typeof import('../../messages/en/errors.json').default;
    };
  }
}
```

### src/proxy.ts (Next.js 16) or src/middleware.ts (Next.js 15)

```typescript
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

## Message Files

```
messages/
├── en/
│   ├── common.json
│   ├── navigation.json
│   └── errors.json
└── hr/
    ├── common.json
    ├── navigation.json
    └── errors.json
```

Each namespace is a separate JSON file. **Never nest error keys inside common.json** — use a dedicated `errors.json`.

## New Namespace Checklist

When adding a new namespace (e.g., `booking`):

1. Create `messages/en/booking.json` and `messages/hr/booking.json`
2. Add import to `src/i18n/request.ts`:
   ```ts
   booking: (await import(`../../messages/${locale}/booking.json`)).default,
   ```
3. Add to `src/i18n/global.d.ts` Messages:
   ```ts
   booking: typeof import('../../messages/en/booking.json').default;
   ```
4. Add to `next.config.js` createMessagesDeclaration:
   ```js
   './messages/en/booking.json',
   ```

## Usage

**Client components:**
```tsx
'use client';
import { useTranslations } from 'next-intl';

const HeroSection = () => {
  const t = useTranslations('home');
  return <Typography>{t('hero.title')}</Typography>;
};
```

**Server components:**
```tsx
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('metadata');
  return { title: t('home.title') };
}
```

**Navigation — use Link from i18n/navigation:**
```tsx
import { Link } from '@/i18n/navigation';
// NOT next/link

<Link href="/about">{t('nav.about')}</Link>
```

## URL Pattern

With `localePrefix: 'as-needed'`:
- Default locale (en): `/about`
- Other locales: `/hr/o-nama` (with translated pathnames)

## Common Pitfalls

### 1. `typeof import()` doesn't resolve types
**Cause**: Missing `createMessagesDeclaration` in next.config.js.
**Fix**: Add all English message file paths to `createMessagesDeclaration`.

### 2. 404 page shows English on /hr routes
**Cause**: Missing `[locale]/[...rest]/page.tsx` catch-all.
**Fix**: Create catch-all that calls `notFound()`.

### 3. Error page crashes with "useTranslations" error
**Cause**: Root `error.tsx` renders a view that uses `useTranslations` without `NextIntlClientProvider`.
**Fix**: Root error/not-found must use hardcoded text or separate views without i18n hooks.

### 4. `import { routing } from '@/i18n/routing'` breaks global.d.ts
**Cause**: `@/` alias import makes linter add/remove things that break `declare module`.
**Fix**: Always use `import { routing } from './routing'` (relative) in global.d.ts.

### 5. `Link` component as prop causes hydration mismatch
**Cause**: `<Button component={Link}>` passes a client component function across server/client boundary.
**Fix**: Use `<Button href="/">` or wrap with `<Link><Button></Button></Link>`.

### 6. New route not accepted by Link href
**Cause**: Route not in `routing.ts` pathnames.
**Fix**: Add pathname to `src/i18n/routing.ts`.

## Dependencies

```bash
yarn add next-intl
yarn add @mui/material-nextjs  # For AppRouterCacheProvider in error boundaries
```
