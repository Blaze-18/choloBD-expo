import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

export default function HeroBackground() {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Hero image with ocean/travel theme
  const heroImageUrl = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop';

  const textColor = isDark ? theme.colors['text-dark'] : '#fff';
  const mutedTextColor = isDark ? 'rgba(240, 244, 248, 0.75)' : 'rgba(255, 255, 255, 0.85)';

  return (
    <View className="relative overflow-hidden bg-gray-800 dark:bg-gray-900" style={{ height: 240 }}>
      {/* Background Image */}
      <Image
        source={{ uri: heroImageUrl }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />

      {/* Gradient Overlay - bottom-heavy so image stays visible at top, text readable at bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.42)', 'rgba(0, 0, 0, 0.78)']}
        start={{ x: 0, y: 0.15 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Content Overlay */}
      <View className="absolute inset-0 flex-col justify-end px-6 pb-6">
        {/* Main Hook - Large, Bold */}
        <Text
          className="text-3xl font-bold leading-tight mb-2"
          style={{ color: textColor }}
        >
          {t(TRANSLATION_KEYS.HOME.TAGLINE)}
        </Text>

        {/* Supporting Message - Smaller, Lighter */}
        <Text
          className="text-xs leading-4"
          style={{ color: mutedTextColor, fontWeight: '300' }}
        >
          {t(TRANSLATION_KEYS.HOME.TAGLINE_SUBTITLE)}
        </Text>
      </View>
    </View>
  );
}
