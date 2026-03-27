# Next.js App Router

## App Router Layout Structure

```
src/app/
├── error.tsx                    # Root error fallback (hardcoded EN, no i18n)
├── not-found.tsx                # Root 404 fallback (hardcoded EN, no i18n)
├── robots.ts
├── sitemap.ts
└── [locale]/
    ├── layout.tsx               # Root layout — NextIntlClientProvider wraps children
    ├── providers.tsx             # ThemeProvider + Toast
    ├── error.tsx                 # Locale error — wraps own providers (error boundary resets them)
    ├── not-found.tsx             # Locale 404 — gets providers from layout
    ├── [...rest]/
    │   └── page.tsx             # Catch-all → notFound() — REQUIRED for locale 404 to work
    ├── (home)/
    │   ├── layout.tsx           # Route group layout — Header + Layout + BottomTabBar
    │   ├── page.tsx
    │   ├── reserve/page.tsx
    │   ├── bookings/page.tsx
    │   └── profile/page.tsx
    ├── (public)/                # Public pages with shared layout
    │   ├── layout.tsx
    │   ├── about/page.tsx
    │   ├── contact/page.tsx
    │   └── blog/
    │       ├── page.tsx
    │       └── [slug]/page.tsx
    └── (simple)/                # Minimal layout pages
        └── layout.tsx
```

## Root Layout

The root layout wraps everything with providers, metadata, and JSON-LD:

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Providers from './providers';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(meta.url),
    title: { default: t(meta.title), template: t(meta.titleTemplate) },
    description: t(meta.description),
    alternates: { canonical: meta.url, languages: buildAlternateLanguages('/') },
    openGraph: { /* ... */ },
    twitter: { /* ... */ },
    icons: { /* ... */ },
  };
}

const RootLayout = async ({ children, params }) => {
  const { locale } = await params;
  const messages = await getMessages();

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale}>
      <head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};
```

## Page Conventions

Pages are thin — they import from views:

```tsx
// src/app/[locale]/(public)/about/page.tsx
import { getTranslations } from 'next-intl/server';
import AboutView from '@/views/About';
import { buildMetadata } from '@/utils/static/buildMetadata';

export async function generateMetadata() {
  const t = await getTranslations('metadata.metadata.about');
  return buildMetadata({ title: t('title'), description: t('description'), path: t('path') });
}

const AboutPage = () => <AboutView />;
export default AboutPage;
```

## Error & Not-Found Pages

### Three-level architecture

| File | Purpose | Has i18n? | Why |
|------|---------|-----------|-----|
| `src/app/not-found.tsx` | Root fallback when locale unknown | NO | No NextIntlClientProvider above it |
| `src/app/error.tsx` | Root error fallback | NO | No NextIntlClientProvider above it |
| `src/app/[locale]/not-found.tsx` | Locale-aware 404 | YES | Layout provides NextIntlClientProvider |
| `src/app/[locale]/error.tsx` | Locale-aware error | YES | Layout providers still available |
| `src/app/[locale]/[...rest]/page.tsx` | Catch-all trigger | N/A | Calls notFound() to trigger locale 404 |

### [locale]/[...rest]/page.tsx — REQUIRED

Without this catch-all, Next.js uses root `not-found.tsx` for unknown routes, bypassing locale translations entirely:

```tsx
import { notFound } from 'next/navigation';

const CatchAllPage = () => {
  notFound();
};

export default CatchAllPage;
```

### [locale]/not-found.tsx — Simple (providers from layout)

```tsx
import NotFoundPage from '@/views/NotFoundPage';

const NotFound = () => <NotFoundPage />;

export default NotFound;
```

### [locale]/error.tsx — Simple (layout provides providers)

The `[locale]/error.tsx` renders inside the locale layout, so `NextIntlClientProvider`, `ThemeProvider`, and `AppRouterCacheProvider` are already available. Do NOT re-wrap with providers.

```tsx
'use client';

import ErrorPage from '@/views/ErrorPage';

const Error = () => <ErrorPage />;

export default Error;
```

### Root not-found.tsx — Hardcoded English, inline

No i18n, no views — stays inline with its own providers. Do NOT delegate to views that use `useTranslations`.

```tsx
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Container, Stack, Typography } from '@mui/material';

import theme from '@/styles/themes';

const GlobalNotFound = () => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <Container component="section">
        <Stack alignItems="center" justifyContent="center" spacing={2} minHeight="100vh">
          <Typography variant="h1">404</Typography>
          <Typography variant="subtitle1">Page Not Found</Typography>
          <Button href="/" variant="contained">Go to homepage</Button>
        </Stack>
      </Container>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default GlobalNotFound;
```

### Root error.tsx — Hardcoded English, inline with providers

Needs `AppRouterCacheProvider` + `ThemeProvider` for MUI to work, but NO `NextIntlClientProvider`. Stays inline — do NOT delegate to views that use i18n hooks.

```tsx
'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Button, Container, Stack, Typography } from '@mui/material';

import theme from '@/styles/themes';

const Error = () => (
  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <Container component="section">
        <Stack alignItems="center" justifyContent="center" spacing={2} minHeight="100vh">
          <Typography variant="h1">Error</Typography>
          <Typography variant="subtitle1">Something went wrong</Typography>
          <Button href="/" variant="contained">Go to homepage</Button>
        </Stack>
      </Container>
    </ThemeProvider>
  </AppRouterCacheProvider>
);

export default Error;
```

### Error/NotFound View Components

```
src/views/
├── ErrorPage/
│   ├── ErrorPage.tsx       # 'use client', useTranslations('errors')
│   └── index.ts
└── NotFoundPage/
    ├── NotFoundPage.tsx    # 'use client', useTranslations('errors')
    └── index.ts
```

**Rules for error/not-found views:**
- Mark as `'use client'` (they use hooks)
- Use `useTranslations('errors')` — dedicated namespace, not nested in common
- Use `Button component={Link} href="/"` for locale-aware navigation (plain `href` would lose locale prefix)
- `AppRouterCacheProvider` goes in global `providers.tsx`, not duplicated in error pages
- Root-level `app/error.tsx` and `app/not-found.tsx` stay inline — do NOT delegate to views that use i18n hooks
- Only `[locale]/error.tsx` and `[locale]/not-found.tsx` delegate to views
- Next.js does NOT support `metadata` exports from `not-found.tsx` — only from `page.tsx` and `layout.tsx`

## View Section Pattern

Every view section MUST start with a `Container` component using `component="section"`:

```tsx
<Container component="section" className={styles.container}>
  <Container disableGutters maxWidth="xl">
    {/* section content */}
  </Container>
</Container>
```

## Server vs Client Components

**Server (default)** — no directive needed:
- Data fetching, static content, no hooks/events

**Client** — add `'use client'`:
- useState, useEffect, useRef
- onClick, onChange handlers
- useTranslations (next-intl)
- Browser APIs

## Special Files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI wrapper (persists across pages) |
| `page.tsx` | Page content |
| `loading.tsx` | Loading UI (Suspense fallback) |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

## Server Actions

Place in `src/actions/`:

```typescript
'use server';

export async function submitForm(data: FormData) {
  // server-side logic
  revalidatePath('/contact');
}
```

## Dynamic Routes

```
[slug]/page.tsx       # Dynamic segment
[...slug]/page.tsx    # Catch-all
[[...slug]]/page.tsx  # Optional catch-all
```

Use `generateStaticParams` for SSG:

```typescript
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({ slug: post.slug }));
}
```
