import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface Location {
  id: string;
  name: string;
}

interface ExploreSearchFormProps {
  locations: Location[];
  loadingLocations: boolean;
  onSearch: (filters: { locationId: string }) => void;
  searching?: boolean;
}

export function ExploreSearchForm({
  locations,
  loadingLocations,
  onSearch,
  searching = false,
}: ExploreSearchFormProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;

  const handleSearch = () => {
    if (!selectedLocationId) {
      alert(t(TRANSLATION_KEYS.COMMON.CANCEL));
      return;
    }

    onSearch({
      locationId: selectedLocationId,
    });
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  return (
    <View className="p-4 mb-6 bg-white border shadow dark:bg-surface-dark rounded-xl border-border dark:border-border-dark">
      {/* Location Picker */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-semibold text-text dark:text-text-dark">{t(TRANSLATION_KEYS.EXPLORE.SELECT_LOCATION)}</Text>
        <TouchableOpacity
          onPress={() => setShowLocationPicker(!showLocationPicker)}
          className="flex-row items-center justify-between p-3 border rounded-lg border-border dark:border-border-dark bg-background dark:bg-background-dark"
        >
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color={primaryColor} style={{ marginRight: 8 }} />
            <Text className={selectedLocationId ? 'text-text dark:text-text-dark font-medium' : 'text-muted dark:text-muted-dark'}>
              {selectedLocation?.name || t(TRANSLATION_KEYS.EXPLORE.CHOOSE_LOCATION)}
            </Text>
          </View>
          <Ionicons name={showLocationPicker ? 'chevron-up' : 'chevron-down'} size={20} color={primaryColor} />
        </TouchableOpacity>

        {showLocationPicker && (
          <View className="mt-2 overflow-hidden bg-white border rounded-lg border-border dark:border-border-dark dark:bg-surface-dark max-h-64">
            {loadingLocations ? (
              <View className="items-center p-4">
                <ActivityIndicator size="small" color={primaryColor} />
              </View>
            ) : locations.length === 0 ? (
              <View className="items-center p-4">
                <Text className="text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.EXPLORE.NO_LOCATIONS)}</Text>
              </View>
            ) : (
              <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 256 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
                {locations.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => {
                      setSelectedLocationId(location.id);
                      setShowLocationPicker(false);
                    }}
                    className={`p-4 border-b border-border dark:border-border-dark ${
                      selectedLocationId === location.id ? 'bg-primary/10 dark:bg-primary/20' : ''
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={16} color={primaryColor} style={{ marginRight: 8 }} />
                      <Text className="flex-1 font-medium text-text dark:text-text-dark">{location.name}</Text>
                      {selectedLocationId === location.id && (
                        <Ionicons name="checkmark" size={18} color={primaryColor} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity
        onPress={handleSearch}
        disabled={searching || !selectedLocationId}
        className={`mt-2 p-4 rounded-lg flex-row items-center justify-center ${
          searching || !selectedLocationId
            ? 'bg-primary/50 dark:bg-primary-dark/50'
            : 'bg-primary dark:bg-primary-dark'
        }`}
      >
        {searching ? (
          <ActivityIndicator size="small" color={onPrimaryColor} style={{ marginRight: 8 }} />
        ) : (
          <Ionicons name="search" size={18} color={onPrimaryColor} style={{ marginRight: 8 }} />
        )}
        <Text className="font-bold text-white">{searching ? t(TRANSLATION_KEYS.EXPLORE.SEARCHING) : t(TRANSLATION_KEYS.EXPLORE.FIND_HOTELS)}</Text>
      </TouchableOpacity>
    </View>
  );
}
