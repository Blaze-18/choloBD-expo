/**
 * Spots/Activities Selection Window Component
 * Third sliding window - Select destinations and activities
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as tourBuilder from '../../services/api/tourBuilder';

export interface Spot {
  id: string;
  name: string;
  type: 'TOUR_SPOT' | 'ACTIVITY';
  description?: string;
}

export interface SpotsSelectionProps {
  locationId: string;
  onSpotsSelected: (spots: Spot[]) => void;
  selectedSpots?: Spot[];
}

/**
 * SpotsSelection Component
 */
export function SpotsSelection({
  locationId,
  onSpotsSelected,
  selectedSpots = [],
}: SpotsSelectionProps) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Spot[]>(selectedSpots);

  useEffect(() => {
    loadSpots();
  }, [locationId]);

  const loadSpots = async () => {
    try {
      setIsLoading(true);
      console.log('[SpotsSelection] Fetching tour spots for location:', locationId);
      // Fetch tour spots from backend filtered by location
      const tourSpots = await tourBuilder.getTourSpots(locationId);
      // Convert tour spots to spot format
      const spotData: Spot[] = tourSpots.map((spot) => ({
        id: spot.id,
        name: spot.name,
        type: 'TOUR_SPOT' as const,
        description: spot.location,
      }));
      console.log('[SpotsSelection] Loaded', spotData.length, 'tour spots');
      setSpots(spotData);
    } catch (err) {
      console.error('[SpotsSelection] Error loading spots:', err);
      // If API fails, show empty state
      setSpots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpot = (spot: Spot) => {
    setSelected((prev) => {
      const isSelected = prev.some((s) => s.id === spot.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== spot.id);
      } else {
        return [...prev, spot];
      }
    });
  };

  const filteredSpots = spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    onSpotsSelected(selected);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
          What to explore?
        </Text>
        <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
          Select spots and activities you want to visit
        </Text>
      </View>

      {/* Search Input */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center px-4 py-3 border rounded-lg bg-surface dark:bg-surface-dark border-border dark:border-border-dark">
          <Feather name="search" size={18} color="#475569" />
          <TextInput
            className="flex-1 ml-3 text-base text-text dark:text-text-dark"
            onChangeText={setSearchQuery}
            placeholder="Search spots..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Spots List */}
      {isLoading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      ) : spots.length === 0 ? (
        <View className="items-center justify-center flex-1 px-6">
          <Text className="mb-4 text-center text-muted dark:text-muted-dark">No spots available for this location</Text>
          <TouchableOpacity
            onPress={loadSpots}
            className="px-6 py-3 mt-4 rounded-lg bg-primary"
          >
            <Text className="font-semibold text-onPrimary">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {filteredSpots.length > 0 ? (
            filteredSpots.map((spot) => {
              const isSelected = selected.some((s) => s.id === spot.id);
              return (
                <TouchableOpacity
                  key={spot.id}
                  onPress={() => toggleSpot(spot)}
                  className={`p-4 mb-3 rounded-lg border flex-row items-start ${
                    isSelected
                      ? 'bg-primary/10 dark:bg-primary-dark/10 border-primary dark:border-primary-dark'
                      : 'bg-surface dark:bg-surface-dark border-border dark:border-border-dark'
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-base font-semibold ${
                        isSelected
                          ? 'text-primary dark:text-primary-dark'
                          : 'text-text dark:text-text-dark'
                      }`}
                    >
                      {spot.name}
                    </Text>
                    {spot.description && (
                      <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
                        {spot.description}
                      </Text>
                    )}
                    <View className="flex-row items-center mt-2">
                      <View className="px-2 py-1 rounded bg-surface-2 dark:bg-surface-2-dark">
                        <Text className="text-xs font-medium text-muted dark:text-muted-dark">
                          {spot.type === 'TOUR_SPOT' ? '📍 Spot' : '🎯 Activity'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="ml-3">
                    {isSelected ? (
                      <Feather name="check-circle" size={24} color="#0066FF" />
                    ) : (
                      <Feather name="circle" size={24} color="#E6E9EE" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="items-center py-8">
              <Text className="text-muted dark:text-muted-dark">No spots found</Text>
            </View>
          )}
          <View className="h-6" />
        </ScrollView>
      )}

      {/* Footer */}
      <View className="px-6 pb-6 border-t border-border dark:border-border-dark">
        <View className="mt-4">
          <Text className="mb-2 text-sm text-muted dark:text-muted-dark">
            Selected: {selected.length}
          </Text>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={selected.length === 0}
            className={`rounded-lg py-4 items-center ${
              selected.length > 0 ? 'bg-primary' : 'bg-border dark:bg-border-dark'
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                selected.length > 0 ? 'text-onPrimary' : 'text-muted dark:text-muted-dark'
              }`}
            >
              Create Trip Plan
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SpotsSelection;
