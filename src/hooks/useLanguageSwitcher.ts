import { useLanguage } from '../providers/LanguageProvider';

/**
 * Hook for language switching functionality
 * Provides convenient methods and state for toggling between languages
 */
export function useLanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  const isBengali = currentLanguage === 'bn';
  const isEnglish = currentLanguage === 'en';

  /**
   * Toggle between English and Bengali
   */
  const toggleLanguage = async () => {
    const newLanguage = isBengali ? 'en' : 'bn';
    await setLanguage(newLanguage);
  };

  /**
   * Set language to Bengali
   */
  const setBengali = async () => {
    if (!isBengali) {
      await setLanguage('bn');
    }
  };

  /**
   * Set language to English
   */
  const setEnglish = async () => {
    if (!isEnglish) {
      await setLanguage('en');
    }
  };

  return {
    currentLanguage,
    isBengali,
    isEnglish,
    toggleLanguage,
    setBengali,
    setEnglish,
    setLanguage,
  };
}
