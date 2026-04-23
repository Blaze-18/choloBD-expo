/**
 * Hotel Search Page
 * Nested page under explore for hotel booking functionality
 */

import React from 'react';
import { Alert, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useExplore } from './_provider';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { ExploreSearchForm } from '../../../components/forms/exploreSearchForm';
import { DatePickerInput } from '../../../components/ui/DatePickerInput';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';

export default function HotelSearchPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { locations, locationsLoading, fetchHotelsByLocation, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } = useExplore();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const canSearchHotels = Boolean(checkInDate && checkOutDate);

  const onSearch = (filters: { locationId: string }) => {
    console.log('[HotelSearchPage] Searching for hotels with filters:', filters);
    fetchHotelsByLocation(filters.locationId);
  };

  const handlePreSearchValidationFail = () => {
    Alert.alert(
      t(TRANSLATION_KEYS.COMMON.ERROR),
      t(TRANSLATION_KEYS.EXPLORE.SEARCH_REQUIRES_DATES)
    );
  };

  const handleBack = () => {
    console.log('[HotelSearchPage] Going back to explore');
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View className="flex-row items-center px-6 pb-4">
          <Ionicons
            name="chevron-back"
            size={24}
            color={primaryColor}
            onPress={handleBack}
            style={{ marginRight: 12 }}
          />
          <View className="flex-1">
            <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">{t(TRANSLATION_KEYS.EXPLORE.CARDS.BOOK_HOTEL)}</Text>
            <Text className="mt-2 text-sm text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.EXPLORE.SEARCH_SUBTITLE)}</Text>
          </View>
        </View>

        <View className="px-6">
          <ExploreSearchForm
            locations={locations}
            loadingLocations={locationsLoading}
            onSearch={onSearch}
            canSearch={canSearchHotels}
            onPreSearchValidationFail={handlePreSearchValidationFail}
          />

          {/* Check-in Date Picker */}
          <DatePickerInput
            label={t(TRANSLATION_KEYS.EXPLORE.CHECK_IN_DATE)}
            value={checkInDate}
            onChange={setCheckInDate}
            placeholder="Select check-in date"
          />

          {/* Check-out Date Picker */}
          <DatePickerInput
            label={t(TRANSLATION_KEYS.EXPLORE.CHECK_OUT_DATE)}
            value={checkOutDate}
            onChange={setCheckOutDate}
            placeholder="Select check-out date"
            minDate={checkInDate || undefined}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
