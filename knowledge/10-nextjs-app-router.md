# Next.js App Router

## Route Groups

Use parenthesized folders for layout grouping without affecting URL:

```
src/app/[locale]/
├── (home)/          # Home layout (Header + Footer)
│   ├── layout.tsx
│   └── page.tsx
├── (public)/        # Public pages (shared nav layout)
│   ├── layout.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   └── blog/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── (simple)/        # Minimal layout (legal pages)
│   └── layout.tsx
└── (booking)/       # Booking flow layout
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
