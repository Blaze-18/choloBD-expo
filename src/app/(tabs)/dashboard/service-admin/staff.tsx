import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DUMMY_STAFF = [
  { id: 's1', name: 'Emma Brown', role: 'Manager' },
  { id: 's2', name: 'Liam Smith', role: 'Reception' },
];

export default function StaffPage() {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        <Pressable onPress={() => router.replace('/(tabs)/dashboard')} style={{ padding: 6 }}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>

        <Text className="text-2xl font-bold mt-2 text-text dark:text-text-dark">Employees</Text>
        <Text className="mt-1 text-sm text-muted dark:text-muted-dark">List of staff and designations</Text>

        <FlatList
          className="mt-6"
          data={DUMMY_STAFF}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View className="p-4 mb-3 bg-white rounded-xl border border-border dark:bg-surface-dark dark:border-border-dark">
              <Text className="font-semibold text-text dark:text-text-dark">{item.name}</Text>
              <Text className="text-sm text-muted dark:text-muted-dark">{item.role}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
