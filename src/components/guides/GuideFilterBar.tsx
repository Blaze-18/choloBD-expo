/**
 * Guide Filter Bar Component
 * Collapsible filter bar for the guide browse list
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { GuideFilters, Language, TourType } from '../../types/guides';

interface GuideFilterBarProps {
  locations?: Array<{ id: string; name: string }>;
  currentFilters: GuideFilters;
  onFilterChange: (filters: GuideFilters) => void;
}

const TOUR_TYPES: TourType[] = [
  'ADVENTURE',
  'CULTURAL',
  'BEACH',
  'CITY_TOUR',
  'NATURE',
  'RELIGIOUS',
  'HISTORICAL',
  'MIXED',
];

/** Languages travellers most commonly filter by; the full enum is far longer. */
const COMMON_LANGUAGES: Language[] = ['ENGLISH', 'BENGALI', 'HINDI', 'ARABIC', 'FRENCH', 'GERMAN', 'JAPANESE'];

const RATING_OPTIONS: Array<{ value: number | undefined; label: string }> = [
  { value: undefined, label: 'All' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

export function GuideFilterBar({ locations = [], currentFilters, onFilterChange }: GuideFilterBarProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const chipIdleColor = isDark ? '#374151' : '#f3f4f6';

  const activeCount = [
    currentFilters.locationId,
    currentFilters.specialization,
    currentFilters.language,
    currentFilters.minRating,
    currentFilters.isVerified,
  ].filter((v) => v !== undefined && v !== null).length;

  const updateFilter = (key: keyof GuideFilters, value: any) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const clearFilters = () => onFilterChange({});

  const renderChip = (key: string, label: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={key}
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: selected ? primaryColor : chipIdleColor,
        marginRight: 8,
      }}
    >
      <Text style={{ fontSize: 13, fontWeight: '600', color: selected ? '#fff' : textColor }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: surfaceColor, borderBottomWidth: 1, borderBottomColor: borderColor }}>
      {/* Toggle */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="filter" size={20} color={primaryColor} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: textColor }}>
            {t(TRANSLATION_KEYS.GUIDES.FILTER_BY)}
          </Text>
          {activeCount > 0 && (
            <View style={{ backgroundColor: primaryColor, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{activeCount}</Text>
            </View>
          )}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={mutedColor} />
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          {/* Location */}
          {locations.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: mutedColor, marginBottom: 8 }}>
                {t(TRANSLATION_KEYS.GUIDES.LOCATION)}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderChip('loc-all', t(TRANSLATION_KEYS.GUIDES.ALL_LOCATIONS), !currentFilters.locationId, () =>
                  updateFilter('locationId', undefined)
                )}
                {locations.map((loc) =>
                  renderChip(loc.id, loc.name, currentFilters.locationId === loc.id, () =>
                    updateFilter('locationId', loc.id)
                  )
                )}
              </ScrollView>
            </View>
          )}

          {/* Specialization */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: mutedColor, marginBottom: 8 }}>
              {t(TRANSLATION_KEYS.GUIDES.SPECIALIZATION)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderChip('spec-all', t(TRANSLATION_KEYS.GUIDES.ALL_SPECIALIZATIONS), !currentFilters.specialization, () =>
                updateFilter('specialization', undefined)
              )}
              {TOUR_TYPES.map((type) =>
                renderChip(
                  type,
                  t(TRANSLATION_KEYS.GUIDES.TYPES[type]),
                  currentFilters.specialization === type,
                  () => updateFilter('specialization', type)
                )
              )}
            </ScrollView>
          </View>

          {/* Language */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: mutedColor, marginBottom: 8 }}>
              {t(TRANSLATION_KEYS.GUIDES.LANGUAGE)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderChip('lang-all', t(TRANSLATION_KEYS.GUIDES.ALL_LANGUAGES), !currentFilters.language, () =>
                updateFilter('language', undefined)
              )}
              {COMMON_LANGUAGES.map((lang) =>
                renderChip(
                  lang,
                  t(TRANSLATION_KEYS.GUIDES.LANGUAGES[lang]),
                  currentFilters.language === lang,
                  () => updateFilter('language', lang)
                )
              )}
            </ScrollView>
          </View>

          {/* Minimum rating */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: mutedColor, marginBottom: 8 }}>
              {t(TRANSLATION_KEYS.GUIDES.MIN_RATING)}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {RATING_OPTIONS.map((option) =>
                renderChip(option.label, option.label, currentFilters.minRating === option.value, () =>
                  updateFilter('minRating', option.value)
                )
              )}
            </View>
          </View>

          {/* Verified only */}
          <TouchableOpacity
            onPress={() => updateFilter('isVerified', currentFilters.isVerified ? undefined : true)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: currentFilters.isVerified ? primaryColor : borderColor,
                backgroundColor: currentFilters.isVerified ? primaryColor : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {currentFilters.isVerified && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={{ fontSize: 14, color: textColor }}>
              {t(TRANSLATION_KEYS.GUIDES.VERIFIED_ONLY)}
            </Text>
          </TouchableOpacity>

          {/* Clear */}
          {activeCount > 0 && (
            <TouchableOpacity
              onPress={clearFilters}
              style={{ marginTop: 8, paddingVertical: 10, borderRadius: 8, backgroundColor: chipIdleColor, alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: primaryColor }}>
                {t(TRANSLATION_KEYS.GUIDES.CLEAR_FILTERS)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
