/**
 * Guide Booking Detail Page
 * Full detail for one guide booking with pay and cancel actions
 */

import React, { useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, TouchableOpacity, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../hooks/useTheme';
import { theme } from '../../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../../constants/translationKeys';
import {
  useGuideBookingLogic,
  canCancelGuideBooking,
  canPayForGuideBooking,
} from '../../../../hooks/useGuideBookingLogic';
import { GuideStatusBadge } from '../../../../components/guides';
import { PaymentStatusBadge } from '../../../../components/ui/PaymentStatusBadge';

/** Formats an ISO timestamp as a short readable date */
function formatDate(value?: string | null): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

/** Formats an ISO timestamp as HH:MM in UTC, matching how the slot was submitted */
function formatTime(value?: string | null): string | null {
  if (!value) return null;
  try {
    const date = new Date(value);
    return `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
  } catch {
    return null;
  }
}

export default function GuideBookingDetailPage() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const {
    currentBooking: booking,
    currentBookingLoading,
    fetchBookingDetail,
    cancelBooking,
    payForBooking,
    cancelling,
    paymentLoading,
  } = useGuideBookingLogic();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;

  useEffect(() => {
    if (bookingId) fetchBookingDetail(bookingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const handleCancel = () => {
    if (!booking) return;
    Alert.alert(
      t(TRANSLATION_KEYS.GUIDE_BOOKING.CANCEL_CONFIRM_TITLE),
      t(TRANSLATION_KEYS.GUIDE_BOOKING.CANCEL_CONFIRM_DESC),
      [
        { text: t(TRANSLATION_KEYS.GUIDE_BOOKING.KEEP_BOOKING), style: 'cancel' },
        {
          text: t(TRANSLATION_KEYS.GUIDE_BOOKING.CONFIRM_CANCEL),
          style: 'destructive',
          onPress: () => cancelBooking(booking.id),
        },
      ]
    );
  };

  const renderRow = (label: string, value?: string | null) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
      <Text style={{ fontSize: 13, color: mutedColor }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, flexShrink: 1, textAlign: 'right' }}>
        {value || '—'}
      </Text>
    </View>
  );

  const renderCard = (title: string, children: React.ReactNode) => (
    <View
      style={{
        backgroundColor: surfaceColor,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: textColor, marginBottom: 8 }}>{title}</Text>
      {children}
    </View>
  );

  const guideName = booking?.guide
    ? `${booking.guide.firstName} ${booking.guide.lastName}`.trim()
    : '—';

  const startLabel = formatTime(booking?.startTime);
  const endLabel = formatTime(booking?.endTime);
  const timeRange = startLabel && endLabel ? `${startLabel} – ${endLabel}` : endLabel;

  const showPay = booking ? canPayForGuideBooking(booking) : false;
  const showCancel = booking ? canCancelGuideBooking(booking) : false;
  const contactVisible = !!(booking?.guide?.phoneNumber || booking?.guide?.contactEmail);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-4 flex-row items-center">
        <Pressable onPress={() => router.back()} style={{ padding: 6, marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </Pressable>
        <Text className="text-2xl font-bold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.BOOKING_DETAILS)}
        </Text>
      </View>

      {currentBookingLoading && !booking ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : !booking ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-outline" size={64} color={mutedColor} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.BOOKING_NOT_FOUND)}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        >
          {/* Status summary */}
          <View
            style={{
              backgroundColor: surfaceColor,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor,
            }}
          >
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <GuideStatusBadge status={booking.status} />
              <PaymentStatusBadge status={booking.paymentStatus} />
            </View>
            <Text style={{ fontSize: 12, color: mutedColor }}>
              {t(TRANSLATION_KEYS.GUIDE_BOOKING.CONFIRMATION_CODE)}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '700', color: textColor, marginTop: 2 }}>
              {booking.confirmationCode}
            </Text>
            <Text style={{ fontSize: 26, fontWeight: '800', color: primaryColor, marginTop: 12 }}>
              ৳{booking.totalPrice?.toLocaleString()}
            </Text>

            {booking.status === 'PENDING' && (
              <Text style={{ fontSize: 12, color: mutedColor, marginTop: 10 }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.AWAITING_GUIDE)}
              </Text>
            )}

            {showPay && booking.paymentExpiresAt && (
              <Text style={{ fontSize: 12, color: mutedColor, marginTop: 10 }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.PAYMENT_DEADLINE, {
                  date: formatDate(booking.paymentExpiresAt),
                })}
              </Text>
            )}
          </View>

          {/* Guide */}
          {renderCard(
            t(TRANSLATION_KEYS.GUIDE_BOOKING.GUIDE),
            <View>
              {renderRow(t(TRANSLATION_KEYS.GUIDE_BOOKING.GUIDE), guideName)}
              {renderRow(t(TRANSLATION_KEYS.GUIDES.LOCATION), booking.guide?.location?.name)}
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: '/(tabs)/explore/guide-detail', params: { id: booking.guideId } })
                }
                style={{ marginTop: 8, paddingVertical: 8 }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: primaryColor }}>
                  {t(TRANSLATION_KEYS.GUIDES.TITLE)} →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Schedule */}
          {renderCard(
            t(TRANSLATION_KEYS.GUIDE_BOOKING.SCHEDULE),
            <View>
              {renderRow(t(TRANSLATION_KEYS.GUIDE_BOOKING.DATE), formatDate(booking.bookingDate))}
              {timeRange ? renderRow(t(TRANSLATION_KEYS.GUIDE_BOOKING.END_TIME), timeRange) : null}
              {renderRow(t(TRANSLATION_KEYS.GUIDE_BOOKING.TRAVELERS), `${booking.travelerCount}`)}
            </View>
          )}

          {/* Requests */}
          {booking.specialRequirements || booking.specialRequests
            ? renderCard(
                t(TRANSLATION_KEYS.GUIDE_BOOKING.SPECIAL_REQUIREMENTS),
                <View style={{ gap: 8 }}>
                  {booking.specialRequirements ? (
                    <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 19 }}>
                      {booking.specialRequirements}
                    </Text>
                  ) : null}
                  {booking.specialRequests ? (
                    <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 19 }}>
                      {booking.specialRequests}
                    </Text>
                  ) : null}
                </View>
              )
            : null}

          {/* Guide contact — only present once the backend unlocks it */}
          {renderCard(
            t(TRANSLATION_KEYS.GUIDE_BOOKING.GUIDE_CONTACT),
            contactVisible ? (
              <View>
                {renderRow('Phone', booking.guide?.phoneNumber)}
                {renderRow('Email', booking.guide?.contactEmail)}
              </View>
            ) : (
              <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 19 }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.CONTACT_AFTER_CONFIRM)}
              </Text>
            )
          )}

          {/* Reasons */}
          {booking.declinedReason || booking.cancellationReason ? (
            <View
              style={{
                backgroundColor: `${errorColor}14`,
                borderRadius: 12,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '700', color: errorColor, marginBottom: 4 }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.REASON)}
              </Text>
              <Text style={{ fontSize: 13, color: errorColor, lineHeight: 19 }}>
                {booking.declinedReason || booking.cancellationReason}
              </Text>
            </View>
          ) : null}

          {/* Actions */}
          {showPay && (
            <TouchableOpacity
              onPress={() => payForBooking(booking)}
              disabled={paymentLoading}
              style={{
                paddingVertical: 15,
                borderRadius: 14,
                alignItems: 'center',
                backgroundColor: primaryColor,
                opacity: paymentLoading ? 0.6 : 1,
                marginBottom: 10,
              }}
            >
              {paymentLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                  {t(TRANSLATION_KEYS.GUIDE_BOOKING.PAY_NOW)}
                </Text>
              )}
            </TouchableOpacity>
          )}

          {showCancel && (
            <TouchableOpacity
              onPress={handleCancel}
              disabled={cancelling}
              style={{
                paddingVertical: 15,
                borderRadius: 14,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errorColor,
                opacity: cancelling ? 0.6 : 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: errorColor }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.CANCEL_BOOKING)}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
