import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import TourPackageCard from './TourPackageCard';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { useFetchTourPackages } from '../../hooks/useFetchTourPackages';
import { TourPackage } from '../../types/tours';

export default function TourPackagesSection() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { packages, isLoading, error } = useFetchTourPackages({ isActive: true, isPopular: true });

  const handlePackagePress = (pkg: TourPackage) => {
    router.push({
      pathname: '/tour-package-detail',
      params: { id: pkg.id },
    });
  };

  const handleSeeAll = () => {
    router.push('/(tabs)/explore/tour-list');
  };

  return (
    <View className="px-4 pt-8 pb-4 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
            {t(TRANSLATION_KEYS.HOME.TOUR_PACKAGES)}
          </Text>
          <Text className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            {t(TRANSLATION_KEYS.HOME.TOUR_PACKAGES_DESC)}
          </Text>
        </View>
        {!isLoading && !error && packages.length > 0 && (
          <TouchableOpacity onPress={handleSeeAll} className="ml-4">
            <Text style={{ color: isDark ? theme.colors['primary-dark'] : theme.colors.primary, fontSize: 14, fontWeight: '600' }}>
              {t(TRANSLATION_KEYS.HOME.SEE_ALL_PACKAGES)}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            {t(TRANSLATION_KEYS.COMMON.LOADING)}
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
      {!isLoading && !error && packages.length === 0 && (
        <View className="items-center justify-center py-8">
          <Feather name="package" size={32} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            No packages available right now
          </Text>
        </View>
      )}

      {/* Packages Carousel */}
      {!isLoading && !error && packages.length > 0 && (
        <View className="py-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {packages.slice(0, 6).map((pkg) => (
              <TourPackageCard
                key={pkg.id}
                tourPackage={pkg}
                onPress={() => handlePackagePress(pkg)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
