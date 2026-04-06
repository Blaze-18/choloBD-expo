import React from 'react';
import { View, Text } from 'react-native';

export default function AppBrandSection() {
  return (
    <View className="flex-row items-center gap-2">
      {/* App Logo Placeholder */}
      <View className="w-9 h-9 rounded-lg bg-blue-600 items-center justify-center">
        <Text className="text-white font-bold text-lg">C</Text>
      </View>

      {/* App Name */}
      <Text className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
        CholoBD
      </Text>
    </View>
  );
}
