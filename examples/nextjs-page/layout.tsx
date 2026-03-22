/* eslint-disable react/no-danger */
import React from 'react';

import type { Metadata } from 'next';
import { Locale, NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { meta } from '@/config/meta.config';
import { routing } from '@/i18n/routing';
import '@/styles/index.scss';
import { buildAlternateLanguages, getLocalizedJsonLd } from '@/utils/static/buildMetadata';

import Providers from './providers';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    metadataBase: new URL(meta.url),
    title: {
      default: t(meta.title),
      template: t(meta.titleTemplate),
    },
    description: t(meta.description),
    alternates: {
      canonical: meta.url,
      languages: buildAlternateLanguages('/'),
    },
    authors: [{ name: meta.name, url: meta.url }],
    applicationName: meta.name,
    robots: { index: true },
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
      description: t(meta.description),
      images: [`${meta.url}/meta/og-image.png`],
    },
    icons: {
      icon: '/favicons/favicon.ico',
      shortcut: '/favicons/favicon.ico',
      apple: '/favicons/apple-touch-icon.png',
      other: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicons/favicon-16x16.png' },
      ],
    },
    manifest: '/favicons/site.webmanifest',
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;
  const messages = await getMessages();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const localizedJsonLd = await getLocalizedJsonLd(locale);

  return (
    <html lang={locale}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localizedJsonLd) }} />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
