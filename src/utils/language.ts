/**
 * Language Utilities
 * Helper functions for language-related operations
 */

/**
 * Get display label for a language code
 * @param lang - Language code ('en' or 'bn')
 * @returns Display label
 */
export function getLanguageLabel(lang: string): string {
  switch (lang) {
    case 'bn':
      return 'বাংলা';
    case 'en':
      return 'English';
    default:
      return 'English';
  }
}

/**
 * Check if a language is Bengali
 * @param lang - Language code
 * @returns True if Bengali
 */
export function isBengali(lang: string): boolean {
  return lang === 'bn' || lang === 'bn-BD';
}

/**
 * Check if a language is English
 * @param lang - Language code
 * @returns True if English
 */
export function isEnglish(lang: string): boolean {
  return lang === 'en' || lang === 'en-US';
}

/**
 * Get opposite language code
 * @param lang - Current language code
 * @returns Opposite language code
 */
export function getOppositeLanguage(lang: string): string {
  return isBengali(lang) ? 'en' : 'bn';
}

/**
 * Validate if language code is supported
 * @param lang - Language code to validate
 * @returns True if supported
 */
export function isSupportedLanguage(lang: string): boolean {
  return lang === 'en' || lang === 'bn';
}
