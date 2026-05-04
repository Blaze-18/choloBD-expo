/**
 * Hotels Tab Component
 * Display hotel bookings, link bookings to segments, and show available hotels
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { TripPlan } from '../../../types/trips';
import { useFetchLocationHotels } from '../../../hooks/useFetchLocationHotels';
import { useFetchUserHotelBookings } from '../../../hooks/useFetchUserHotelBookings';
import { useTripPlannerLogic } from '../../../hooks/useTripPlannerLogic';
import { LinkHotelModal } from '../modals/LinkHotelModal';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';

interface HotelsTabProps {
  trip: TripPlan;
}

export function HotelsTab({ trip }: HotelsTabProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const { hotels, loading: hotelsLoading, fetchHotelsForLocation } = useFetchLocationHotels();
  const { bookings, loading: bookingsLoading } = useFetchUserHotelBookings(trip);
  const { updateSegment, isFormSubmitting } = useTripPlannerLogic();

  // Modal state for linking hotel
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [selectedBookingForLink, setSelectedBookingForLink] = useState<any>(null);
  const [isLinking, setIsLinking] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const hotelCount = trip.userSegments?.filter((s) => s.hotelRoomBookingId).length || 0;
  const hotelSegments = trip.userSegments?.filter((s) => s.hotelDetails) || [];

  // Fetch available hotels for the trip location
  useEffect(() => {
    if (trip.primaryLocationId) {
      fetchHotelsForLocation(trip.primaryLocationId);
    }
  }, [trip.primaryLocationId]);

  const handleCompleteBooking = () => {
    console.log('[HotelsTab] Navigating to hotel search for location:', trip.primaryLocation?.name);
    router.push('/(tabs)/explore/hotel-search');
  };

  const handleHotelPress = (hotelId: string) => {
    console.log('[HotelsTab] Navigating to hotel search for location:', trip.primaryLocation?.name);
    // Navigate to hotel search/browse page
    router.push('/(tabs)/explore/hotel-search');
  };

  const handleLinkBooking = (booking: any) => {
    console.log('[HotelsTab] Opening link modal for booking:', booking.id);
    setSelectedBookingForLink(booking);
    setLinkModalVisible(true);
  };

  const handleConfirmLink = async (dayNumber: number) => {
    if (!selectedBookingForLink) return;

    try {
      setIsLinking(true);
      console.log('[HotelsTab] Linking booking', selectedBookingForLink.id, 'to day', dayNumber);

      // Find or create a segment for this day
      let targetSegment = trip.userSegments?.find((s) => s.dayNumber === dayNumber);

      if (targetSegment) {
        // Update existing segment with hotel booking ID
        await updateSegment(trip.id, targetSegment.id, {
          hotelRoomBookingId: selectedBookingForLink.id,
        });
        Alert.alert(t(TRANSLATION_KEYS.COMMON.SUCCESS), t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_LINKED_TO_DAY, { day: dayNumber }));
      } else {
        Alert.alert(t(TRANSLATION_KEYS.COMMON.ERROR), t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_LINK_ERROR, { day: dayNumber }));
      }

      setLinkModalVisible(false);
      setSelectedBookingForLink(null);
    } catch (error: any) {
      console.error('[HotelsTab] Error linking booking:', error);
      Alert.alert(t(TRANSLATION_KEYS.COMMON.ERROR), error?.message || 'Failed to link hotel booking');
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* BOOKED HOTELS SECTION */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-text dark:text-text-dark mb-4">
          <Feather name="home" size={16} color={primaryColor} /> {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_BOOKED_TITLE, { count: hotelCount })}
        </Text>

        {hotelCount > 0 ? (
          <View>
            {hotelSegments.map((segment) => (
              <View
                key={segment.id}
                className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-3 border border-border dark:border-border-dark"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: successColor,
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Feather name="check-circle" size={14} color={successColor} />
                      <Text className="ml-2 font-semibold text-text dark:text-text-dark">
                        {segment.hotelDetails?.name || 'Hotel Booking'}
                      </Text>
                    </View>
                    <View className="flex-row items-center mb-1">
                      <Feather name="calendar" size={12} color={mutedColor} />
                      <Text className="ml-2 text-xs text-muted dark:text-muted-dark">
                        {t(TRANSLATION_KEYS.TRIP_PLANNER.DAY_PLAN_DAY, { day: segment.dayNumber })}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-text dark:text-text-dark mb-1">
                      ₹{segment.hotelDetails?.cost || 0}
                    </Text>
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          segment.hotelDetails?.bookingStatus === 'CONFIRMED'
                            ? '#DBEAFE'
                            : '#FEF3C7',
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color:
                            segment.hotelDetails?.bookingStatus === 'CONFIRMED'
                              ? primaryColor
                              : '#F59E0B',
                        }}
                      >
                        {segment.hotelDetails?.bookingStatus || 'PENDING'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-4 items-center border border-dashed" style={{ borderColor }}>
            <Feather name="info" size={20} color={mutedColor} />
            <Text className="text-sm text-muted dark:text-muted-dark mt-2">
              {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_NO_BOOKINGS, { location: trip.primaryLocation?.name })}
            </Text>
          </View>
        )}

        {/* Complete Booking Button */}
        <TouchableOpacity
          onPress={handleCompleteBooking}
          className="flex-row items-center justify-center py-3 rounded-lg mt-2"
          style={{ backgroundColor: primaryColor }}
        >
          <Feather name="plus" size={16} color="white" />
          <Text className="ml-2 font-semibold text-white">{t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_COMPLETE_BOOKING)}</Text>
        </TouchableOpacity>
      </View>

      {/* YOUR EXISTING BOOKINGS SECTION - NEW */}
      {bookings.length > 0 && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-text dark:text-text-dark mb-4">
            <Feather name="inbox" size={16} color={primaryColor} /> {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_EXISTING_BOOKINGS)}
          </Text>

          {bookingsLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : (
            <View>
              {bookings.map((booking) => (
                <View
                  key={booking.id}
                  className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-3 border border-border dark:border-border-dark"
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <Feather name="bookmark" size={14} color={primaryColor} />
                        <Text className="ml-2 font-semibold text-text dark:text-text-dark flex-1">
                          {booking.hotelName}
                        </Text>
                      </View>
                      <View className="flex-row items-center mb-1">
                        <Feather name="calendar" size={12} color={mutedColor} />
                        <Text className="ml-2 text-xs text-muted dark:text-muted-dark">
                          {booking.dateRange}
                        </Text>
                      </View>
                    </View>
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          booking.status === 'CONFIRMED'
                            ? '#DBEAFE'
                            : booking.status === 'PENDING'
                            ? '#FEF3C7'
                            : '#F3E8FF',
                      }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{
                          color:
                            booking.status === 'CONFIRMED'
                              ? primaryColor
                              : booking.status === 'PENDING'
                              ? '#F59E0B'
                              : '#A855F7',
                        }}
                      >
                        {booking.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-text dark:text-text-dark">
                      ₹{booking.totalPrice}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleLinkBooking(booking)}
                      className="flex-row items-center px-4 py-2 rounded-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Feather name="link" size={14} color="white" />
                      <Text className="ml-2 text-sm font-semibold text-white">{t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_LINK_BTN)}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* AVAILABLE HOTELS SECTION */}
      {hotels.length > 0 && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-text dark:text-text-dark mb-4">
            <Feather name="map-pin" size={16} color={primaryColor} /> {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_AVAILABLE_TITLE)}
          </Text>

          {hotelsLoading ? (
            <View className="items-center py-6">
              <ActivityIndicator size="large" color={primaryColor} />
            </View>
          ) : (
            <View>
              {hotels.slice(0, 5).map((hotel: any) => (
                <TouchableOpacity
                  key={hotel.id}
                  onPress={() => handleHotelPress(hotel.id)}
                  className="bg-surface dark:bg-surface-dark rounded-lg p-4 mb-3 border border-border dark:border-border-dark flex-row items-start"
                >
                  {/* Hotel Image Placeholder */}
                  <View
                    className="w-16 h-16 rounded-lg mr-4 items-center justify-center"
                    style={{ backgroundColor: surfaceColor }}
                  >
                    <Feather name="image" size={24} color={mutedColor} />
                  </View>

                  {/* Hotel Details */}
                  <View className="flex-1">
                    <Text className="font-semibold text-text dark:text-text-dark mb-1">
                      {hotel.name}
                    </Text>
                    {hotel.avgRating && (
                      <View className="flex-row items-center mb-1">
                        <Feather name="star" size={12} color={primaryColor} />
                        <Text className="ml-1 text-xs text-muted dark:text-muted-dark">
                          {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_RATING, { rating: hotel.avgRating.toFixed(1) })}
                        </Text>
                      </View>
                    )}
                    <View className="flex-row items-center">
                      <Feather name="arrow-right" size={12} color={primaryColor} />
                      <Text className="ml-1 text-xs font-semibold" style={{ color: primaryColor }}>
                        {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_BOOK_NOW)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {hotels.length > 5 && (
                <TouchableOpacity
                  onPress={handleCompleteBooking}
                  className="py-3 rounded-lg border items-center"
                  style={{ borderColor: primaryColor, borderWidth: 1 }}
                >
                  <Text className="font-semibold" style={{ color: primaryColor }}>
                    {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_VIEW_ALL)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      {/* NO HOTELS MESSAGE */}
      {!hotelsLoading && hotels.length === 0 && hotelCount === 0 && (
        <View className="items-center justify-center py-8">
          <Feather name="home" size={40} color={mutedColor} />
          <Text className="text-muted dark:text-muted-dark mt-3 font-semibold">
            {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_NO_AVAILABLE_TITLE)}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark mt-1 text-center">
            {t(TRANSLATION_KEYS.TRIP_PLANNER.HOTELS_NO_AVAILABLE_SUBTITLE, { location: trip.primaryLocation?.name })}
          </Text>
        </View>
      )}

      {/* LINK HOTEL MODAL */}
      <LinkHotelModal
        visible={linkModalVisible}
        booking={selectedBookingForLink}
        trip={trip}
        onClose={() => {
          setLinkModalVisible(false);
          setSelectedBookingForLink(null);
        }}
        onConfirm={handleConfirmLink}
        isSubmitting={isLinking || isFormSubmitting}
      />
    </ScrollView>
  );
}
