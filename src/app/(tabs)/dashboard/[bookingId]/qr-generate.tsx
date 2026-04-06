import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { QRCodeDisplay } from '../../../../components/ui/QRCodeDisplay';
import { useQRGeneration } from '../../../../hooks/useQRGeneration';
import { useTheme } from '../../../../hooks/useTheme';
import theme from '../../../../constants/theme';

export default function BookingQRGeneratePage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
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
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b dark:bg-surface-dark border-border dark:border-border-dark">
        <Text className="text-2xl font-bold text-text dark:text-text-dark">Check-in QR Code</Text>
        <Pressable onPress={() => router.back()} style={{ padding: 6 }}>
          <Ionicons name="close" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color={theme.colors['success-light']} />
          <Text className="mt-4 text-muted dark:text-muted-dark">Generating QR code...</Text>
        </View>
      ) : qrToken ? (
        <ScrollView className="flex-1 px-6 py-6" contentContainerStyle={{ paddingBottom: 24, gap: 16 }}>
          <QRCodeDisplay qrToken={qrToken} expiresAt={expiresAt ?? undefined} />

          <View className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color={isDark ? theme.colors['success-light-dark'] : theme.colors['success-light']} />
              <Text className="ml-2 font-semibold text-green-900 dark:text-green-50">QR Code Generated</Text>
            </View>
            <Text className="text-xs text-green-800 dark:text-green-100 leading-5">
              {'Your check-in code is ready. Show this to hotel staff at arrival to verify your booking instantly.'}
            </Text>
          </View>

          <View className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <Text className="mb-3 font-semibold text-blue-900 dark:text-blue-50">How to use:</Text>
            <View className="space-y-2">
              <View className="flex-row mb-2">
                <Text className="font-semibold text-blue-900 dark:text-blue-50 mr-2">1.</Text>
                <Text className="text-xs text-blue-800 dark:text-blue-100 flex-1">Display this QR code on your phone screen</Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="font-semibold text-blue-900 dark:text-blue-50 mr-2">2.</Text>
                <Text className="text-xs text-blue-800 dark:text-blue-100 flex-1">Show it to the hotel staff at check-in</Text>
              </View>
              <View className="flex-row mb-2">
                <Text className="font-semibold text-blue-900 dark:text-blue-50 mr-2">3.</Text>
                <Text className="text-xs text-blue-800 dark:text-blue-100 flex-1">They will scan it to verify your booking</Text>
              </View>
              <View className="flex-row">
                <Text className="font-semibold text-blue-900 dark:text-blue-50 mr-2">⏱️</Text>
                <Text className="text-xs text-blue-800 dark:text-blue-100 flex-1">Code expires in 10 minutes for security</Text>
              </View>
            </View>
          </View>

          <View className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <View className="flex-row items-start">
              <Ionicons name="information" size={18} color={isDark ? '#fcd34d' : '#f59e0b'} style={{ marginRight: 8, marginTop: 2 }} />
              <Text className="text-xs text-amber-800 dark:text-amber-100 flex-1">
                Keep your phone charged and screen on when checking in. Make sure QR code is clearly visible for scanning.
              </Text>
            </View>
          </View>

          <Pressable onPress={() => router.back()} className="flex-row items-center justify-center px-6 py-3 rounded-lg bg-success-light dark:bg-success-light-dark active:opacity-80" style={{ backgroundColor: isDark ? theme.colors['success-light-dark'] : theme.colors['success-light'] }}>
            <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text className="font-semibold text-white">Done</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView className="flex-1 px-6 py-6" contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="items-center justify-center py-12">
            <Ionicons name="alert-circle" size={48} color={isDark ? theme.colors['error-dark'] : theme.colors.error} />
            <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark">Failed to Generate QR Code</Text>
            <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark">{error || 'An unknown error occurred. Please try again.'}</Text>
          </View>

          <Pressable onPress={() => router.back()} className="items-center px-6 py-3 mt-8 rounded-lg bg-primary dark:bg-primary-dark">
            <Text className="font-semibold text-white">Go Back</Text>
          </Pressable>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
