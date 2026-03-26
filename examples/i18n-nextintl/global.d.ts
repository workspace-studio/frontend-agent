import { routing } from '@/i18n/routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      common: typeof import('../../messages/en/common.json').default;
      home: typeof import('../../messages/en/home.json').default;
      metadata: typeof import('../../messages/en/metadata.json').default;
      contact: typeof import('../../messages/en/contact.json').default;
    };
  }
}
