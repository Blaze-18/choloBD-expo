import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
}

const variantStyles = {
  primary: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border border-blue-200 dark:border-blue-800',
    icon: '#0066FF',
  },
  secondary: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border border-purple-200 dark:border-purple-800',
    icon: '#7C3AED',
  },
  accent: {
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    border: 'border border-cyan-200 dark:border-cyan-800',
    icon: '#06B6D4',
  },
};

export default function FeatureCard({
  title,
  description,
  icon,
  onPress,
  variant = 'primary',
}: FeatureCardProps) {
  const style = variantStyles[variant];

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View className={`${style.bg} ${style.border} rounded-xl p-4`}>
        {/* Icon */}
        <View className="mb-3">
          <Feather name={icon} size={28} color={style.icon} />
        </View>

        {/* Title */}
        <Text className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
          {title}
        </Text>

        {/* Description */}
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
