import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HotelDetail } from '../../types/hotels';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface ExploreHotelDetailUIProps {
  hotel: HotelDetail | null;
  onBack: () => void;
  onBackToSearch?: () => void;
  onBooking: () => void;
  loading?: boolean;
}

export function ExploreHotelDetailUI({ hotel, onBack, onBackToSearch, onBooking, loading = false }: ExploreHotelDetailUIProps) {
  const { isDark } = useTheme();

  if (!hotel) return null;

  const minPrice =
    hotel.roomTypes && hotel.roomTypes.length > 0
      ? Math.min(...hotel.roomTypes.map((r) => r.pricePerNight))
      : 0;

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  return (
    <View className="flex-1">
      {/* Back Button Header */}
      <View className="px-6 pt-4 pb-2 bg-white border-b dark:bg-surface-dark border-border dark:border-border-dark">
        <TouchableOpacity onPress={onBack} className="flex-row items-center mb-3">
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
          <Text className="ml-2 font-semibold text-primary dark:text-primary-dark">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 bg-background dark:bg-background-dark">
        {/* Hero Image */}
        {hotel.images && hotel.images.length > 0 && (
          <Image
            source={{ uri: hotel.images[0].url }}
            className="w-full h-64 bg-gray-200"
            resizeMode="cover"
          />
        )}

        {/* Hotel Info */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">{hotel.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color={mutedColor} />
                <Text className="ml-1 text-sm text-muted dark:text-muted-dark">{hotel.location?.name}</Text>
              </View>
            </View>
            <View className="items-center">
              <View className="flex-row items-center px-3 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <Ionicons name="star" size={18} color={isDark ? '#fcd34d' : '#fbbf24'} />
                <Text className="ml-1 font-bold text-text dark:text-text-dark">{hotel.rating}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text className="mt-4 text-base leading-6 text-text dark:text-text-dark">{hotel.description}</Text>

          {/* Check-in/Check-out Times */}
          {(hotel.checkInTime || hotel.checkOutTime) && (
            <View className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <View className="flex-row justify-between">
                {hotel.checkInTime && (
                  <View>
                    <Text className="text-sm text-muted dark:text-muted-dark">Check-in</Text>
                    <Text className="font-semibold text-text dark:text-text-dark">{hotel.checkInTime}</Text>
                  </View>
                )}
                {hotel.checkOutTime && (
                  <View>
                    <Text className="text-sm text-muted dark:text-muted-dark">Check-out</Text>
                    <Text className="font-semibold text-text dark:text-text-dark">{hotel.checkOutTime}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Room Types Preview */}
          {hotel.roomTypes && hotel.roomTypes.length > 0 && (
            <View className="mt-6">
              <Text className="mb-3 text-lg font-bold font-heading text-text dark:text-text-dark">Available Rooms</Text>
              {hotel.roomTypes.slice(0, 3).map((room) => (
                <View
                  key={room.id}
                  className="flex-row items-center justify-between p-4 mb-3 bg-white border rounded-lg dark:bg-surface-dark border-border dark:border-border-dark"
                >
                  <View className="flex-1">
                    <Text className="font-semibold text-text dark:text-text-dark">{room.roomType}</Text>
                    <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
                      {room.singleBedCount ? `${room.singleBedCount}S` : ''} {room.doubleBedCount ? `${room.doubleBedCount}D` : ''}
                    </Text>
                    <Text className="mt-1 text-xs text-muted dark:text-muted-dark">
                      {room.availableCount} available
                    </Text>
                  </View>
                  <View>
                    <Text className="font-bold text-primary dark:text-primary-dark">₹{room.pricePerNight}</Text>
                    <Text className="text-xs text-muted dark:text-muted-dark">per night</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Amenities */}
          {hotel.amenities && hotel.amenities.length > 0 && (
            <View className="mt-6">
              <Text className="mb-3 text-lg font-bold font-heading text-text dark:text-text-dark">Amenities</Text>
              <View className="flex-row flex-wrap gap-2">
                {hotel.amenities.map((amenity, idx) => (
                  <View
                    key={idx}
                    className="px-3 py-2 border rounded-full bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/40"
                  >
                    <Text className="text-xs font-medium text-primary dark:text-primary-dark">{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Contact */}
          {(hotel.phoneNumber || hotel.email) && (
            <View className="p-4 mt-6 rounded-lg bg-gray-50 dark:bg-gray-900">
              {hotel.phoneNumber && (
                <View className="flex-row items-center mb-2">
                  <Ionicons name="call" size={16} color={primaryColor} />
                  <Text className="ml-2 text-text dark:text-text-dark">{hotel.phoneNumber}</Text>
                </View>
              )}
              {hotel.email && (
                <View className="flex-row items-center">
                  <Ionicons name="mail" size={16} color={primaryColor} />
                  <Text className="ml-2 text-text dark:text-text-dark">{hotel.email}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Booking Button */}
      <View className="px-6 pt-4 pb-6 bg-white border-t dark:bg-surface-dark border-border dark:border-border-dark">
        <TouchableOpacity
          onPress={onBooking}
          disabled={loading}
          style={{
            backgroundColor: loading ? (isDark ? '#4b5563' : '#d1d5db') : successColor,
            borderRadius: 8,
            paddingVertical: 16,
            paddingHorizontal: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="bed" size={20} color={onPrimaryColor} style={{ marginRight: 8 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: onPrimaryColor }}>Book Hotel (from ₹{minPrice})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
