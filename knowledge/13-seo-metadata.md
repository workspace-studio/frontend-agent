# SEO & Metadata

## generateMetadata Per Page

Every Next.js page must export `generateMetadata()`:

```typescript
import{ Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/utils/static/buildMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.about');

  return buildMetadata({
    title: t('title'),
    description: t('description'),
    path: t('path'),
  });
}
```

## Root Layout Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(meta.url),
    title: { default: t(meta.title), template: t(meta.titleTemplate) },
    description: t(meta.description),
    alternates: {
      canonical: meta.url,
      languages: buildAlternateLanguages('/'),
    },
    openGraph: {
      type: 'website',
      url: meta.url,
      title: { default: t(meta.title), template: t(meta.titleTemplate) },
      description: t(meta.description),
      images: [{ url: `${meta.url}/meta/og-image.png`, width: 1200, height: 630, alt: meta.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: { default: t(meta.title), template: t(meta.titleTemplate) },
      images: [`${meta.url}/meta/og-image.png`],
    },
    icons: {
      icon: '/favicons/favicon.ico',
      apple: '/favicons/apple-touch-icon.png',
      other: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicons/favicon-16x16.png' },
      ],
    },
    manifest: '/favicons/site.webmanifest',
  };
}
```

## robots.ts

```typescript
import{ MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const protectedPaths = ['/admin', '/my-profile', '/my-bookings', '/forgot-password'];

export default function robots(): MetadataRoute.Robots {
  const disallow = routing.locales.flatMap(locale => {
    const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
    return protectedPaths.map(path => `${prefix}${path}`);
  });

  return {
    rules: [{ userAgent: '*', allow: '/', disallow }],
    host: process.env.NEXT_PUBLIC_BASE_URL,
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
```

## sitemap.ts

```typescript
import{ MetadataRoute } from 'next';
import { meta } from '@/config/meta.config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/hr', '/about', '/hr/o-nama', '/contact', '/hr/kontakt', '/blog', '/hr/blog'];

  return routes.map(path => ({
    url: `${meta.url}${path}`,
    lastModified: new Date(),
  }));
}
```

## Multi-Sitemap (Large Sites)

For sites with dynamic content, use a sitemap index:

```typescript
// src/app/sitemap.xml/route.ts
export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${baseUrl}/sitemap-static.xml</loc></sitemap>
  <sitemap><loc>${baseUrl}/sitemap-blogs.xml</loc></sitemap>
</sitemapindex>`;

  return new Response(sitemap, { headers: { 'Content-Type': 'application/xml' } });
}
```

## JSON-LD Structured Data

Use `schema-dts` types for type safety. Injected via a `JsonLd` component:

```tsx
// src/components/JsonLd/JsonLd.tsx
'use client';
import { Graph, WithContext, Thing } from 'schema-dts';

interface JsonLdProps {
  schema: Graph | WithContext<Thing>;
}

const JsonLd = ({ schema }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
    }}
  />
);
```

**XSS escape is mandatory** — `.replace(/</g, '\\u003c')` prevents `</script>` injection.

### Rules for JSON-LD

- ALL schema content goes through translation keys — `t('sportsLocationName')`, `t('amenityTennisCourts')`. NEVER hardcode names/descriptions per locale
- `availableLanguage` MUST be dynamic from `routing.locales`: `routing.locales as unknown as string[]`
- For Schema.org types not fully covered by `schema-dts` (e.g., `SportsActivityLocation` with `amenityFeature`): use untyped object literal + `as const` on `@type` + cast final return as `as Graph`. NEVER use `any` — ask user first
- Verify business names against Google Maps before finalizing — don't invent organizational structures ("sports center") that don't exist

## Dynamic Language Alternates

Never hardcode language mappings. Generate dynamically from `routing.locales`:

```typescript
const buildAlternateLanguages = (path: string) => ({
  'x-default': `${meta.url}${path}`,
  ...routing.locales.reduce((acc, loc) => {
    acc[loc] = loc === routing.defaultLocale ? `${meta.url}${path}` : `${meta.url}/${loc}${path}`;
    return acc;
  }, {} as Record<string, string>),
});
```

## Locale Type from routing

In `src/i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['en', 'hr'] as const, // `as const` enables tuple-to-union inference
  defaultLocale: 'en',
});

export type Locale = (typeof routing.locales)[number]; // 'en' | 'hr'
```

Use `Locale` everywhere — NEVER hardcode `'en' | 'hr'` union. For locale-keyed objects: `Partial<Record<Locale | 'x-default', string>>`.

## Content Rules

- NEVER use `locale === 'hr' ? A : B` pattern — always use translation keys
- All schema content (names, descriptions, amenity labels) goes in `messages/<locale>/common.json` under `base` namespace
- Verify location names, addresses, and geo coordinates against authoritative source (Google Maps link from user)
- Don't invent organizational names — ask user for exact business name

## SEO Validation Checklist

Before marking SEO work as done:
- [ ] JSON-LD validated in https://search.google.com/test/rich-results for ALL locales
- [ ] Sitemap XML validated with https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] OpenGraph preview checked with https://www.opengraph.xyz/
- [ ] Alternate language tags tested in Google Search Console
- [ ] Logo/favicon rendering visually confirmed with user
- [ ] All user-facing copy (titles, descriptions) reviewed by stakeholder — especially non-English translations

## OG Image

Place at `/public/meta/og-image.png` — dimensions 1200x630.
