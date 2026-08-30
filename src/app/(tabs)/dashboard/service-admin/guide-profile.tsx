/**
 * Guide Profile Page
 * Guide operator view of their own public profile and working schedule
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../hooks/useTheme';
import { theme } from '../../../../constants/theme';
import { TRANSLATION_KEYS } from '../../../../constants/translationKeys';
import { useGuideAdminLogic } from '../../../../hooks/useGuideAdminLogic';

const DAY_KEYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

export default function GuideProfilePage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const { guide, guideLoading, guideError, actionLoading, fetchMyGuide, saveAvailability } = useGuideAdminLogic();
  const [workingDays, setWorkingDays] = useState<number[]>([]);
  const [dirty, setDirty] = useState(false);

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  useEffect(() => {
    fetchMyGuide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (guide?.workingDays) setWorkingDays(guide.workingDays);
  }, [guide?.workingDays]);

  const toggleDay = (day: number) => {
    setWorkingDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!guide?.id || workingDays.length === 0) return;
    const saved = await saveAvailability(guide.id, { workingDays });
    if (saved) setDirty(false);
  };

  const renderCard = (title: string, children: React.ReactNode) => (
    <View
      style={{
        backgroundColor: surfaceColor,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: textColor, marginBottom: 10 }}>{title}</Text>
      {children}
    </View>
  );

  const renderRow = (label: string, value?: string | null) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ fontSize: 13, color: mutedColor }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: textColor, flexShrink: 1, textAlign: 'right' }}>
        {value || '—'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 pb-4 flex-row items-center">
        <Pressable onPress={() => router.back()} style={{ padding: 6, marginRight: 12 }}>
          <Ionicons name="chevron-back" size={24} color={primaryColor} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-text dark:text-text-dark">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.PROFILE_TITLE)}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-muted-dark">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.PROFILE_SUBTITLE)}
          </Text>
        </View>
      </View>

      {guideLoading && !guide ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : guideError || !guide ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="person-circle-outline" size={64} color={mutedColor} />
          <Text className="mt-4 text-lg font-semibold text-text dark:text-text-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_PROFILE)}
          </Text>
          <Text className="mt-2 text-sm text-muted dark:text-muted-dark text-center">
            {t(TRANSLATION_KEYS.GUIDE_BOOKING.NO_PROFILE_DESC)}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        >
          {/* Identity */}
          <View
            style={{
              backgroundColor: surfaceColor,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: textColor }}>
                {guide.firstName} {guide.lastName}
              </Text>
              {guide.isVerified && <Ionicons name="checkmark-circle" size={18} color={successColor} />}
            </View>
            {guide.location?.name ? (
              <Text style={{ fontSize: 13, color: mutedColor, marginTop: 4 }}>{guide.location.name}</Text>
            ) : null}
            <Text style={{ fontSize: 22, fontWeight: '800', color: primaryColor, marginTop: 10 }}>
              ৳{guide.pricePerDay?.toLocaleString()}
              <Text style={{ fontSize: 13, fontWeight: '500', color: mutedColor }}>
                {' '}
                / {t(TRANSLATION_KEYS.GUIDES.PER_DAY)}
              </Text>
            </Text>
          </View>

          {/* Stats */}
          {renderCard(
            t(TRANSLATION_KEYS.GUIDES.ABOUT),
            <View>
              {guide.bio ? (
                <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 19, marginBottom: 8 }}>
                  {guide.bio}
                </Text>
              ) : null}
              {renderRow(t(TRANSLATION_KEYS.GUIDES.YEARS_LABEL), `${guide.experienceYears ?? 0}`)}
              {renderRow(t(TRANSLATION_KEYS.GUIDES.TOURS_COMPLETED), `${guide.toursCompleted ?? 0}`)}
              {renderRow(t(TRANSLATION_KEYS.GUIDES.MIN_RATING), `${(guide.rating ?? 0).toFixed(1)}`)}
            </View>
          )}

          {/* Contact — visible to the owner only */}
          {renderCard(
            t(TRANSLATION_KEYS.GUIDE_BOOKING.GUIDE_CONTACT),
            <View>
              {renderRow('Email', guide.contactEmail)}
              {renderRow('Phone', guide.phoneNumber)}
              {renderRow(t(TRANSLATION_KEYS.GUIDES.CERTIFICATION), guide.certificationNumber)}
              {renderRow(t(TRANSLATION_KEYS.GUIDES.LICENSE), guide.licenseNumber)}
            </View>
          )}

          {/* Editable working days */}
          {renderCard(
            t(TRANSLATION_KEYS.GUIDES.AVAILABILITY),
            <View>
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 12 }}>
                {DAY_KEYS.map((dayKey, index) => {
                  const isWorking = workingDays.includes(index);
                  return (
                    <TouchableOpacity
                      key={dayKey}
                      onPress={() => toggleDay(index)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: isWorking ? successColor : isDark ? '#374151' : '#f3f4f6',
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '700', color: isWorking ? '#fff' : mutedColor }}>
                        {t(TRANSLATION_KEYS.GUIDES.DAYS[dayKey])}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {guide.workingHoursStart && guide.workingHoursEnd ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="time-outline" size={16} color={mutedColor} />
                  <Text style={{ fontSize: 13, color: mutedColor }}>
                    {guide.workingHoursStart} – {guide.workingHoursEnd}
                  </Text>
                </View>
              ) : null}

              {dirty && (
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={actionLoading || workingDays.length === 0}
                  style={{
                    marginTop: 14,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: primaryColor,
                    opacity: actionLoading || workingDays.length === 0 ? 0.6 : 1,
                  }}
                >
                  {actionLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
                      {t(TRANSLATION_KEYS.COMMON.SAVE)}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Link to requests */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/dashboard/service-admin/guide-requests')}
            style={{
              paddingVertical: 15,
              borderRadius: 14,
              alignItems: 'center',
              backgroundColor: primaryColor,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
              {t(TRANSLATION_KEYS.GUIDE_BOOKING.REQUESTS_TITLE)}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
