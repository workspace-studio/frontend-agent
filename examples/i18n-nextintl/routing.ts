import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/pricing': {
      hr: '/cijene',
    },
    '/contact': {
      hr: '/kontakt',
    },
    '/about': {
      hr: '/o-nama',
    },
    '/blog': {
      hr: '/blog',
    },
    '/privacy-policy': {
      hr: '/pravila-privatnosti',
    },
  },
});
