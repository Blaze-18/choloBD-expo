import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface Hotel {
  id: string;
  name: string;
  rating?: number;
  location?: { name: string };
}

interface HotelListUIProps {
  hotels: Hotel[];
  loading: boolean;
  onSelectHotel: (hotelId: string) => void;
}

export function HotelListUI({ hotels, loading, onSelectHotel }: HotelListUIProps) {
  const { isDark } = useTheme();

  if (loading) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="mt-4">
      {hotels.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Text className="text-muted dark:text-muted-dark">No hotels found</Text>
        </View>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectHotel(item.id)}
              className="p-4 mb-3 rounded-xl shadow bg-white dark:bg-surface-dark border border-border dark:border-border-dark active:opacity-75"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-text dark:text-text-dark">{item.name}</Text>
                  <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{item.location?.name || 'Location unknown'}</Text>
                </View>
                <View className="items-center">
                  {item.rating ? (
                    <>{isDark ? '#fcd34d' : '#fbbf24'}
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={16} color={isDark ? '#fcd34d' : '#fbbf24'} />
                        <Text className="ml-1 font-semibold text-text dark:text-text-dark">{item.rating}</Text>
                      </View>
                    </>
                  ) : (
                    <Text className="text-muted">—</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
