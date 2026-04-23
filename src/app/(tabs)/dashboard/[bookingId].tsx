import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBookingLogic } from '../../../hooks/useBookingLogic';
import { useTheme } from '../../../hooks/useTheme';
import theme from '../../../constants/theme';
import { HotelBookingForm } from '../../../components/forms/hotelBookingForm';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';

export default function BookingTrackingPage() {
  const params = useLocalSearchParams();
  const bookingId = params.bookingId as string | undefined;
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCheckInDate, setEditCheckInDate] = useState('');
  const [editCheckOutDate, setEditCheckOutDate] = useState('');
  const [editPaymentMethod, setEditPaymentMethod] = useState('');
  const [editSpecialRequests, setEditSpecialRequests] = useState('');

  const { fetchBookingDetails, editBooking, submitting } = useBookingLogic();

  useEffect(() => {
    if (!bookingId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBookingDetails(bookingId);
        setBooking(res ?? null);
        if (res) {
          // Prefill edit form fields
          setEditCheckInDate(res.checkInDate?.split('T')[0] || '');
          setEditCheckOutDate(res.checkOutDate?.split('T')[0] || '');
          setEditPaymentMethod(res.paymentMethod || '');
          setEditSpecialRequests(res.specialRequests || '');
        }
      } catch (e) {
        console.error('[BookingTrackingPage] error', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId, fetchBookingDetails]);

  const startEdit = () => {
    if (booking?.status === 'CONFIRMED' || booking?.status === 'CANCELLED') {
      alert('Cannot edit ' + booking.status.toLowerCase() + ' bookings');
      return;
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!bookingId) return;
    const result = await editBooking(
      bookingId,
      {
        checkInDate: editCheckInDate,
        checkOutDate: editCheckOutDate,
        paymentMethod: editPaymentMethod,
        specialRequests: editSpecialRequests,
      },
      () => {
        // Reload booking after successful edit
        setIsEditing(false);
        fetchBookingDetails(bookingId).then(res => setBooking(res ?? null));
      }
    );
    return result;
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset form fields
    if (booking) {
      setEditCheckInDate(booking.checkInDate?.split('T')[0] || '');
      setEditCheckOutDate(booking.checkOutDate?.split('T')[0] || '');
      setEditPaymentMethod(booking.paymentMethod || '');
      setEditSpecialRequests(booking.specialRequests || '');
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-row items-center justify-between p-6 border-b border-border dark:border-border-dark">
        <Pressable
          onPress={() => {
            // Replace with root dashboard index to clear nested route
            if (isEditing) {
              cancelEdit();
            } else {
              router.replace('/(tabs)/dashboard');
            }
          }}
          style={{ padding: 6 }}
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
        </Pressable>
        {booking && !isEditing && (
          <View className="flex-row gap-2">
            {booking.status !== 'CONFIRMED' && booking.status !== 'CANCELLED' && (
              <Pressable
                onPress={startEdit}
                className="px-3 py-2 rounded-lg"
                style={{ backgroundColor: isDark ? theme.colors['primary-dark'] : theme.colors.primary }}
              >
                <Ionicons name="pencil" size={16} color="white" />
              </Pressable>
            )}
            <Pressable
              onPress={() => router.push(`/(tabs)/dashboard/${bookingId}/qr-generate`)}
              className="px-3 py-2 rounded-lg bg-primary"
            >
              <Text className="text-sm font-semibold text-white">Generate QR</Text>
            </Pressable>
          </View>
        )}
      </View>
      <ScrollView className="flex-1 p-6">
        {loading ? (
          <View className="items-center justify-center flex-1 py-20">
            <ActivityIndicator size="large" />
          </View>
        ) : booking ? (
          <>
            {isEditing ? (
              <View>
                <HotelBookingForm
                  checkInDate={editCheckInDate}
                  checkOutDate={editCheckOutDate}
                  guestName={booking.user?.userName || ''}
                  guestEmail={booking.user?.email || ''}
                  guestPhoneNumber={booking.user?.phone || ''}
                  setCheckInDate={setEditCheckInDate}
                  setCheckOutDate={setEditCheckOutDate}
                  setGuestName={() => {}}
                  setGuestEmail={() => {}}
                  setGuestPhoneNumber={() => {}}
                  paymentMethod={editPaymentMethod}
                  setPaymentMethod={setEditPaymentMethod}
                  specialRequests={editSpecialRequests}
                  setSpecialRequests={setEditSpecialRequests}
                  onSubmit={handleSaveEdit}
                  submitting={submitting}
                  isEditing={true}
                  onCancel={cancelEdit}
                />
              </View>
            ) : (
              <View>
                <Text className="text-2xl font-bold text-text dark:text-text-dark">Booking {booking.confirmationCode}</Text>
                <Text className="mt-2 text-sm text-muted dark:text-muted-dark">Status: {booking.status}</Text>

                <View className="p-4 mt-6 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
                  <Text className="font-semibold text-text dark:text-text-dark">Hotel</Text>
                  <Text className="mt-1 text-base text-text dark:text-text-dark">{booking?.hotel?.name}</Text>
                  <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{booking?.hotel?.location?.city ?? ''}</Text>
                </View>

                <View className="p-4 mt-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
                  <Text className="font-semibold text-text dark:text-text-dark">Guest</Text>
                  <Text className="mt-1 text-base text-text dark:text-text-dark">{booking?.user?.userName ?? booking?.user?.email}</Text>
                </View>

                <View className="p-4 mt-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
                  <Text className="font-semibold text-text dark:text-text-dark">Room Details</Text>
                  {booking.roomDetails?.map((r: any) => (
                    <View key={r.hotelRoomId} className="mt-3">
                      <Text className="font-semibold text-text dark:text-text-dark">{r.hotelRoom?.hotelRoomType?.name ?? r.hotelRoom?.roomNumber ?? 'Room'}</Text>
                      <Text className="text-sm text-muted dark:text-muted-dark">Price per night: {r.pricePerNight}</Text>
                      <Text className="text-sm text-muted dark:text-muted-dark">Subtotal: {r.subtotal}</Text>
                    </View>
                  ))}
                </View>

                <View className="p-4 mt-4 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark">
                  <Text className="font-semibold text-text dark:text-text-dark">Summary</Text>
                  <Text className="mt-2 text-base text-text dark:text-text-dark">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</Text>
                  <Text className="mt-1 text-base text-text dark:text-text-dark">Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</Text>
                  <Text className="mt-2 text-lg font-bold text-text dark:text-text-dark">Total: {booking.totalPrice}</Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-muted dark:text-muted-dark">Booking not found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
