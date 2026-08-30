/**
 * Guide Detail View Component
 * Full guide profile with availability, specializations and recent reviews
 */

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';
import { Guide } from '../../types/guides';

interface GuideDetailViewProps {
  guide: Guide;
  onRequestGuide?: () => void;
}

const DAY_KEYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export function GuideDetailView({ guide, onRequestGuide }: GuideDetailViewProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const warningColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const fullName = `${guide.firstName} ${guide.lastName}`.trim();
  const initials = `${guide.firstName?.[0] ?? ''}${guide.lastName?.[0] ?? ''}`.toUpperCase();
  const heroUrl = guide.images?.[0]?.url;

  const renderSection = (title: string, children: React.ReactNode) => (
    <View
      style={{
        backgroundColor: surfaceColor,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: textColor, marginBottom: 12 }}>{title}</Text>
      {children}
    </View>
  );

  const renderStat = (icon: keyof typeof Ionicons.glyphMap, value: string, label: string) => (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Ionicons name={icon} size={18} color={primaryColor} />
      <Text style={{ fontSize: 16, fontWeight: '700', color: textColor, marginTop: 4 }}>{value}</Text>
      <Text style={{ fontSize: 11, color: mutedColor, textAlign: 'center', marginTop: 2 }}>{label}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Hero */}
      <View style={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 }}>
        {heroUrl ? (
          <Image source={{ uri: heroUrl }} style={{ width: 112, height: 112, borderRadius: 56 }} resizeMode="cover" />
        ) : (
          <View
            style={{
              width: 112,
              height: 112,
              borderRadius: 56,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: `${primaryColor}1A`,
            }}
          >
            <Text style={{ fontSize: 36, fontWeight: '700', color: primaryColor }}>{initials || '?'}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: textColor }}>{fullName}</Text>
          {guide.isVerified && <Ionicons name="checkmark-circle" size={20} color={successColor} />}
        </View>

        {guide.location?.name && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <Ionicons name="location" size={15} color={primaryColor} />
            <Text style={{ fontSize: 14, color: mutedColor }}>{guide.location.name}</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <Ionicons name="star" size={16} color={warningColor} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: textColor }}>
            {(guide.rating ?? 0).toFixed(1)}
          </Text>
          <Text style={{ fontSize: 13, color: mutedColor }}>
            ({t(TRANSLATION_KEYS.GUIDES.REVIEWS_COUNT, { count: guide._count?.reviews ?? 0 })})
          </Text>
        </View>

        <Text style={{ fontSize: 24, fontWeight: '800', color: primaryColor, marginTop: 12 }}>
          ৳{guide.pricePerDay?.toLocaleString()}
          <Text style={{ fontSize: 13, fontWeight: '500', color: mutedColor }}>
            {' '}
            / {t(TRANSLATION_KEYS.GUIDES.PER_DAY)}
          </Text>
        </Text>

        {!guide.isActive && (
          <View
            style={{
              marginTop: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: `${theme.colors.error}1A`,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.colors.error, textAlign: 'center' }}>
              {t(TRANSLATION_KEYS.GUIDES.INACTIVE_NOTICE)}
            </Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: surfaceColor,
          borderRadius: 16,
          paddingVertical: 16,
          marginHorizontal: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor,
        }}
      >
        {renderStat('briefcase-outline', `${guide.experienceYears ?? 0}`, t(TRANSLATION_KEYS.GUIDES.YEARS_LABEL))}
        {renderStat('flag-outline', `${guide.toursCompleted ?? 0}`, t(TRANSLATION_KEYS.GUIDES.TOURS_COMPLETED))}
        {renderStat('people-outline', `${guide._count?.bookings ?? 0}`, t(TRANSLATION_KEYS.GUIDES.BOOKINGS_LABEL))}
      </View>

      {/* About */}
      {guide.bio
        ? renderSection(
            t(TRANSLATION_KEYS.GUIDES.ABOUT),
            <Text style={{ fontSize: 14, color: mutedColor, lineHeight: 21 }}>{guide.bio}</Text>
          )
        : null}

      {/* Specializations */}
      {guide.specializations?.length
        ? renderSection(
            t(TRANSLATION_KEYS.GUIDES.SPECIALIZES_IN),
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {guide.specializations.map((type) => (
                <View
                  key={type}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: `${primaryColor}14` }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: primaryColor }}>
                    {t(TRANSLATION_KEYS.GUIDES.TYPES[type as keyof typeof TRANSLATION_KEYS.GUIDES.TYPES] || TRANSLATION_KEYS.GUIDES.TYPES.MIXED)}
                  </Text>
                </View>
              ))}
            </View>
          )
        : null}

      {/* Languages */}
      {guide.languages?.length
        ? renderSection(
            t(TRANSLATION_KEYS.GUIDES.SPEAKS),
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {guide.languages.map((lang) => (
                <View
                  key={lang}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: isDark ? '#374151' : '#f3f4f6' }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: textColor }}>
                    {t(TRANSLATION_KEYS.GUIDES.LANGUAGES[lang as keyof typeof TRANSLATION_KEYS.GUIDES.LANGUAGES] || lang)}
                  </Text>
                </View>
              ))}
            </View>
          )
        : null}

      {/* Availability */}
      {renderSection(
        t(TRANSLATION_KEYS.GUIDES.AVAILABILITY),
        <View>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
            {DAY_KEYS.map((dayKey, index) => {
              const isWorking = guide.workingDays?.includes(index);
              return (
                <View
                  key={dayKey}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 8,
                    alignItems: 'center',
                    backgroundColor: isWorking ? `${successColor}1A` : isDark ? '#374151' : '#f3f4f6',
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: isWorking ? successColor : mutedColor }}>
                    {t(TRANSLATION_KEYS.GUIDES.DAYS[dayKey])}
                  </Text>
                </View>
              );
            })}
          </View>

          {guide.workingHoursStart && guide.workingHoursEnd && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="time-outline" size={16} color={mutedColor} />
              <Text style={{ fontSize: 13, color: mutedColor }}>
                {guide.workingHoursStart} – {guide.workingHoursEnd}
              </Text>
            </View>
          )}

          {guide.availabilityStatus ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Ionicons name="ellipse" size={10} color={successColor} />
              <Text style={{ fontSize: 13, color: mutedColor }}>{guide.availabilityStatus}</Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Credentials */}
      {guide.certificationNumber || guide.licenseNumber
        ? renderSection(
            t(TRANSLATION_KEYS.GUIDES.CREDENTIALS),
            <View style={{ gap: 8 }}>
              {guide.certificationNumber ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="ribbon-outline" size={16} color={primaryColor} />
                  <Text style={{ fontSize: 13, color: mutedColor }}>
                    {t(TRANSLATION_KEYS.GUIDES.CERTIFICATION)}: {guide.certificationNumber}
                  </Text>
                </View>
              ) : null}
              {guide.licenseNumber ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="card-outline" size={16} color={primaryColor} />
                  <Text style={{ fontSize: 13, color: mutedColor }}>
                    {t(TRANSLATION_KEYS.GUIDES.LICENSE)}: {guide.licenseNumber}
                  </Text>
                </View>
              ) : null}
            </View>
          )
        : null}

      {/* Reviews */}
      {guide.reviews?.length
        ? renderSection(
            t(TRANSLATION_KEYS.GUIDES.RECENT_REVIEWS),
            <View style={{ gap: 14 }}>
              {guide.reviews.slice(0, 5).map((review) => (
                <View key={review.id} style={{ borderTopWidth: 1, borderTopColor: borderColor, paddingTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: textColor }}>
                      {review.user?.userName ?? 'Traveler'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="star" size={13} color={warningColor} />
                      <Text style={{ fontSize: 12, fontWeight: '600', color: textColor }}>{review.rating}</Text>
                    </View>
                  </View>
                  {review.comment ? (
                    <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 19, marginTop: 4 }}>
                      {review.comment}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          )
        : null}

      {/* Contact privacy notice */}
      <View style={{ marginHorizontal: 16, marginBottom: 16, flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
        <Ionicons name="lock-closed-outline" size={14} color={mutedColor} style={{ marginTop: 2 }} />
        <Text style={{ fontSize: 12, color: mutedColor, flex: 1, lineHeight: 17 }}>
          {t(TRANSLATION_KEYS.GUIDES.CONTACT_HIDDEN)}
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        onPress={onRequestGuide}
        disabled={!guide.isActive}
        style={{
          marginHorizontal: 16,
          paddingVertical: 15,
          borderRadius: 14,
          alignItems: 'center',
          backgroundColor: guide.isActive ? primaryColor : isDark ? '#374151' : '#e5e7eb',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '700', color: guide.isActive ? '#fff' : mutedColor }}>
          {t(TRANSLATION_KEYS.GUIDES.REQUEST_GUIDE)}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
