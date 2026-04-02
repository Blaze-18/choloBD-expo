import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

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
  return (
    <View className="items-center p-6 bg-white dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark">
      <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">{label}</Text>

      <View
        className="bg-white p-4 rounded-lg"
        style={{
          elevation: 2,
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
        <Text className="mt-4 text-sm text-muted dark:text-muted-dark">
          Expires: {new Date(expiresAt).toLocaleTimeString()}
        </Text>
      )}

      <Text className="mt-2 text-xs text-muted dark:text-muted-dark text-center">
        Show this code to the hotel staff at check-in
      </Text>
    </View>
  );
};

export default QRCodeDisplay;
