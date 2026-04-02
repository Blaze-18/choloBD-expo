import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function YourBookingsPage() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        <Pressable onPress={() => router.replace('/(tabs)/dashboard')} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>

        <Text className="text-2xl font-bold mt-2 text-text dark:text-text-dark">Your Bookings</Text>
        <Text className="mt-1 text-sm text-muted dark:text-muted-dark">Bookings you created (owner)</Text>

        <View className="mt-6 p-4 bg-white rounded-xl border border-border dark:bg-surface-dark dark:border-border-dark">
          <Text className="text-sm text-muted dark:text-muted-dark">Placeholder for owner's booking list (reuse current user's booking UI when implementing logic)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
