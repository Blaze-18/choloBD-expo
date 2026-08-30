/**
 * Guide Booking Status Badge
 * Colour-coded pill for the guide booking lifecycle
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { GuideBookingStatus } from '../../types/guides';

interface GuideStatusBadgeProps {
  status: GuideBookingStatus;
}

export function GuideStatusBadge({ status }: GuideStatusBadgeProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const color = (() => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return isDark ? theme.colors['success-dark'] : theme.colors.success;
      case 'PENDING':
      case 'ACCEPTED':
        return isDark ? theme.colors['warning-dark'] : theme.colors.warning;
      case 'DECLINED':
      case 'CANCELLED':
      case 'NO_SHOW':
        return isDark ? theme.colors['error-dark'] : theme.colors.error;
      default:
        return isDark ? theme.colors['muted-dark'] : theme.colors.muted;
    }
  })();

  const label = t(
    TRANSLATION_KEYS.GUIDE_BOOKING.STATUS[status as keyof typeof TRANSLATION_KEYS.GUIDE_BOOKING.STATUS] ||
      TRANSLATION_KEYS.GUIDE_BOOKING.STATUS.PENDING
  );

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        backgroundColor: `${color}1A`,
      }}
    >
      <Text style={{ fontSize: 11, fontWeight: '700', letterSpacing: 0.5, color }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
