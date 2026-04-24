/**
 * Package Bookings List Page
 * Displays user's tour package bookings
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { PackageBookingCard } from '../../../components/tourBuilder/PackageBookingCard';
import { usePackageBookingLogic } from '../../../hooks/usePackageBookingLogic';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { BookingStatus, PaymentStatus } from '../../../types/packageBookings';

export default function PackageBookingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const {
    bookings,
    bookingsLoading,
    bookingsError,
    fetchMyBookings,
  } = usePackageBookingLogic();

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  // Fetch bookings on mount
  useEffect(() => {
    loadBookings();
  }, [statusFilter, paymentFilter]);

  const loadBookings = async () => {
    const filters: any = {
      limit: 50,
      offset: 0,
      sortBy: 'bookingDate',
      sortOrder: 'desc',
    };

    if (statusFilter !== 'ALL') {
      filters.status = statusFilter;
    }
    if (paymentFilter !== 'ALL') {
      filters.paymentStatus = paymentFilter;
    }

    await fetchMyBookings(filters);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingPress = (bookingId: string) => {
    router.push({
      pathname: '/(tabs)/dashboard/package-bookings/[bookingId]',
      params: { bookingId },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Ionicons name="calendar-outline" size={48} color={mutedColor} />
      <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">
        {t(TRANSLATION_KEYS.PACKAGE_BOOKING.NO_BOOKINGS)}
      </Text>
      <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark px-6">
        {t(TRANSLATION_KEYS.PACKAGE_BOOKING.NO_BOOKINGS_DESC)}
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/explore/tour-list')}
        className="mt-6 px-6 py-3 rounded-xl"
        style={{ backgroundColor: primaryColor }}
      >
        <Text className="text-white font-semibold">
          {t(TRANSLATION_KEYS.PACKAGE_BOOKING.BROWSE_TOURS)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const statusOptions: Array<BookingStatus | 'ALL'> = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  const paymentOptions: Array<PaymentStatus | 'ALL'> = ['ALL', 'UNPAID', 'PAID'];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-4 flex-row items-center">
        <Pressable onPress={handleBack} style={{ padding: 6, marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.PACKAGE_BOOKING.MY_BOOKINGS)}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.PACKAGE_BOOKING.MY_BOOKINGS_DESC)}
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View className="px-6 pb-4">
        {/* Status Filter */}
        <View className="mb-3">
          <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.PACKAGE_BOOKING.FILTER_BY_STATUS)}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setStatusFilter(status)}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      statusFilter === status
                        ? primaryColor
                        : isDark
                        ? theme.colors['surface-dark']
                        : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: statusFilter === status ? primaryColor : (isDark ? theme.colors['border-dark'] : theme.colors.border),
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: statusFilter === status ? '#fff' : textColor }}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Payment Filter */}
        <View>
          <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.PACKAGE_BOOKING.FILTER_BY_PAYMENT)}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {paymentOptions.map((payment) => (
                <TouchableOpacity
                  key={payment}
                  onPress={() => setPaymentFilter(payment)}
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      paymentFilter === payment
                        ? primaryColor
                        : isDark
                        ? theme.colors['surface-dark']
                        : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: paymentFilter === payment ? primaryColor : (isDark ? theme.colors['border-dark'] : theme.colors.border),
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: paymentFilter === payment ? '#fff' : textColor }}
                  >
                    {payment}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Error Alert */}
      {bookingsError && (
        <View className="mx-6 mb-4 p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.error}20` }}>
          <Text className="text-sm" style={{ color: theme.colors.error }}>
            {bookingsError.message}
          </Text>
        </View>
      )}

      {/* Bookings List */}
      {bookingsLoading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text className="mt-4 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.COMMON.LOADING)}...
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={({ item }) => (
            <View className="px-6">
              <PackageBookingCard booking={item} onPress={handleBookingPress} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}
    </SafeAreaView>
  );
}
