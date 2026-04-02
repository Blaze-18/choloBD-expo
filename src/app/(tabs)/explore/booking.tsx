import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { RoomTypeSelectorUI } from '../../../components/ui/roomTypeSelectorUI';
import { HotelBookingForm } from '../../../components/forms/hotelBookingForm';
import { useExplore } from './_provider';
import { differenceInCalendarDays, parseISO } from 'date-fns';

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

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-background-dark"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: (insets.bottom || 0) + 24 }}
      >
        <View className="px-6 pt-4 pb-4">
          <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">Complete Booking</Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{hotelDetail.name}</Text>
        </View>

        <View className="px-6 pb-6">
          <View className="mb-6">
            <RoomTypeSelectorUI roomTypes={hotelDetail.roomTypes || []} selectedRoomsMap={selectedRoomsMap} onChange={changeRoomQty} />
          </View>

          {/* Estimated Total */}
          <View className="p-4 mb-4 bg-white border rounded-lg dark:bg-surface-dark border-border dark:border-border-dark">
            <Text className="font-medium text-text dark:text-text-dark">Estimate</Text>
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
                  <View>
                    <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Nights: {nights}</Text>
                    <Text className="mt-1 text-lg font-bold text-text dark:text-text-dark">Estimated Total: ₹{subtotal}</Text>
                  </View>
                );
              })()
            ) : (
              <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Enter check-in and check-out dates to see estimate</Text>
            )}
          </View>

          <HotelBookingForm
            checkInDate={checkInDate}
            setCheckInDate={() => {}}
            checkOutDate={checkOutDate}
            setCheckOutDate={() => {}}
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

          <View className="mt-4">
            <Text onPress={clearAllAndGoToSearch} className="font-semibold text-primary dark:text-primary-dark">Clear Search</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
