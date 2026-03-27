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
