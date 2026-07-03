import React from 'react';
import { View, Text } from 'react-native';
import theme from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { PaymentStatus } from '@/types/payments';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { isDark } = useTheme();
  const isPaid = status === 'PAID';

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        backgroundColor: isPaid
          ? (isDark ? theme.colors['success-dark'] + '28' : theme.colors.success + '1A')
          : (isDark ? theme.colors['warning-dark'] + '28' : theme.colors.warning + '1A'),
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          color: isPaid
            ? (isDark ? theme.colors['success-dark'] : theme.colors.success)
            : (isDark ? theme.colors['warning-dark'] : theme.colors.warning),
        }}
      >
        {isPaid ? 'PAID' : 'UNPAID'}
      </Text>
    </View>
  );
}
