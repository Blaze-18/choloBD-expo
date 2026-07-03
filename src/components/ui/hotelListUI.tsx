import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hotel } from '../../types/hotels';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface HotelListUIProps {
  hotels: Hotel[];
  loading: boolean;
  onSelectHotel: (hotelId: string) => void;
  /** Show hotel image thumbnail and price — enables the rich card style */
  showImages?: boolean;
  showPrice?: boolean;
}

export function HotelListUI({
  hotels,
  loading,
  onSelectHotel,
  showImages = false,
  showPrice = false,
}: HotelListUIProps) {
  const { isDark } = useTheme();
  const starColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const { t } = useTranslation();

  if (loading) {
    return (
      <View className="items-center justify-center py-12">
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {showImages && (
          <Text className="mt-2 text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.COMMON.LOADING)}</Text>
        )}
      </View>
    );
  }

  if (hotels.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="search" size={48} color={isDark ? '#9ca3af' : '#d1d5db'} />
        <Text className="mt-3 text-lg font-semibold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.EXPLORE.NO_HOTELS)}
        </Text>
        {showImages && (
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.COMMON.TRY_AGAIN)}
          </Text>
        )}
      </View>
    );
  }

  const getMinPrice = (hotel: Hotel): string | null => {
    if (!hotel.roomTypes || hotel.roomTypes.length === 0) return null;
    const min = Math.min(...hotel.roomTypes.map((r) => r.pricePerNight));
    return `₹${min}`;
  };

  return (
    <View className={showImages ? 'mb-6' : 'mt-4'}>
      {showImages && (
        <Text className="mb-3 text-lg font-bold font-heading text-text dark:text-text-dark">
          {`${hotels.length} ${t(TRANSLATION_KEYS.EXPLORE.TITLE)}`}
        </Text>
      )}
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) =>
          showImages ? (
            <TouchableOpacity
              onPress={() => onSelectHotel(item.id)}
              activeOpacity={0.7}
              className="mb-3 overflow-hidden bg-white border shadow rounded-xl dark:bg-surface-dark border-border dark:border-border-dark"
            >
              <View className="flex-row">
                {item.images && item.images.length > 0 && (
                  <Image
                    source={{ uri: item.images[0].url }}
                    className="w-24 h-24 bg-gray-200"
                    resizeMode="cover"
                  />
                )}
                <View className="justify-between flex-1 p-3">
                  <View>
                    <Text className="text-base font-bold font-heading text-text dark:text-text-dark">
                      {item.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location" size={14} color={isDark ? '#9ca3af' : '#d1d5db'} />
                      <Text className="ml-1 text-xs text-muted dark:text-muted-dark">
                        {item.location?.name}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center px-2 py-1 rounded\" style={{ backgroundColor: isDark ? theme.colors['warning-dark'] + '20' : theme.colors.warning + '20' }}>
                      <Ionicons name="star" size={12} color={starColor} />
                      <Text className="ml-1 text-xs font-bold text-text dark:text-text-dark">
                        {item.rating}
                      </Text>
                    </View>
                    {showPrice && getMinPrice(item) && (
                      <Text className="text-sm font-bold text-primary dark:text-primary-dark">
                        {getMinPrice(item)} {t(TRANSLATION_KEYS.BOOKING.PER_NIGHT)}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onSelectHotel(item.id)}
              className="p-4 mb-3 bg-white border shadow rounded-xl dark:bg-surface-dark border-border dark:border-border-dark active:opacity-75"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-text dark:text-text-dark">
                    {item.name}
                  </Text>
                  <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
                    {item.location?.name || 'Location unknown'}
                  </Text>
                </View>
                <View className="items-center">
                  {item.rating ? (
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color={starColor} />
                      <Text className="ml-1 font-semibold text-text dark:text-text-dark">
                        {item.rating}
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-muted">—</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
}


