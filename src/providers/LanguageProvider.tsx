import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initI18n } from '../lib/i18n';
import i18next from 'i18next';

type LanguageContextType = {
  currentLanguage: string;
  setLanguage: (lang: string) => Promise<void>;
  isReady: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_KEY = 'app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Initialize i18n and restore persisted language on mount
  useEffect(() => {
    (async () => {
      try {
        // Initialize i18next
        await initI18n();

        // Restore persisted language preference
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
          await i18next.changeLanguage(savedLanguage);
          setCurrentLanguage(savedLanguage);
        } else {
          setCurrentLanguage(i18next.language);
        }
      } catch (error) {
        console.error('Error initializing language provider:', error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setLanguage = async (lang: string) => {
    try {
      if (lang === 'en' || lang === 'bn') {
        await i18next.changeLanguage(lang);
        setCurrentLanguage(lang);
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        isReady,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
