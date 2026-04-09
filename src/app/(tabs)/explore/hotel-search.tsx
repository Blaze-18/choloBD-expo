/**
 * Hotel Search Page
 * Nested page under explore for hotel booking functionality
 */

import React from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useExplore } from './_provider';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { ExploreSearchForm } from '../../../components/forms/exploreSearchForm';

console.log('[HotelSearchPage] Component loaded');

export default function HotelSearchPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { locations, locationsLoading, fetchHotelsByLocation, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } = useExplore();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const inputBgColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;

  const onSearch = (filters: { locationId: string }) => {
    console.log('[HotelSearchPage] Searching for hotels with filters:', filters);
    fetchHotelsByLocation(filters.locationId);
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
            <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">Book a Hotel</Text>
            <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Search and book your perfect stay</Text>
          </View>
        </View>

        <View className="px-6">
          <ExploreSearchForm
            locations={locations}
            loadingLocations={locationsLoading}
            onSearch={onSearch}
          />

          {/* Check-in and Check-out Dates */}
          <View className="mt-4">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">Check-in Date</Text>
            <View className="flex-row items-center border rounded-lg"
              style={{ borderColor: borderColor, backgroundColor: inputBgColor, borderWidth: 1 }}
            >
              <Ionicons name="calendar" size={18} color={mutedColor} style={{ marginLeft: 10 }} />
              <TextInput
                value={checkInDate}
                onChangeText={setCheckInDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={mutedColor}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  color: textColor,
                }}
              />
            </View>
          </View>

          <View className="mt-3">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">Check-out Date</Text>
            <View className="flex-row items-center border rounded-lg"
              style={{ borderColor: borderColor, backgroundColor: inputBgColor, borderWidth: 1 }}
            >
              <Ionicons name="calendar" size={18} color={mutedColor} style={{ marginLeft: 10 }} />
              <TextInput
                value={checkOutDate}
                onChangeText={setCheckOutDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={mutedColor}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  color: textColor,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
