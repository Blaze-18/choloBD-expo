import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DUMMY_BOOKINGS = [
  { id: 'b1', guest: 'Alice Johnson', room: 'Deluxe' },
  { id: 'b2', guest: 'Mark Spencer', room: 'Standard' },
];

export default function CurrentBookingsPage() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        <Pressable onPress={() => router.replace('/(tabs)/dashboard')} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>

        <Text className="text-2xl font-bold mt-2 text-text dark:text-text-dark">Current Bookings</Text>
        <Text className="mt-1 text-sm text-muted dark:text-muted-dark">Active bookings for your hotels</Text>

        <FlatList
          className="mt-6"
          data={DUMMY_BOOKINGS}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View className="p-4 mb-3 bg-white rounded-xl border border-border dark:bg-surface-dark dark:border-border-dark">
              <Text className="font-semibold text-text dark:text-text-dark">{item.guest}</Text>
              <Text className="text-sm text-muted dark:text-muted-dark">Room: {item.room}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
