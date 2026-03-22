# SEO & Metadata

## generateMetadata Per Page

Every Next.js page must export `generateMetadata()`:

```typescript
import type { Metadata } from 'next';
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
import type { MetadataRoute } from 'next';
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
import type { MetadataRoute } from 'next';
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

Injected in root layout:

```tsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
  }) }}
/>
```

## OG Image

Place at `/public/meta/og-image.png` — dimensions 1200x630.
