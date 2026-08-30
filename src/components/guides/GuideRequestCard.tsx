/**
 * Guide Request Card Component
 * Guide operator view of an incoming booking with accept / decline / complete actions
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { GuideStatusBadge } from './GuideStatusBadge';
import { GuideBooking, GuideBookingAction } from '../../types/guides';
import { availableGuideActions } from '../../hooks/useGuideAdminLogic';

interface GuideRequestCardProps {
  booking: GuideBooking;
  onAction: (action: GuideBookingAction, reason?: string) => void;
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

export function GuideRequestCard({ booking, onAction, actionLoading }: GuideRequestCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const actions = availableGuideActions(booking);
  const travelerName =
    booking.user?.userName ||
    [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(' ') ||
    t(TRANSLATION_KEYS.GUIDE_BOOKING.TRAVELER);

  const handleDecline = () => {
    onAction('decline', declineReason.trim() || undefined);
    setShowDecline(false);
    setDeclineReason('');
  };

  return (
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
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: textColor }} numberOfLines={1}>
            {travelerName}
          </Text>
          <Text style={{ fontSize: 12, color: mutedColor, marginTop: 3 }}>{booking.confirmationCode}</Text>
        </View>
        <GuideStatusBadge status={booking.status} />
      </View>

      {/* Details */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="calendar-outline" size={14} color={mutedColor} />
          <Text style={{ fontSize: 13, color: mutedColor }}>{formatDate(booking.bookingDate)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="people-outline" size={14} color={mutedColor} />
          <Text style={{ fontSize: 13, color: mutedColor }}>
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.TRAVELERS_COUNT, { count: booking.travelerCount })}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="cash-outline" size={14} color={mutedColor} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: primaryColor }}>
            ৳{booking.totalPrice?.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Special requirements */}
      {booking.specialRequirements ? (
        <View style={{ marginTop: 12, padding: 10, borderRadius: 8, backgroundColor: isDark ? '#374151' : '#f9fafb' }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: mutedColor, marginBottom: 3 }}>
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.SPECIAL_REQUIREMENTS)}
          </Text>
          <Text style={{ fontSize: 13, color: textColor, lineHeight: 18 }}>{booking.specialRequirements}</Text>
        </View>
      ) : null}

      {/* Contact — backend only exposes these once the booking is confirmed */}
      {booking.user?.phoneNumber || booking.user?.email ? (
        <View style={{ marginTop: 12, gap: 4 }}>
          {booking.user?.phoneNumber ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="call-outline" size={13} color={mutedColor} />
              <Text style={{ fontSize: 12, color: mutedColor }}>{booking.user.phoneNumber}</Text>
            </View>
          ) : null}
          {booking.user?.email ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="mail-outline" size={13} color={mutedColor} />
              <Text style={{ fontSize: 12, color: mutedColor }}>{booking.user.email}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Decline reason input */}
      {showDecline && (
        <View style={{ marginTop: 12 }}>
          <TextInput
            value={declineReason}
            onChangeText={setDeclineReason}
            placeholder={t(TRANSLATION_KEYS.GUIDE_BOOKING.DECLINE_REASON_PLACEHOLDER)}
            placeholderTextColor={mutedColor}
            multiline
            maxLength={500}
            style={{
              borderWidth: 1,
              borderColor,
              borderRadius: 8,
              padding: 10,
              minHeight: 60,
              textAlignVertical: 'top',
              color: textColor,
            }}
          />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => setShowDecline(false)}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }}>
                {t(TRANSLATION_KEYS.COMMON.CANCEL)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDecline}
              disabled={actionLoading}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: errorColor, opacity: actionLoading ? 0.6 : 1 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.CONFIRM_DECLINE)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Primary actions */}
      {!showDecline && actions.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          {actions.includes('accept') && (
            <TouchableOpacity
              onPress={() => onAction('accept')}
              disabled={actionLoading}
              style={{ flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center', backgroundColor: successColor, opacity: actionLoading ? 0.6 : 1 }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.ACCEPT)}
              </Text>
            </TouchableOpacity>
          )}
          {actions.includes('decline') && (
            <TouchableOpacity
              onPress={() => setShowDecline(true)}
              disabled={actionLoading}
              style={{ flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: errorColor, opacity: actionLoading ? 0.6 : 1 }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: errorColor }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.DECLINE)}
              </Text>
            </TouchableOpacity>
          )}
          {actions.includes('complete') && (
            <TouchableOpacity
              onPress={() => onAction('complete')}
              disabled={actionLoading}
              style={{ flex: 1, paddingVertical: 11, borderRadius: 10, alignItems: 'center', backgroundColor: primaryColor, opacity: actionLoading ? 0.6 : 1 }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                {t(TRANSLATION_KEYS.GUIDE_BOOKING.MARK_COMPLETE)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
