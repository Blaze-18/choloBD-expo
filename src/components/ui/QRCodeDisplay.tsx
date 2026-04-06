import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import theme from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

interface QRCodeDisplayProps {
  qrToken: string;
  size?: number;
  label?: string;
  expiresAt?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrToken,
  size = 300,
  label = 'Check-in QR Code',
  expiresAt,
}) => {
  const { isDark } = useTheme();

  return (
    <View className="items-center p-6 bg-white dark:bg-surface-dark rounded-2xl border-2" style={{ borderColor: isDark ? theme.colors['success-light-dark'] : theme.colors['success-light'] }}>
      <Text className="text-lg font-semibold text-text dark:text-text-dark mb-1">{label}</Text>
      <Text className="text-xs text-muted dark:text-muted-dark mb-6">Show this code to hotel staff at check-in</Text>

      <View
        className="bg-white p-4 rounded-2xl"
        style={{
          elevation: 4,
          shadowColor: isDark ? theme.colors['success-light-dark'] : theme.colors['success-light'],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          borderWidth: 2,
          borderColor: isDark ? theme.colors['success-light-dark'] : theme.colors['success-light'],
        }}
      >
        <QRCode
          value={qrToken}
          size={size}
          backgroundColor="white"
          color="black"
          quietZone={10}
        />
      </View>

      {expiresAt && (
        <View className="mt-6 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950">
          <Text className="text-xs font-medium text-green-700 dark:text-green-200">
            Expires: {new Date(expiresAt).toLocaleTimeString()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QRCodeDisplay;
