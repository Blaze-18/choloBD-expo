import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';

export function MaintenanceTab() {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 p-6">
      <Text className="mb-4 text-lg font-semibold text-text dark:text-text-dark">
        Maintenance Tasks
      </Text>

      <View className="items-center justify-center py-12">
        <Ionicons
          name="construct-outline"
          size={64}
          color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
        />
        <Text className="mt-4 text-lg font-semibold text-center text-text dark:text-text-dark">
          Feature Under Development
        </Text>
        <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark px-12">
          Maintenance task tracking will be available soon
        </Text>
      </View>
    </View>
  );
}
