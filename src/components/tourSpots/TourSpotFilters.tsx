/**
 * Tour Spot Filters Component
 * Collapsible filter bar for tour spots
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { TourSpotFilters as Filters } from '../../services/api/tourSpots';

interface TourSpotFiltersProps {
  locations?: Array<{ id: string; name: string }>;
  currentFilters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const TOUR_TYPES = ['ADVENTURE', 'CULTURAL', 'BEACH', 'CITY_TOUR', 'NATURE', 'RELIGIOUS', 'HISTORICAL', 'MIXED'];
const RATING_OPTIONS = [
  { value: undefined, label: 'All' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

export function TourSpotFilters({ locations = [], currentFilters, onFilterChange }: TourSpotFiltersProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const activeCount = [
    currentFilters.locationId,
    currentFilters.isPopular,
    currentFilters.minRating,
  ].filter((v) => v !== undefined && v !== null).length;

  const updateFilter = (key: keyof Filters, value: any) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <View style={{ backgroundColor: surfaceColor, borderBottomWidth: 1, borderBottomColor: borderColor }}>
      {/* Toggle Button */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="filter" size={20} color={primaryColor} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: textColor }}>
            {t(TRANSLATION_KEYS.TOUR_SPOTS.FILTER_BY)}
          </Text>
          {activeCount > 0 && (
            <View style={{ backgroundColor: primaryColor, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{activeCount}</Text>
            </View>
          )}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={mutedColor} />
      </TouchableOpacity>

      {/* Filter Options */}
      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {/* Location Filter */}
          {locations.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: mutedColor, marginBottom: 8 }}>
                {t(TRANSLATION_KEYS.TOUR_SPOTS.LOCATION)}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={() => updateFilter('locationId', undefined)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: !currentFilters.locationId ? primaryColor : isDark ? '#374151' : '#f3f4f6',
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: !currentFilters.locationId ? '#fff' : textColor }}>
                    {t(TRANSLATION_KEYS.TOUR_SPOTS.ALL_LOCATIONS)}
                  </Text>
                </TouchableOpacity>
                {locations.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    onPress={() => updateFilter('locationId', loc.id)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: currentFilters.locationId === loc.id ? primaryColor : isDark ? '#374151' : '#f3f4f6',
                      marginRight: 8,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: currentFilters.locationId === loc.id ? '#fff' : textColor }}>
                      {loc.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Minimum Rating Filter */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: mutedColor, marginBottom: 8 }}>
              {t(TRANSLATION_KEYS.TOUR_SPOTS.MIN_RATING)}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {RATING_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  onPress={() => updateFilter('minRating', option.value)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: currentFilters.minRating === option.value ? primaryColor : isDark ? '#374151' : '#f3f4f6',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: currentFilters.minRating === option.value ? '#fff' : textColor }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Only Toggle */}
          <View style={{ marginBottom: 8 }}>
            <TouchableOpacity
              onPress={() => updateFilter('isPopular', currentFilters.isPopular ? undefined : true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: currentFilters.isPopular ? primaryColor : borderColor,
                  backgroundColor: currentFilters.isPopular ? primaryColor : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {currentFilters.isPopular && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={{ fontSize: 14, color: textColor }}>
                {t(TRANSLATION_KEYS.TOUR_SPOTS.POPULAR_ONLY)}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Clear Button */}
          {activeCount > 0 && (
            <TouchableOpacity
              onPress={clearFilters}
              style={{
                marginTop: 8,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: isDark ? '#374151' : '#f3f4f6',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: primaryColor }}>
                {t(TRANSLATION_KEYS.TOUR_SPOTS.CLEAR_FILTERS)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
