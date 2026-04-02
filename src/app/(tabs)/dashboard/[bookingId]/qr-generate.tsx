import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QRCodeDisplay } from '../../../../components/ui/QRCodeDisplay';
import { useQRGeneration } from '../../../../hooks/useQRGeneration';

export default function BookingQRGeneratePage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const bookingId = params.bookingId as string | undefined;

  const { generateQRToken, loading, error } = useQRGeneration();
  const [qrToken, setQRToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) {
        Alert.alert('Error', 'Booking ID is missing');
        router.back();
        return;
      }

      try {
        // eslint-disable-next-line no-console
        console.log('[BookingQRGeneratePage] Generating QR for booking:', bookingId);
        const token = await generateQRToken(bookingId);
        if (token) {
          setQRToken(token);
          // Set expiry to 10 minutes from now
          const expiryTime = new Date();
          expiryTime.setMinutes(expiryTime.getMinutes() + 10);
          setExpiresAt(expiryTime.toISOString());
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[BookingQRGeneratePage] Generation error', e);
        Alert.alert('Failed to Generate QR', error || 'Please try again');
      }
    };

    load();
  }, [bookingId, generateQRToken, error]);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6 border-b border-border dark:border-border-dark flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-text dark:text-text-dark">Check-in QR Code</Text>
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="close" size={24} color="#111827" />
        </Pressable>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-muted dark:text-muted-dark">Generating QR code...</Text>
        </View>
      ) : qrToken ? (
        <View className="flex-1 overflow-y-auto p-6">
          <QRCodeDisplay qrToken={qrToken} expiresAt={expiresAt ?? undefined} />

          <View className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <Text className="text-sm font-semibold text-blue-900 dark:text-blue-50 mb-2">
              How to use:
            </Text>
            <Text className="text-xs text-blue-800 dark:text-blue-100">
              1. Display this QR code on your phone screen{'\n'}
              2. Show it to the hotel staff at check-in{'\n'}
              3. They will scan it to verify your booking{'\n'}
              4. The code expires in 10 minutes
            </Text>
          </View>

          <Pressable
            onPress={() => router.back()}
            className="mt-6 px-6 py-3 rounded-lg border border-primary items-center"
          >
            <Text className="text-primary font-semibold">Done</Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-lg font-semibold text-text dark:text-text-dark mb-4">
            Failed to Generate QR Code
          </Text>
          <Text className="text-sm text-muted dark:text-muted-dark text-center mb-6">
            {error || 'An unknown error occurred'}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-6 py-3 rounded-lg bg-primary items-center"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
