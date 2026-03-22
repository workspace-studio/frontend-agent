# Internationalization — next-intl (Next.js)

## Setup Files

### routing.ts

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/pricing': { hr: '/cijene' },
    '/contact': { hr: '/kontakt' },
    '/about': { hr: '/o-nama' },
    '/privacy-policy': { hr: '/pravila-privatnosti' },
  },
});
```

### request.ts

```typescript
// src/i18n/request.ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const messages = {
    common: (await import(`../../messages/${locale}/common.json`)).default,
    home: (await import(`../../messages/${locale}/home.json`)).default,
    metadata: (await import(`../../messages/${locale}/metadata.json`)).default,
    contact: (await import(`../../messages/${locale}/contact.json`)).default,
  } as const;

  return { locale, messages };
});
```

### navigation.ts

```typescript
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
```

### middleware.ts

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### next.config.js

```javascript
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: [
      './messages/en/home.json',
      './messages/en/common.json',
      './messages/en/metadata.json',
    ],
  },
});

module.exports = withNextIntl(nextConfig);
```

## Message Files

```
messages/
├── en/
│   ├── common.json
│   ├── home.json
│   ├── metadata.json
│   └── contact.json
└── hr/
    ├── common.json
    ├── home.json
    ├── metadata.json
    └── contact.json
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
