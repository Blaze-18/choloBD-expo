import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface BookingCardProps {
  booking: any;
  onPress?: (id: string) => void;
}

// Helper function to format dates in a readable way
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const auth = useSelector((s: RootState) => s.auth);
  const muteIconColor = isDark ? '#9ca3af' : '#666';
  
  // Determine what name to display based on user role
  const isServiceAdmin = auth.user?.role === 'SERVICE_ADMIN';
  const displayName = isServiceAdmin 
    ? (booking.guestName || booking.guest || 'Guest')
    : (booking.hotel?.name || booking.hotelDetails?.name || booking.hotelName || 'Hotel');

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return isDark ? theme.colors['success-dark'] : theme.colors.success;
      case 'pending':
        return isDark ? theme.colors['warning-dark'] : theme.colors.warning;
      case 'cancelled':
        return isDark ? theme.colors['error-dark'] : theme.colors.error;
      default:
        return isDark ? theme.colors['muted-dark'] : theme.colors.muted;
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return isDark ? theme.colors['success-dark'] : theme.colors.success;
      case 'pending':
        return isDark ? theme.colors['warning-dark'] : theme.colors.warning;
      case 'failed':
        return isDark ? theme.colors['error-dark'] : theme.colors.error;
      default:
        return isDark ? theme.colors['muted-dark'] : theme.colors.muted;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress && onPress(booking.id)} activeOpacity={0.8}>
      <View className="p-4 mb-3 bg-white border shadow rounded-xl border-border dark:bg-surface-dark dark:border-border-dark">
        {/* Header: Guest name and status badges */}
        <View className="flex-row items-start justify-between">
          <View style={{ flex: 1 }}>
            <Text className="text-lg font-bold text-text dark:text-text-dark">
              {displayName}
            </Text>
            {/* Show guest contact info only for SERVICE_ADMIN, hide for regular users */}
            {isServiceAdmin && (
              <>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="mail" size={14} color={muteIconColor} style={{ marginRight: 6 }} />
                  <Text className="flex-1 text-sm text-muted dark:text-muted-dark">
                    {booking.guestEmail || 'N/A'}
                  </Text>
                </View>
                <View className="flex-row items-center mt-1.5">
                  <Ionicons name="call" size={14} color={muteIconColor} style={{ marginRight: 6 }} />
                  <Text className="text-sm text-muted dark:text-muted-dark">
                    {booking.guestPhoneNumber || 'N/A'}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Status badges */}
          <View className="items-end ml-3">
            <View
              style={{ backgroundColor: `${getStatusColor(booking.status)}20` }}
              className="px-3 py-1.5 rounded-lg mb-2"
            >
              <Text style={{ color: getStatusColor(booking.status) }} className="text-sm font-bold">
                {booking.status || 'Unknown'}
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${getPaymentStatusColor(booking.paymentStatus)}20` }}
              className="px-3 py-1.5 rounded-lg"
            >
              <Text style={{ color: getPaymentStatusColor(booking.paymentStatus) }} className="text-sm font-bold">
                {booking.paymentStatus || 'Unpaid'}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px my-3 bg-border dark:bg-border-dark" />

        {/* Booking details */}
        <View>
          {/* Confirmation code */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="receipt" size={16} color={theme.colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">
                {t(TRANSLATION_KEYS.BOOKING.CONFIRMATION_CODE)}
              </Text>
              <Text className="text-sm font-semibold text-text dark:text-text-dark">
                {booking.confirmationCode || booking.id?.substring(0, 16) || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Check-in and check-out dates */}
          <View className="flex-row justify-between gap-3 mb-3">
            <View className="flex-1 p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <Text className="mb-1 text-xs font-semibold text-blue-600 dark:text-blue-300">
                {t(TRANSLATION_KEYS.BOOKING.CHECK_IN)}
              </Text>
              <Text className="text-base font-bold text-text dark:text-text-dark">
                {formatDate(booking.checkInDate)}
              </Text>
            </View>
            <View className="flex-1 p-3 border border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
              <Text className="mb-1 text-xs font-semibold text-purple-600 dark:text-purple-300">
                {t(TRANSLATION_KEYS.BOOKING.CHECK_OUT)}
              </Text>
              <Text className="text-base font-bold text-text dark:text-text-dark">
                {formatDate(booking.checkOutDate)}
              </Text>
            </View>
          </View>

          {/* Total price and booking date */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="cash" size={16} color={theme.colors.primary} style={{ marginRight: 10 }} />
              <View>
                <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">
                  {t(TRANSLATION_KEYS.BOOKING.TOTAL_PRICE)}
                </Text>
                <Text className="text-base font-bold text-text dark:text-text-dark">
                  ₹{booking.totalPrice ?? 'N/A'}
                </Text>
              </View>
            </View>
            {booking.bookedAt && (
              <View className="items-end">
                <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">
                  {t(TRANSLATION_KEYS.BOOKING.BOOKED_ON)}
                </Text>
                <Text className="text-sm font-semibold text-text dark:text-text-dark">
                  {formatDate(booking.bookedAt)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Room details if available */}
        {booking.roomDetails && booking.roomDetails.length > 0 && (
          <View className="pt-4 mt-4 border-t border-border dark:border-border-dark">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bed" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
              <Text className="text-sm font-bold text-text dark:text-text-dark">
                {t(TRANSLATION_KEYS.BOOKING.ROOM_NUMBER)}{booking.roomDetails.length > 1 ? 's' : ''} ({booking.roomDetails.length})
              </Text>
            </View>
            {booking.roomDetails.map((room: any, idx: number) => (
              <View key={idx} className="p-3 mb-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-text dark:text-text-dark">
                    {t(TRANSLATION_KEYS.BOOKING.ROOM_NUMBER)} {room.hotelRoom?.roomNumber || '?'}
                  </Text>
                  <Text className="text-base font-bold text-green-600 dark:text-green-400">
                    ₹{room.pricePerNight}{t(TRANSLATION_KEYS.BOOKING.PRICE_PER_NIGHT)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
