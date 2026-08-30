/**
 * Guides List Page
 * Nested page under explore for browsing and searching local guides
 */

import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { useFetchGuides } from '../../../hooks/useFetchGuides';
import { useFetchLocations } from '../../../hooks/useFetchLocations';
import { GuideListCard, GuideFilterBar } from '../../../components/guides';
import { Guide, GuideFilters } from '../../../types/guides';

export default function GuidesListPage() {
  const router = useRouter();
  const { fromHome } = useLocalSearchParams<{ fromHome?: string }>();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const [filters, setFilters] = useState<GuideFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { guides, total, isLoading, error, refetch } = useFetchGuides(filters, searchTerm);
  const { locations } = useFetchLocations();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const handleBack = () => {
    if (fromHome === 'true') {
      router.replace('/(tabs)');
    } else {
      router.back();
    }
  };

  const handleGuidePress = (guide: Guide) => {
    router.push({
      pathname: '/(tabs)/explore/guide-detail',
      params: { id: guide.id },
    });
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <Ionicons name="people-outline" size={64} color={mutedColor} />
      <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
        {t(TRANSLATION_KEYS.GUIDES.NO_GUIDES)}
      </Text>
      <Text className="mt-2 text-sm text-muted dark:text-muted-dark text-center">
        {t(TRANSLATION_KEYS.GUIDES.NO_GUIDES_DESC)}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
      <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">{error}</Text>
      <TouchableOpacity
        onPress={refetch}
        style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: primaryColor, borderRadius: 8 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>{t(TRANSLATION_KEYS.GUIDES.TRY_AGAIN)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-4 flex-row items-center">
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-3xl font-bold font-heading text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.GUIDES.TITLE)}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDES.SUBTITLE)}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View className="px-6 pb-3">
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: surfaceColor,
            borderWidth: 1,
            borderColor,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Ionicons name="search" size={18} color={mutedColor} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder={t(TRANSLATION_KEYS.GUIDES.SEARCH_PLACEHOLDER)}
            placeholderTextColor={mutedColor}
            style={{ flex: 1, color: textColor, padding: 0 }}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={18} color={mutedColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <GuideFilterBar locations={locations} currentFilters={filters} onFilterChange={setFilters} />

      {/* Results count */}
      {!isLoading && !error && guides.length > 0 && (
        <View className="px-6 py-2">
          <Text className="text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDES.RESULTS_COUNT, { count: total || guides.length })}
          </Text>
        </View>
      )}

      {/* Content */}
      {error ? (
        renderErrorState()
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
          <Text className="mt-4 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDES.LOADING)}
          </Text>
        </View>
      ) : (
        <FlatList
          data={guides}
          renderItem={({ item }) => (
            <View className="px-4">
              <GuideListCard guide={item} onPress={() => handleGuidePress(item)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={primaryColor} />}
        />
      )}
    </SafeAreaView>
  );
}
