import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface SuggestedTourCardProps {
  id: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  price: number;
  imageUrl: string;
  onPress?: () => void;
}

export default function SuggestedTourCard({
  id,
  title,
  location,
  duration,
  rating,
  price,
  imageUrl,
  onPress,
}: SuggestedTourCardProps) {
  const { isDark } = useTheme();
  const iconColorGray = isDark ? '#9ca3af' : '#6b7280';
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mr-4"
      style={{ width: 280 }}
    >
      <View className="rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg">
        {/* Image */}
        <View className="h-40 bg-gray-300 dark:bg-neutral-800 relative overflow-hidden">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          
          {/* Price Badge */}
          <View className="absolute top-3 right-3 bg-white dark:bg-neutral-800 rounded-full px-3 py-1 shadow-md">
            <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              ${price}
            </Text>
          </View>

          {/* Rating Badge */}
          <View className="absolute bottom-3 left-3 bg-white dark:bg-neutral-800 rounded-full px-2 py-1 flex-row items-center gap-1 shadow-md">
            <Feather name="star" size={14} color={isDark ? '#fcd34d' : '#fbbf24'} />
            <Text className="text-xs font-semibold text-neutral-900 dark:text-white">
              {rating}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 py-6">
          {/* Title */}
          <Text
            className="text-lg font-bold text-neutral-900 dark:text-white mb-1"
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Location */}
          <View className="flex-row items-center gap-2 mb-3">
            <Feather name="map-pin" size={14} color={iconColorGray} />
            <Text className="text-sm text-neutral-600 dark:text-neutral-400" numberOfLines={1}>
              {location}
            </Text>
          </View>

          {/* Duration */}
          <View className="flex-row items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <View className="flex-row items-center gap-2">
              <Feather name="clock" size={14} color={theme.colors.primary} />
              <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {duration}
              </Text>
            </View>
            <TouchableOpacity className="bg-blue-600 dark:bg-blue-500 rounded-full p-2">
              <Feather name="arrow-right" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
