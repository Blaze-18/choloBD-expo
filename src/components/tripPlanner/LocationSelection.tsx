/**
 * Location Selection Window Component
 * First sliding window - Select destination location
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { Location } from '../../types/locations';
import { useFetchLocations } from '../../hooks/useFetchLocations';

export interface LocationSelectionProps {
  onLocationSelected: (location: Location) => void;
  selectedLocation?: Location | null;
}

/**
 * LocationSelection Component
 */
export function LocationSelection({ onLocationSelected, selectedLocation }: LocationSelectionProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { locations, loading: isLoading, refetch } = useFetchLocations();

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_LOCATION_TITLE)}
        </Text>
        <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
          {t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_LOCATION_SUBTITLE)}
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg px-4 py-3">
          <Feather name="search" size={18} color="#475569" />
          <TextInput
            className="flex-1 ml-3 text-base text-text dark:text-text-dark"
            onChangeText={setSearchQuery}
            placeholder={t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_LOCATION_SEARCH)}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Locations List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : locations.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-center text-muted dark:text-muted-dark mb-4">{t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_NO_LOCATIONS)}</Text>
          <TouchableOpacity
            onPress={refetch}
            className="px-6 py-3 bg-primary rounded-lg"
          >
            <Text className="text-onPrimary font-semibold">{t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_LOCATION_RETRY)}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                onPress={() => onLocationSelected(location)}
                className={`p-4 mb-3 rounded-lg border ${
                  selectedLocation?.id === location.id
                    ? 'bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark'
                    : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-lg font-semibold ${
                      selectedLocation?.id === location.id
                        ? 'text-primary dark:text-primary-dark'
                        : 'text-text dark:text-text-dark'
                    }`}
                  >
                    {location.name}
                  </Text>
                  {selectedLocation?.id === location.id && (
                    <Feather name="check-circle" size={24} color="#0066FF" />
                  )}
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="py-8 items-center">
              <Text className="text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_LOCATION_NOT_FOUND)}
              </Text>
            </View>
          )}
          <View className="h-6" />
        </ScrollView>
      )}
    </View>
  );
}

export default LocationSelection;
