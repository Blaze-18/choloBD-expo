import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useLanguageSwitcher } from '../../hooks/useLanguageSwitcher';
import { getLanguageLabel, getOppositeLanguage } from '../../utils/language';

interface LanguageToggleProps {
  textColor?: string;
  isDark?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Language Toggle Component
 * Provides a switch to toggle between English and Bengali
 * with visual feedback and language label display
 */
export default function LanguageToggle({
  textColor = '#000',
  isDark = false,
  size = 'medium',
}: LanguageToggleProps) {
  const { currentLanguage, toggleLanguage } = useLanguageSwitcher();

  const containerStyles = {
    small: 'flex-row items-center gap-1',
    medium: 'flex-row items-center gap-2',
    large: 'flex-row items-center gap-3',
  };

  const textStyles = {
    small: 'text-xs font-medium',
    medium: 'text-sm font-medium',
    large: 'text-base font-semibold',
  };

  const currentLangLabel = getLanguageLabel(currentLanguage);
  const targetLangLabel = getLanguageLabel(getOppositeLanguage(currentLanguage));

  return (
    <View className={containerStyles[size]}>
      <View className="flex-row items-center">
        <Text 
          style={{ color: textColor }} 
          className={`${textStyles[size]} font-bold`}
        >
          {currentLangLabel}
        </Text>
        <Text 
          style={{ color: textColor, opacity: 0.6 }} 
          className={`${textStyles[size]} mx-1`}
        >
          →
        </Text>
        <Text 
          style={{ color: textColor, opacity: 0.5 }} 
          className={textStyles[size]}
        >
          {targetLangLabel}
        </Text>
      </View>
      <Switch
        value={currentLanguage === 'bn'}
        onValueChange={toggleLanguage}
        trackColor={{ false: '#767577', true: '#2196F3' }} // Blue when ON
        thumbColor={currentLanguage === 'bn' ? '#1976D2' : '#f4f3f4'} // Darker blue thumb
        testID="language-toggle-switch"
      />
    </View>
  );
}
