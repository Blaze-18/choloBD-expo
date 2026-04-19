import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from '../locales/en.json';
import bn from '../locales/bn.json';

const resources = {
  en: { translation: en },
  bn: { translation: bn },
};

let isInitialized = false;

// Initialize i18next
export async function initI18n() {
  // Only initialize once
  if (isInitialized) {
    return i18next;
  }

  // Detect system language
  const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
  const initialLanguage =
    deviceLanguage === 'bn' || deviceLanguage === 'bn-BD' ? 'bn' : 'en';

  await i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    } as any);

  isInitialized = true;
  return i18next;
}

export default i18next;
