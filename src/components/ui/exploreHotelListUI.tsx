import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hotel } from '../../types/hotels';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface ExploreHotelListUIProps {
  hotels: Hotel[];
  loading: boolean;
  onSelectHotel: (hotelId: string) => void;
}

export function ExploreHotelListUI({ hotels, loading, onSelectHotel }: ExploreHotelListUIProps) {
  const { isDark } = useTheme();

  if (loading) {
    return (
      <View className="items-center justify-center py-12">
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text className="mt-2 text-muted dark:text-muted-dark">Loading hotels...</Text>
      </View>
    );
  }

  if (hotels.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="search" size={48} color={isDark ? '#9ca3af' : '#d1d5db'} />
        <Text className="mt-3 text-lg font-semibold text-text dark:text-text-dark">No hotels found</Text>
        <Text className="mt-1 text-sm text-muted dark:text-muted-dark">Try adjusting your search filters</Text>
      </View>
    );
  }

  const getMinPrice = (hotel: Hotel) => {
    if (!hotel.roomTypes || hotel.roomTypes.length === 0) return 'N/A';
    const minPrice = Math.min(...hotel.roomTypes.map((r) => r.pricePerNight));
    return `₹${minPrice}`;
  };

  return (
    <View className="mb-6">
      <Text className="text-lg font-bold font-heading text-text dark:text-text-dark mb-3">
        Found {hotels.length} Hotels
      </Text>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelectHotel(item.id)}
            activeOpacity={0.7}
            className="mb-3 rounded-xl overflow-hidden bg-white dark:bg-surface-dark border border-border dark:border-border-dark shadow"
          >
            <View className="flex-row">
              {/* Image */}
              {item.images && item.images.length > 0 && (
                <Image
                  source={{ uri: item.images[0].url }}
                  className="w-24 h-24 bg-gray-200"
                  resizeMode="cover"
                />
              )}

              {/* Info */}
              <View className="flex-1 p-3 justify-between">
                <View>
                  <Text className="text-base font-bold font-heading text-text dark:text-text-dark">{item.name}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color={isDark ? '#9ca3af' : '#d1d5db'} />
                    <Text className="ml-1 text-xs text-muted dark:text-muted-dark">{item.location?.name}</Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center bg-yellow-50 dark:bg-yellow-950 px-2 py-1 rounded">
                    <Ionicons name="star" size={12} color={isDark ? '#fcd34d' : '#fbbf24'} />
                    <Text className="ml-1 text-xs font-bold text-text dark:text-text-dark">{item.rating}</Text>
                  </View>
                  <Text className="text-sm font-bold text-primary dark:text-primary-dark">
                    {getMinPrice(item)}/night
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
