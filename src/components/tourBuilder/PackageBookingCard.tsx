/**
 * Package Booking Card Component
 * Card for displaying package booking in list view
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { PackageBooking, BookingStatus, PaymentStatus } from '../../types/packageBookings';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface PackageBookingCardProps {
  booking: PackageBooking;
  onPress?: (bookingId: string) => void;
  hideViewDetails?: boolean;
}

export function PackageBookingCard({ booking, onPress, hideViewDetails = false }: PackageBookingCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return isDark ? theme.colors['success-dark'] : theme.colors.success;
      case 'PENDING':
        return isDark ? theme.colors['warning-dark'] : theme.colors.warning;
      case 'CANCELLED':
      case 'REFUNDED':
      case 'NO_SHOW':
        return isDark ? theme.colors['error-dark'] : theme.colors.error;
      default:
        return mutedColor;
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return isDark ? theme.colors['success-dark'] : theme.colors.success;
      case 'UNPAID':
        return isDark ? theme.colors['warning-dark'] : theme.colors.warning;
      default:
        return mutedColor;
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const packageName = booking.tourPackage?.packageName || 'Package';
  const locationName = booking.tourPackage?.location?.name || '';

  return (
    <TouchableOpacity
      onPress={() => onPress?.(booking.id)}
      activeOpacity={0.8}
      className="mb-3"
    >
      <View
        className="p-4 rounded-xl"
        style={{
          backgroundColor: surfaceColor,
          borderWidth: 1,
          borderColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Header: Package name and badges */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 pr-2">
            <Text className="text-lg font-bold text-text dark:text-text-dark" numberOfLines={2}>
              {packageName}
            </Text>
            {locationName && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={14} color={mutedColor} style={{ marginRight: 4 }} />
                <Text className="text-sm text-muted dark:text-muted-dark">{locationName}</Text>
              </View>
            )}
          </View>

          {/* Status badges */}
          <View className="items-end">
            <View
              style={{ backgroundColor: `${getStatusColor(booking.status)}20` }}
              className="px-3 py-1 rounded-lg mb-1.5"
            >
              <Text style={{ color: getStatusColor(booking.status) }} className="text-xs font-bold">
                {booking.status}
              </Text>
            </View>
            <View
              style={{ backgroundColor: `${getPaymentStatusColor(booking.paymentStatus)}20` }}
              className="px-3 py-1 rounded-lg"
            >
              <Text style={{ color: getPaymentStatusColor(booking.paymentStatus) }} className="text-xs font-bold">
                {booking.paymentStatus}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View className="gap-2">
          {/* Confirmation Code */}
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark-outline" size={16} color={mutedColor} style={{ marginRight: 8 }} />
            <Text className="text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.PACKAGE_BOOKING.CODE)}:{' '}
              <Text className="font-semibold text-text dark:text-text-dark">{booking.confirmationCode}</Text>
            </Text>
          </View>

          {/* Booking Date */}
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color={mutedColor} style={{ marginRight: 8 }} />
            <Text className="text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.PACKAGE_BOOKING.BOOKED_ON)}: {formatDate(booking.bookingDate)}
            </Text>
          </View>

          {/* Quantity */}
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={16} color={mutedColor} style={{ marginRight: 8 }} />
            <Text className="text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.PACKAGE_BOOKING.QUANTITY)}: {booking.quantity} {booking.quantity === 1 ? 'person' : 'people'}
            </Text>
          </View>

          {/* Total Price */}
          <View className="flex-row items-center">
            <Ionicons name="cash-outline" size={16} color={mutedColor} style={{ marginRight: 8 }} />
            <Text className="text-sm text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.PACKAGE_BOOKING.TOTAL)}: <Text className="font-bold text-text dark:text-text-dark">৳{booking.totalPrice.toLocaleString()}</Text>
            </Text>
          </View>
        </View>

        {/* View Details Arrow */}
        {!hideViewDetails && (
          <View className="flex-row items-center justify-end mt-3">
            <Text className="mr-1 text-sm text-primary dark:text-primary-dark">
              {t(TRANSLATION_KEYS.COMMON.VIEW_DETAILS)}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={isDark ? theme.colors['primary-dark'] : theme.colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
