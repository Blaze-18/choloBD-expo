/**
 * Guide Booking Card Component
 * Traveler-facing summary of a guide booking with pay and cancel actions
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { GuideStatusBadge } from './GuideStatusBadge';
import { GuideBooking } from '../../types/guides';
import { canCancelGuideBooking, canPayForGuideBooking } from '../../hooks/useGuideBookingLogic';

interface GuideBookingCardProps {
  booking: GuideBooking;
  onPress?: () => void;
  onPay?: () => void;
  onCancel?: () => void;
  actionLoading?: boolean;
}

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

export function GuideBookingCard({ booking, onPress, onPay, onCancel, actionLoading }: GuideBookingCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;

  const guideName = booking.guide
    ? `${booking.guide.firstName} ${booking.guide.lastName}`.trim()
    : t(TRANSLATION_KEYS.GUIDE_BOOKING.GUIDE);

  const startLabel = formatTime(booking.startTime);
  const endLabel = formatTime(booking.endTime);
  const timeRange = startLabel && endLabel ? `${startLabel} – ${endLabel}` : endLabel;

  const showPay = canPayForGuideBooking(booking) && !!onPay;
  const showCancel = canCancelGuideBooking(booking) && !!onCancel;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: surfaceColor,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }} numberOfLines={1}>
            {guideName}
          </Text>
          {booking.guide?.location?.name ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <Ionicons name="location" size={13} color={primaryColor} />
              <Text style={{ fontSize: 12, color: mutedColor }} numberOfLines={1}>
                {booking.guide.location.name}
              </Text>
            </View>
          ) : null}
        </View>
        <GuideStatusBadge status={booking.status} />
      </View>

      {/* Schedule */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="calendar-outline" size={14} color={mutedColor} />
          <Text style={{ fontSize: 13, color: mutedColor }}>{formatDate(booking.bookingDate)}</Text>
        </View>
        {timeRange ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="time-outline" size={14} color={mutedColor} />
            <Text style={{ fontSize: 13, color: mutedColor }}>{timeRange}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="people-outline" size={14} color={mutedColor} />
          <Text style={{ fontSize: 13, color: mutedColor }}>{booking.travelerCount}</Text>
        </View>
      </View>

      {/* Code + total */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <View>
          <Text style={{ fontSize: 11, color: mutedColor }}>
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.CONFIRMATION_CODE)}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }}>{booking.confirmationCode}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 11, color: mutedColor }}>{t(TRANSLATION_KEYS.GUIDE_BOOKING.TOTAL)}</Text>
          <Text style={{ fontSize: 17, fontWeight: '700', color: primaryColor }}>
            ৳{booking.totalPrice?.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Awaiting-guide hint */}
      {booking.status === 'PENDING' && (
        <Text style={{ fontSize: 12, color: mutedColor, marginTop: 10 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.AWAITING_GUIDE)}
        </Text>
      )}

      {/* Declined / cancelled reason */}
      {booking.declinedReason ? (
        <Text style={{ fontSize: 12, color: errorColor, marginTop: 10 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.REASON)}: {booking.declinedReason}
        </Text>
      ) : null}
      {booking.cancellationReason ? (
        <Text style={{ fontSize: 12, color: errorColor, marginTop: 10 }}>
          {t(TRANSLATION_KEYS.GUIDE_BOOKING.REASON)}: {booking.cancellationReason}
        </Text>
      ) : null}

      {/* Actions */}
      {(showPay || showCancel) && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {showPay && (
            <TouchableOpacity
              onPress={onPay}
              disabled={actionLoading}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: primaryColor,
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.PAY_NOW)}
              </Text>
            </TouchableOpacity>
          )}
          {showCancel && (
            <TouchableOpacity
              onPress={onCancel}
              disabled={actionLoading}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: errorColor,
                opacity: actionLoading ? 0.6 : 1,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: errorColor }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.CANCEL_BOOKING)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
