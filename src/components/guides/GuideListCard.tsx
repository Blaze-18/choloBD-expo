/**
 * Guide List Card Component
 * Card for displaying guides in the browse list
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { Guide } from '../../types/guides';

interface GuideListCardProps {
  guide: Guide;
  onPress?: () => void;
}

export function GuideListCard({ guide, onPress }: GuideListCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const warningColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  const avatarUrl = guide.images?.[0]?.url;
  const fullName = `${guide.firstName} ${guide.lastName}`.trim();
  const initials = `${guide.firstName?.[0] ?? ''}${guide.lastName?.[0] ?? ''}`.toUpperCase();

  const specializationLabels = (guide.specializations ?? []).slice(0, 3).map((type) =>
    t(TRANSLATION_KEYS.GUIDES.TYPES[type as keyof typeof TRANSLATION_KEYS.GUIDES.TYPES] || TRANSLATION_KEYS.GUIDES.TYPES.MIXED)
  );

  const languageLabels = (guide.languages ?? []).slice(0, 3).map((lang) =>
    t(TRANSLATION_KEYS.GUIDES.LANGUAGES[lang as keyof typeof TRANSLATION_KEYS.GUIDES.LANGUAGES] || lang)
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-4 overflow-hidden rounded-2xl"
      style={{
        backgroundColor: surfaceColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="p-4">
        <View style={{ flexDirection: 'row', gap: 14 }}>
          {/* Avatar */}
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 72, height: 72, borderRadius: 36 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: `${primaryColor}1A`,
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: '700', color: primaryColor }}>
                {initials || '?'}
              </Text>
            </View>
          )}

          {/* Headline info */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: textColor, flexShrink: 1 }} numberOfLines={1}>
                {fullName}
              </Text>
              {guide.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color={successColor} />
              )}
            </View>

            {guide.location?.name && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="location" size={14} color={primaryColor} />
                <Text style={{ fontSize: 13, color: mutedColor, flex: 1 }} numberOfLines={1}>
                  {guide.location.name}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={14} color={warningColor} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }}>
                  {(guide.rating ?? 0).toFixed(1)}
                </Text>
                <Text style={{ fontSize: 12, color: mutedColor }}>
                  ({guide._count?.reviews ?? 0})
                </Text>
              </View>

              {guide.experienceYears > 0 && (
                <Text style={{ fontSize: 12, color: mutedColor }}>
                  {t(TRANSLATION_KEYS.GUIDES.YEARS_EXPERIENCE, { count: guide.experienceYears })}
                </Text>
              )}
            </View>
          </View>

          {/* Price */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: primaryColor }}>
              ৳{guide.pricePerDay?.toLocaleString()}
            </Text>
            <Text style={{ fontSize: 11, color: mutedColor }}>
              {t(TRANSLATION_KEYS.GUIDES.PER_DAY)}
            </Text>
          </View>
        </View>

        {/* Bio */}
        {guide.bio ? (
          <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 18, marginTop: 12 }} numberOfLines={2}>
            {guide.bio}
          </Text>
        ) : null}

        {/* Specialization chips */}
        {specializationLabels.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
            {specializationLabels.map((label) => (
              <View
                key={label}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: `${primaryColor}14`,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: primaryColor }}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languageLabels.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={mutedColor} />
            <Text style={{ fontSize: 12, color: mutedColor, flex: 1 }} numberOfLines={1}>
              {languageLabels.join(' · ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
