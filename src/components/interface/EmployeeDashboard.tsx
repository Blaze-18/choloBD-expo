import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../providers/LanguageProvider';
import { useTheme } from '../../hooks/useTheme';
import { UserInfoUI } from '../ui/userInfoUI';
import { AdminCard } from '../ui/adminCard';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface EmployeeDashboardProps {
  userName?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
  userStatus?: string;
  onLogout: () => void;
}

export function EmployeeDashboard({
  userName,
  email,
  imageUrl,
  role,
  userStatus,
  onLogout,
}: EmployeeDashboardProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} refreshControl={undefined}>
        <View className="px-6 pt-8 pb-2">
          <Text className="text-sm text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.DASHBOARD.WELCOME_BACK)}</Text>
          <Text className="mt-1 text-3xl font-bold font-heading text-text dark:text-text-dark">{t(TRANSLATION_KEYS.DASHBOARD.EMPLOYEE_TITLE)}</Text>
        </View>

        <View className="px-6 pb-8">
          <UserInfoUI
            userName={userName}
            email={email}
            imageUrl={imageUrl}
            role={role}
            userStatus={userStatus}
            onLogout={onLogout}
          />

          <View className="mt-6 space-y-3">
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.EMPLOYEE_CARDS.HOTEL_OPERATIONS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.EMPLOYEE_CARDS.HOTEL_OPERATIONS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/employee/hotel-operations')}
            />
            <AdminCard
              title={t(TRANSLATION_KEYS.DASHBOARD.EMPLOYEE_CARDS.TRANSPORT_OPERATIONS)}
              subtitle={t(TRANSLATION_KEYS.DASHBOARD.EMPLOYEE_CARDS.TRANSPORT_OPERATIONS_DESC)}
              onPress={() => router.push('/(tabs)/dashboard/employee/transport-operations')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default EmployeeDashboard;
