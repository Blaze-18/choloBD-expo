/**
 * Guide Detail Page
 * Public guide profile with the entry point into the booking flow
 */

import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { useFetchGuideDetail } from '../../../hooks/useFetchGuideDetail';
import { GuideDetailView } from '../../../components/guides';

export default function GuideDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const { guide, isLoading, error, refetch } = useFetchGuideDetail(id);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  const handleRequestGuide = () => {
    if (!guide) return;
    router.push({
      pathname: '/(tabs)/explore/guide-booking',
      params: { id: guide.id },
    });
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-2 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-text dark:text-text-dark">
          {t(TRANSLATION_KEYS.GUIDES.TITLE)}
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text className="mt-4 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDES.LOADING)}
          </Text>
        </View>
      ) : error || !guide ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="person-circle-outline" size={64} color={mutedColor} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
            {error || t(TRANSLATION_KEYS.GUIDES.GUIDE_NOT_FOUND)}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: primaryColor, borderRadius: 8 }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>{t(TRANSLATION_KEYS.GUIDES.TRY_AGAIN)}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <GuideDetailView guide={guide} onRequestGuide={handleRequestGuide} />
      )}
    </SafeAreaView>
  );
}
