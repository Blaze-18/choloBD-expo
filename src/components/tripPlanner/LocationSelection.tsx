/**
 * Location Selection Window Component
 * First sliding window - Select destination location
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Location } from '../../types/locations';
import { useFetchLocations } from '../../services/api/locations';

export interface LocationSelectionProps {
  onLocationSelected: (location: Location) => void;
  selectedLocation?: Location | null;
}

/**
 * LocationSelection Component
 */
export function LocationSelection({ onLocationSelected, selectedLocation }: LocationSelectionProps) {
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
          Where to?
        </Text>
        <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
          Select your destination location
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg px-4 py-3">
          <Feather name="search" size={18} color="#475569" />
          <Text
            className="flex-1 ml-3 text-base text-text dark:text-text-dark"
            onChangeText={setSearchQuery}
            placeholder="Search locations..."
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
          <Text className="text-center text-muted dark:text-muted-dark mb-4">No locations available</Text>
          <TouchableOpacity
            onPress={refetch}
            className="px-6 py-3 bg-primary rounded-lg"
          >
            <Text className="text-onPrimary font-semibold">Retry</Text>
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
                No locations found
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
