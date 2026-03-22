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
    pricing: (await import(`../../messages/${locale}/pricing.json`)).default,
  } as const;

  return { locale, messages };
});
