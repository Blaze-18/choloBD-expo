import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface LocationCardProps {
  id: string;
  title: string;
  type: 'hotel' | 'spot';
  rating: number;
  reviews: number;
  distance: string;
  imageUrl: string;
  onPress?: () => void;
}

const typeStyles = {
  hotel: {
    bg: 'from-purple-400 to-pink-400 dark:from-purple-900 dark:to-pink-900',
    icon: 'home',
    badge: 'Hotel',
    badgeBg: 'bg-pink-600 dark:bg-pink-700',
    iconColor: '#ec4899',
  },
  spot: {
    bg: 'from-amber-400 to-orange-400 dark:from-amber-900 dark:to-orange-900',
    icon: 'compass',
    badge: 'Tour Spot',
    badgeBg: 'bg-orange-600 dark:bg-orange-700',
    iconColor: '#f59e0b',
  },
};

export default function LocationCard({
  id,
  title,
  type,
  rating,
  reviews,
  distance,
  imageUrl,
  onPress,
}: LocationCardProps) {
  const style = typeStyles[type];
  const { isDark } = useTheme();

  const starColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const navIconColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const arrowIconOnPrimary = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-1"
    >
      <View className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg h-64">
        {/* Image */}
        <View className="flex-1 bg-gray-300 dark:bg-neutral-800 relative overflow-hidden">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />

          {/* Badge */}
          <View className={`${style.badgeBg} rounded-full px-3 py-1 absolute top-3 left-3`}>
            <Text className="text-white text-xs font-bold">{style.badge}</Text>
          </View>

          {/* Rating Badge */}
            <View className="absolute bottom-3 right-3 bg-white dark:bg-neutral-800 rounded-lg px-2 py-1 flex-row items-center gap-1 shadow-md">
            <Feather name="star" size={14} color={starColor} />
            <Text className="text-xs font-bold text-neutral-900 dark:text-white">
              {rating}
            </Text>
            <Text className="text-xs text-neutral-600 dark:text-neutral-400">
              ({reviews})
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-4 bg-white dark:bg-neutral-900">
          {/* Title */}
          <Text
            className="text-base font-bold text-neutral-900 dark:text-white mb-2"
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Distance */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Feather name="navigation" size={14} color={navIconColor} />
              <Text className="text-sm" style={{ color: isDark ? theme.colors['muted-dark'] : theme.colors.muted }}>
                {distance}
              </Text>
            </View>
            <TouchableOpacity className="rounded-full p-1.5" style={{ backgroundColor: isDark ? theme.colors['primary-dark'] : theme.colors.primary }}>
              <Feather name="arrow-right" size={12} color={arrowIconOnPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
