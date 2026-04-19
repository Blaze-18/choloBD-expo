import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../providers/LanguageProvider';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

export default function HeroSection() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <View className="bg-white dark:bg-neutral-950 px-6 py-12">
      {/* Main Title */}
      <Text className="text-3xl font-bold text-neutral-900 dark:text-white mb-4 text-center italic flex-1">
        {t(TRANSLATION_KEYS.HOME.HERO_TITLE)}
      </Text>

      {/* Subtitle */}
      <Text className="text-base text-neutral-600 dark:text-neutral-400 text-center leading-6 font-light flex-1">
        {t(TRANSLATION_KEYS.HOME.HERO_SUBTITLE)}
      </Text>
    </View>
  );
}
