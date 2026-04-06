import React from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { ExploreSearchForm } from '../../../components/forms/exploreSearchForm';
import { useExplore } from './_provider';

export default function ExploreIndex() {
  const { locations, locationsLoading, fetchHotelsByLocation, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate } = useExplore();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const onSearch = (filters: { locationId: string }) => {
    fetchHotelsByLocation(filters.locationId);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6 }}>
        <View className="px-6 pt-4 pb-4">
          <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">Explore Hotels</Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Search and book your perfect stay</Text>
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
            <View className="flex-row items-center border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
              <Ionicons name="calendar" size={18} color="#666" style={{ marginLeft: 10 }} />
              <TextInput
                value={checkInDate}
                onChangeText={setCheckInDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                className="flex-1 p-3 text-text dark:text-text-dark"
              />
            </View>
          </View>

          <View className="mt-3">
            <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">Check-out Date</Text>
            <View className="flex-row items-center border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark">
              <Ionicons name="calendar" size={18} color="#666" style={{ marginLeft: 10 }} />
              <TextInput
                value={checkOutDate}
                onChangeText={setCheckOutDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                className="flex-1 p-3 text-text dark:text-text-dark"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
