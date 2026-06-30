import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TourPackage, TourType } from '../../types/tours';

const TOUR_TYPE_LABELS: Record<TourType, string> = {
  ADVENTURE: 'Adventure',
  CULTURAL: 'Cultural',
  BEACH: 'Beach',
  CITY_TOUR: 'City Tour',
  NATURE: 'Nature',
  RELIGIOUS: 'Religious',
  HISTORICAL: 'Historical',
  MIXED: 'Mixed',
};

const TOUR_TYPE_COLORS: Record<TourType, { bg: string; bgDark: string; icon: string }> = {
  ADVENTURE: { bg: '#FFF3E0', bgDark: '#3f2c1e', icon: '#F57C00' },
  CULTURAL: { bg: '#F3E5F5', bgDark: '#312e58', icon: '#7B1FA2' },
  BEACH: { bg: '#E0F7FA', bgDark: '#1a3540', icon: '#0097A7' },
  CITY_TOUR: { bg: '#E0F2F1', bgDark: '#1a3530', icon: '#00796B' },
  NATURE: { bg: '#E8F5E9', bgDark: '#1e3a28', icon: '#388E3C' },
  RELIGIOUS: { bg: '#E8EAF6', bgDark: '#252b50', icon: '#3949AB' },
  HISTORICAL: { bg: '#FBE9E7', bgDark: '#3d1f1a', icon: '#BF360C' },
  MIXED: { bg: '#E3F2FD', bgDark: '#1e3a5f', icon: '#1565C0' },
};

const TOUR_TYPE_ICONS: Record<TourType, keyof typeof Ionicons.glyphMap> = {
  ADVENTURE: 'trail-sign',
  CULTURAL: 'business',
  BEACH: 'water',
  CITY_TOUR: 'map',
  NATURE: 'leaf',
  RELIGIOUS: 'star',
  HISTORICAL: 'library',
  MIXED: 'globe',
};

interface TourPackageCardProps {
  tourPackage: TourPackage;
  onPress?: () => void;
}

export default function TourPackageCard({ tourPackage, onPress }: TourPackageCardProps) {
  const { isDark } = useTheme();

  const cardBgColor = isDark ? theme.colors['surface-2-dark'] : theme.colors.surface;
  const textColorPrimary = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const textColorMuted = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const warningColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const typeColors = TOUR_TYPE_COLORS[tourPackage.tourType] || TOUR_TYPE_COLORS.MIXED;
  const headerBg = isDark ? typeColors.bgDark : typeColors.bg;
  const iconColor = typeColors.icon;
  const iconName = TOUR_TYPE_ICONS[tourPackage.tourType] || 'globe';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mr-4"
      style={{ width: 260 }}
    >
      <View
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: cardBgColor,
          borderWidth: 1,
          borderColor: isDark ? theme.colors['border-dark'] : theme.colors.border,
          height: 270,
          ...theme.elevation.sm,
        }}
      >
        {/* Coloured Header */}
        <View
          style={{
            height: 120,
            backgroundColor: headerBg,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <Ionicons name={iconName} size={52} color={iconColor} style={{ opacity: 0.85 }} />

          {/* Tour Type Badge */}
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: isDark ? theme.colors['surface-dark'] : '#fff',
              borderRadius: 9999,
              paddingHorizontal: 10,
              paddingVertical: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: iconColor }}>
              {TOUR_TYPE_LABELS[tourPackage.tourType] || tourPackage.tourType}
            </Text>
          </View>

          {/* Popular Badge */}
          {tourPackage.isPopular && (
            <View
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                backgroundColor: warningColor,
                borderRadius: 9999,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>HOT</Text>
            </View>
          )}

          {/* Rating Badge */}
          {tourPackage.rating !== undefined && tourPackage.rating !== null && (
            <View
              style={{
                position: 'absolute',
                bottom: 10,
                left: 12,
                backgroundColor: isDark ? theme.colors['surface-dark'] : '#fff',
                borderRadius: 9999,
                paddingHorizontal: 8,
                paddingVertical: 3,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Ionicons name="star" size={12} color={warningColor} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: textColorPrimary }}>
                {tourPackage.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 14, paddingTop: 14, paddingBottom: 14, flex: 1, justifyContent: 'space-between' }}>
          {/* Title */}
          <Text
            style={{ fontSize: 15, fontWeight: '700', color: textColorPrimary, marginBottom: 6 }}
            numberOfLines={2}
          >
            {tourPackage.packageName}
          </Text>

          {/* Stats Row */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="calendar-outline" size={13} color={primaryColor} />
              <Text style={{ fontSize: 12, color: textColorMuted, fontWeight: '500' }}>
                {tourPackage.duration}d
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="pricetag-outline" size={13} color={primaryColor} />
              <Text style={{ fontSize: 12, color: textColorMuted, fontWeight: '500' }}>
                ৳{(tourPackage.totalBudget / 1000).toFixed(0)}K
              </Text>
            </View>
            {tourPackage.maxGroupSize && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="people-outline" size={13} color={primaryColor} />
                <Text style={{ fontSize: 12, color: textColorMuted, fontWeight: '500' }}>
                  {tourPackage.maxGroupSize}
                </Text>
              </View>
            )}
          </View>

          {/* Location */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: borderColor,
            }}
          >
            <Feather name="map-pin" size={12} color={textColorMuted} />
            <Text style={{ fontSize: 12, color: textColorMuted, flex: 1 }} numberOfLines={1}>
              {tourPackage.location?.name || '—'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
