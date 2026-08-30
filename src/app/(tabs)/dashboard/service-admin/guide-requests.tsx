/**
 * Guide Booking Requests Page
 * Guide operator view for accepting, declining and completing tours
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, SectionList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../hooks/useTheme';
import { theme } from '../../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../../constants/translationKeys';
import { useGuideAdminLogic } from '../../../../hooks/useGuideAdminLogic';
import { GuideRequestCard } from '../../../../components/guides';
import { GuideBooking, GuideBookingAction } from '../../../../types/guides';

export default function GuideRequestsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const {
    guide,
    guideLoading,
    guideError,
    bookings,
    bookingsLoading,
    bookingsError,
    actionLoading,
    summary,
    loadDashboard,
    fetchGuideBookings,
    handleBookingAction,
  } = useGuideAdminLogic();

  const [refreshing, setRefreshing] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (guide?.id) await fetchGuideBookings(guide.id);
    else await loadDashboard();
    setRefreshing(false);
  };

  const sections = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'PENDING');
    const active = bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'CONFIRMED');
    const history = bookings.filter(
      (b) => !['PENDING', 'ACCEPTED', 'CONFIRMED'].includes(b.status)
    );

    return [
      { title: t(TRANSLATION_KEYS.GUIDE_BOOKING.PENDING_REQUESTS), data: pending },
      { title: t(TRANSLATION_KEYS.GUIDE_BOOKING.ACTIVE_BOOKINGS), data: active },
      { title: t(TRANSLATION_KEYS.GUIDE_BOOKING.HISTORY), data: history },
    ].filter((section) => section.data.length > 0);
  }, [bookings, t]);

  const onAction = (booking: GuideBooking) => (action: GuideBookingAction, reason?: string) => {
    handleBookingAction(booking.id, action, reason);
  };

  const renderStat = (label: string, value: string) => (
    <View
      style={{
        flex: 1,
        backgroundColor: surfaceColor,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '800', color: textColor }}>{value}</Text>
      <Text style={{ fontSize: 11, color: mutedColor, marginTop: 2 }}>{label}</Text>
    </View>
  );

  const isLoading = (guideLoading || bookingsLoading) && !refreshing;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-4 flex-row items-center">
        <Pressable onPress={() => router.back()} style={{ padding: 6, marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.REQUESTS_TITLE)}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.REQUESTS_SUBTITLE)}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : guideError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="person-circle-outline" size={64} color={mutedColor} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_PROFILE)}
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_PROFILE_DESC)}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                {renderStat(t(TRANSLATION_KEYS.GUIDE_BOOKING.PENDING_REQUESTS), `${summary.pendingRequests}`)}
                {renderStat(t(TRANSLATION_KEYS.GUIDE_BOOKING.ACTIVE_BOOKINGS), `${summary.activeBookings}`)}
                {renderStat(t(TRANSLATION_KEYS.GUIDE_BOOKING.COMPLETED_TOURS), `${summary.completedTours}`)}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {renderStat(
                  t(TRANSLATION_KEYS.GUIDE_BOOKING.EARNINGS_PAID),
                  `৳${summary.paidEarnings.toLocaleString()}`
                )}
                {renderStat(
                  t(TRANSLATION_KEYS.GUIDE_BOOKING.EARNINGS_PENDING),
                  `৳${summary.pendingEarnings.toLocaleString()}`
                )}
              </View>

              {bookingsError ? (
                <View className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${theme.colors.error}20` }}>
                  <Text className="text-sm" style={{ color: theme.colors.error }}>
                    {bookingsError}
                  </Text>
                </View>
              ) : null}
            </View>
          }
          renderSectionHeader={({ section }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 6 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: textColor }}>{section.title}</Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  backgroundColor: `${successColor}1A`,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: successColor }}>
                  {section.data.length}
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <GuideRequestCard booking={item} onAction={onAction(item)} actionLoading={actionLoading} />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Ionicons name="mail-open-outline" size={48} color={mutedColor} />
              <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_REQUESTS)}
              </Text>
              <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark px-6">
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_REQUESTS_DESC)}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
