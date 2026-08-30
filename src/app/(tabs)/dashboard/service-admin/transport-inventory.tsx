import React from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';

export default function TransportInventoryScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => router.back()}
          style={{ padding: 6, marginBottom: 12 }}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
        </Pressable>

        <Text className="text-2xl font-bold text-text dark:text-text-dark mb-2">
          {t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_MANAGEMENT)}
        </Text>
        <Text className="text-sm text-muted dark:text-muted-dark mb-6">
          {t(TRANSLATION_KEYS.DASHBOARD.ADMIN_CARDS.TRANSPORT_MANAGEMENT_DESC)}
        </Text>

        <View className="p-6 bg-white border rounded-xl dark:bg-surface-dark border-border dark:border-border-dark items-center">
          <Ionicons
            name="construct-outline"
            size={48}
            color={isDark ? theme.colors['muted-dark'] : theme.colors.muted}
          />
          <Text className="mt-4 text-base font-semibold text-text dark:text-text-dark">
            Feature Under Development
          </Text>
          <Text className="mt-2 text-sm text-center text-muted dark:text-muted-dark">
            Vehicle and inventory management features will be available soon.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
