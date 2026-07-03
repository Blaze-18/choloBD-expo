import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

const getVariantStyles = (variant: 'primary' | 'secondary' | 'accent', isDark: boolean) => {
  const styles = {
    primary: {
      bg: isDark ? theme.colors['primary-dark'] + '10' : theme.colors.primary + '10',
      border: isDark ? theme.colors['primary-dark'] + '40' : theme.colors.primary + '30',
      icon: isDark ? theme.colors['primary-dark'] : theme.colors.primary,
    },
    secondary: {
      bg: isDark ? theme.colors['secondary-dark'] + '10' : theme.colors.secondary + '10',
      border: isDark ? theme.colors['secondary-dark'] + '40' : theme.colors.secondary + '30',
      icon: isDark ? theme.colors['secondary-dark'] : theme.colors.secondary,
    },
    accent: {
      bg: isDark ? theme.colors['accent-dark'] + '10' : theme.colors.accent + '10',
      border: isDark ? theme.colors['accent-dark'] + '40' : theme.colors.accent + '30',
      icon: isDark ? theme.colors['accent-dark'] : theme.colors.accent,
    },
  };
  return styles[variant];
};

export default function FeatureCard({
  title,
  description,
  icon,
  onPress,
  variant = 'primary',
}: FeatureCardProps) {
  const { isDark } = useTheme();
  const style = getVariantStyles(variant, isDark);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className="rounded-xl p-4" style={{ backgroundColor: style.bg, borderWidth: 1, borderColor: style.border }}>
        {/* Icon */}
        <View className="mb-3">
          <Feather name={icon} size={28} color={style.icon} />
        </View>

        {/* Title */}
        <Text className="text-base font-semibold text-text dark:text-text-dark mb-1">
          {title}
        </Text>

        {/* Description */}
        <Text className="text-sm text-muted dark:text-muted-dark">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
