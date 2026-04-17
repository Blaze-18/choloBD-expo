import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

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
      <View className="p-4 mb-3 bg-white rounded-xl border border-border dark:bg-surface-dark dark:border-border-dark shadow">
        {/* Header: Guest name and status badges */}
        <View className="flex-row justify-between items-start">
          <View style={{ flex: 1 }}>
            <Text className="font-bold text-lg text-text dark:text-text-dark">
              {displayName}
            </Text>
            {/* Show guest contact info only for SERVICE_ADMIN, hide for regular users */}
            {isServiceAdmin && (
              <>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="mail" size={14} color={muteIconColor} style={{ marginRight: 6 }} />
                  <Text className="text-sm text-muted dark:text-muted-dark flex-1">
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
          <View className="ml-3 items-end">
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
        <View className="h-px bg-border dark:bg-border-dark my-3" />

        {/* Booking details */}
        <View>
          {/* Confirmation code */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="receipt" size={16} color={theme.colors.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">
                Confirmation Code
              </Text>
              <Text className="text-sm font-semibold text-text dark:text-text-dark">
                {booking.confirmationCode || booking.id?.substring(0, 16) || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Check-in and check-out dates */}
          <View className="flex-row justify-between gap-3 mb-3">
            <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <Text className="text-xs font-semibold text-blue-600 dark:text-blue-300 mb-1">
                CHECK-IN
              </Text>
              <Text className="text-base font-bold text-text dark:text-text-dark">
                {formatDate(booking.checkInDate)}
              </Text>
            </View>
            <View className="flex-1 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <Text className="text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1">
                CHECK-OUT
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
                  Total Price
                </Text>
                <Text className="text-base font-bold text-text dark:text-text-dark">
                  ₹{booking.totalPrice ?? 'N/A'}
                </Text>
              </View>
            </View>
            {booking.bookedAt && (
              <View className="items-end">
                <Text className="text-xs text-muted dark:text-muted-dark mb-0.5">
                  Booked On
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
          <View className="mt-4 pt-4 border-t border-border dark:border-border-dark">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bed" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
              <Text className="text-sm font-bold text-text dark:text-text-dark">
                Room{booking.roomDetails.length > 1 ? 's' : ''} ({booking.roomDetails.length})
              </Text>
            </View>
            {booking.roomDetails.map((room: any, idx: number) => (
              <View key={idx} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-semibold text-text dark:text-text-dark">
                    Room {room.hotelRoom?.roomNumber || '?'}
                  </Text>
                  <Text className="text-base font-bold text-green-600 dark:text-green-400">
                    ₹{room.pricePerNight}/night
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
