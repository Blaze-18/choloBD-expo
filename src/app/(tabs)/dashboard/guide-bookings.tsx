/**
 * Guide Bookings List Page
 * Displays the signed-in traveler's guide requests and tours
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, ActivityIndicator, TouchableOpacity, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { useGuideBookingLogic } from '../../../hooks/useGuideBookingLogic';
import { GuideBookingCard } from '../../../components/guides';
import { GuideBooking, GuideBookingStatus } from '../../../types/guides';

const STATUS_OPTIONS: Array<GuideBookingStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'ACCEPTED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'DECLINED',
];

export default function GuideBookingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const {
    bookings,
    bookingsLoading,
    bookingsError,
    fetchMyBookings,
    cancelBooking,
    payForBooking,
    cancelling,
    paymentLoading,
  } = useGuideBookingLogic();

  const [statusFilter, setStatusFilter] = useState<GuideBookingStatus | 'ALL'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadBookings = async () => {
    await fetchMyBookings({
      limit: 50,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingPress = (booking: GuideBooking) => {
    router.push({
      pathname: '/(tabs)/dashboard/guide-bookings/[bookingId]',
      params: { bookingId: booking.id },
    });
  };

  const handleCancel = (booking: GuideBooking) => {
    Alert.alert(
      t(TRANSLATION_KEYS.GUIDE_BOOKING.CANCEL_CONFIRM_TITLE),
      t(TRANSLATION_KEYS.GUIDE_BOOKING.CANCEL_CONFIRM_DESC),
      [
        { text: t(TRANSLATION_KEYS.GUIDE_BOOKING.KEEP_BOOKING), style: 'cancel' },
        {
          text: t(TRANSLATION_KEYS.GUIDE_BOOKING.CONFIRM_CANCEL),
          style: 'destructive',
          onPress: () => cancelBooking(booking.id, undefined, loadBookings),
        },
      ]
    );
  };

  const handlePay = async (booking: GuideBooking) => {
    await payForBooking(booking, loadBookings);
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Ionicons name="people-outline" size={48} color={mutedColor} />
      <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">
        {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_BOOKINGS)}
      </Text>
      <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark px-6">
        {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_BOOKINGS_DESC)}
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/explore/guides-list')}
        className="mt-6 px-6 py-3 rounded-xl"
        style={{ backgroundColor: primaryColor }}
      >
        <Text className="text-white font-semibold">
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.BROWSE_GUIDES)}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-4 flex-row items-center">
        <Pressable onPress={() => router.back()} style={{ padding: 6, marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.MY_BOOKINGS)}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.MY_BOOKINGS_DESC)}
          </Text>
        </View>
      </View>

      {/* Status filter */}
      <View className="px-6 pb-4">
        <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.FILTER_BY_STATUS)}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {STATUS_OPTIONS.map((status) => (
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
                  borderColor:
                    statusFilter === status
                      ? primaryColor
                      : isDark
                      ? theme.colors['border-dark']
                      : theme.colors.border,
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

      {/* Error */}
      {bookingsError && (
        <View className="mx-6 mb-4 p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.error}20` }}>
          <Text className="text-sm" style={{ color: theme.colors.error }}>
            {bookingsError}
          </Text>
        </View>
      )}

      {/* List */}
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
              <GuideBookingCard
                booking={item}
                onPress={() => handleBookingPress(item)}
                onPay={() => handlePay(item)}
                onCancel={() => handleCancel(item)}
                actionLoading={cancelling || paymentLoading}
              />
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
