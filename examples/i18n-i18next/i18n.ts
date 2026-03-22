import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { Locale, SUPPORTED_LOCALES } from '@/config/constants.config';

import actionsEn from '@/locales/en/actions.json';
import commonEn from '@/locales/en/common.json';
import navigationEn from '@/locales/en/navigation.json';
import settingsEn from '@/locales/en/settings.json';
import tableEn from '@/locales/en/table.json';

import actionsHr from '@/locales/hr/actions.json';
import commonHr from '@/locales/hr/common.json';
import navigationHr from '@/locales/hr/navigation.json';
import settingsHr from '@/locales/hr/settings.json';
import tableHr from '@/locales/hr/table.json';

export const defaultNS = 'common';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        navigation: navigationEn,
        table: tableEn,
        actions: actionsEn,
        settings: settingsEn,
      },
      hr: {
        common: commonHr,
        navigation: navigationHr,
        table: tableHr,
        actions: actionsHr,
        settings: settingsHr,
      },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    supportedLngs: SUPPORTED_LOCALES,
    fallbackLng: Locale.EN,
    ns: ['common', 'navigation', 'table', 'actions', 'settings'],
    defaultNS,
  });

export default i18n;
