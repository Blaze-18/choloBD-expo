import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import RoomTypeSelectorUI from '@/components/ui/roomTypeSelectorUI';
import { HotelBookingForm } from '../../../components/forms/hotelBookingForm';
import { useExplore } from './_provider';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';

export default function ExploreBooking() {
  const {
    hotelDetail,
    selectedRoomsMap,
    changeRoomQty,
    checkInDate,
    checkOutDate,
    guestName,
    guestEmail,
    guestPhoneNumber,
    paymentMethod,
    specialRequests,
    setCheckInDate,
    setCheckOutDate,
    setGuestName,
    setGuestEmail,
    setGuestPhoneNumber,
    setPaymentMethod,
    setSpecialRequests,
    submitBooking,
    submitting,
    clearAllAndGoToSearch,
  } = useExplore();

  if (!hotelDetail) return null;

  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4 pb-4">
          <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">{t(TRANSLATION_KEYS.BOOKING.COMPLETE_BOOKING)}</Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{hotelDetail.name}</Text>
        </View>

        <View className="px-6 pb-6">
          <View className="mb-6">
            <RoomTypeSelectorUI roomTypes={hotelDetail.roomTypes || []} selectedRoomsMap={selectedRoomsMap} onChange={changeRoomQty} />
          </View>

          {/* Estimated Total */}
          <View className="p-4 mb-4 bg-white border rounded-xl dark:bg-surface-dark border-primary/20 dark:border-primary-dark/40">
            <Text className="text-xs font-semibold tracking-wide uppercase text-primary dark:text-primary-dark">
              {t(TRANSLATION_KEYS.BOOKING.ESTIMATED_TOTAL)}
            </Text>
            {checkInDate && checkOutDate ? (
              (() => {
                let nights = 0;
                try {
                  const start = parseISO(checkInDate);
                  const end = parseISO(checkOutDate);
                  nights = Math.max(0, differenceInCalendarDays(end, start));
                } catch (e) {
                  nights = 0;
                }

                const subtotal = (hotelDetail.roomTypes || []).reduce((acc: number, rt: any) => {
                  const qty = selectedRoomsMap[rt.id] || 0;
                  const price = rt.pricePerNight ?? 0;
                  return acc + qty * price * nights;
                }, 0);

                return (
                  <View className="mt-2">
                    <View className="self-start px-3 py-1 rounded-full bg-primary/10 dark:bg-primary-dark/20">
                      <Text className="text-xs font-semibold text-primary dark:text-primary-dark">{t(TRANSLATION_KEYS.BOOKING.NIGHTS)}: {nights}</Text>
                    </View>
                    <Text className="mt-3 text-3xl font-bold font-heading text-text dark:text-text-dark">₹{subtotal}</Text>
                    <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.BOOKING.ESTIMATED_TOTAL)}</Text>
                  </View>
                );
              })()
            ) : (
              <Text className="mt-2 text-sm text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.BOOKING.ENTER_DATES)}</Text>
            )}
          </View>

          <HotelBookingForm
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            guestName={guestName}
            setGuestName={setGuestName}
            guestEmail={guestEmail}
            setGuestEmail={setGuestEmail}
            guestPhoneNumber={guestPhoneNumber}
            setGuestPhoneNumber={setGuestPhoneNumber}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            specialRequests={specialRequests}
            setSpecialRequests={setSpecialRequests}
            submitting={submitting}
            onSubmit={submitBooking}
          />

          <View className="mt-4" style={{ paddingBottom: Math.max(8, insets.bottom) }}>
            <TouchableOpacity
              onPress={clearAllAndGoToSearch}
              className="flex-row items-center justify-center p-3 border rounded-xl border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            >
              <Ionicons name="close-circle-outline" size={18} color={primaryColor} style={{ marginRight: 8 }} />
              <Text className="font-semibold text-primary dark:text-primary-dark">{t(TRANSLATION_KEYS.BOOKING.CLEAR_SEARCH)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
