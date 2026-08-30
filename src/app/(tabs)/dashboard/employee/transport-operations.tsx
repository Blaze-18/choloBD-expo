import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import theme from '@/constants/theme';
import { TRANSLATION_KEYS } from '@/constants/translationKeys';
import { AdminCard } from '@/components/ui/adminCard';

type TransportTab = 'seat-plan' | 'operations' | 'checkin' | 'maintenance';

export default function TransportOperationsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TransportTab>('seat-plan');

  const tabs = [
    {
      id: 'seat-plan' as TransportTab,
      label: t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_EMPLOYEE.SEAT_PLAN),
      icon: 'grid-outline',
    },
    {
      id: 'operations' as TransportTab,
      label: t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_EMPLOYEE.RIDE_OPERATIONS),
      icon: 'bus-outline',
    },
    {
      id: 'checkin' as TransportTab,
      label: t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_EMPLOYEE.TICKET_CHECKIN),
      icon: 'checkmark-circle-outline',
    },
    {
      id: 'maintenance' as TransportTab,
      label: t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_EMPLOYEE.MAINTENANCE),
      icon: 'construct-outline',
    },
  ];

  const renderContent = () => {
    return (
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
          This feature will be available soon.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-8 pb-4">
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 6, marginBottom: 12 }}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color={isDark ? theme.colors['text-dark'] : theme.colors.text} />
          </Pressable>
          
          <Text className="text-sm text-muted dark:text-muted-dark">
            Employee Dashboard
          </Text>
          <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_EMPLOYEE.TITLE)}
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.DASHBOARD.TRANSPORT_EMPLOYEE.SUBTITLE)}
          </Text>
        </View>

        {/* Tab Buttons */}
        <View className="px-6 pb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  className="flex-row items-center px-4 py-2 rounded-full mr-2"
                  style={{
                    backgroundColor: isActive
                      ? isDark ? theme.colors['primary-dark'] : theme.colors.primary
                      : isDark ? theme.colors['surface-dark'] : '#f3f4f6',
                    borderWidth: 1,
                    borderColor: isActive
                      ? isDark ? theme.colors['primary-dark'] : theme.colors.primary
                      : isDark ? theme.colors['border-dark'] : theme.colors.border,
                  }}
                >
                  <Ionicons
                    name={tab.icon as any}
                    size={16}
                    color={isActive ? '#ffffff' : isDark ? theme.colors['text-dark'] : theme.colors.text}
                  />
                  <Text
                    className="ml-2 text-sm font-semibold"
                    style={{
                      color: isActive ? '#ffffff' : isDark ? theme.colors['text-dark'] : theme.colors.text,
                    }}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Content */}
        <View className="px-6 pb-6">
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
