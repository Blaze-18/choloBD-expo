import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../providers/LanguageProvider';
import { Feather } from '@expo/vector-icons';
import SuggestedTourCard from './SuggestedTourCard';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useFetchTourSpots, TourSpot } from '../../hooks/useFetchTourSpots';

export default function SuggestedToursSection() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { spots, isLoading, error } = useFetchTourSpots({ isPopular: true });

  const handleTourPress = (spot: TourSpot) => {
    router.push({
      pathname: '/(tabs)/explore/tour-spots-detail',
      params: { id: spot.id },
    });
  };

  const handleSeeAll = () => {
    router.push('/(tabs)/explore/tour-spots-list');
  };

  return (
    <View className="px-4 pt-8 pb-4 bg-white dark:bg-neutral-950">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="flex-1 text-2xl font-bold text-neutral-900 dark:text-white">
            {t(TRANSLATION_KEYS.HOME.SUGGESTED_TOURS)}
          </Text>
          <Text className="flex-1 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {t(TRANSLATION_KEYS.HOME.SUGGESTED_TOURS_DESC)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSeeAll}
          className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20"
        >
          <Feather name="arrow-right" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            Loading tour spots...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View className="items-center justify-center py-8">
          <Feather name="alert-circle" size={32} color={theme.colors.error} />
          <Text className="mt-4 text-sm text-center text-neutral-600 dark:text-neutral-400">
            {error}
          </Text>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && !error && spots.length === 0 && (
        <View className="items-center justify-center py-8">
          <Feather name="map-pin" size={32} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            No popular tour spots available
          </Text>
        </View>
      )}

      {/* Tours Carousel */}
      {!isLoading && !error && spots.length > 0 && (
        <View className="py-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {spots.slice(0, 6).map((spot) => (
              <SuggestedTourCard
                key={spot.id}
                spot={spot}
                onPress={() => handleTourPress(spot)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
