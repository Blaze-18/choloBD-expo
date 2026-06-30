import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { TourSpot } from '../../hooks/useFetchTourSpots';

// Tour type labels for display
const TOUR_TYPE_LABELS: Record<string, string> = {
  ADVENTURE: 'Adventure',
  CULTURAL: 'Cultural',
  BEACH: 'Beach',
  CITY_TOUR: 'City Tour',
  NATURE: 'Nature',
  RELIGIOUS: 'Religious',
  HISTORICAL: 'Historical',
  MIXED: 'Mixed',
};

interface SuggestedTourCardProps {
  spot: TourSpot;
  onPress?: () => void;
}

export default function SuggestedTourCard({
  spot,
  onPress,
}: SuggestedTourCardProps) {
  const { isDark } = useTheme();
  const iconColorGray = isDark ? '#9ca3af' : '#6b7280';
  const cardBgColor = isDark ? theme.colors['surface-2-dark'] : theme.colors.surface;
  const textColorPrimary = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const textColorMuted = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const starColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mr-4"
      style={{ width: 280 }}
    >
      <View style={{
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: cardBgColor,
        borderWidth: 1,
        borderColor: isDark ? theme.colors['border-dark'] : theme.colors.border,
        height: 240,
        ...theme.elevation.sm,
      }}>
        {/* Image */}
        <View style={{ height: 160, backgroundColor: isDark ? theme.colors['surface-dark'] : '#d1d5db', position: 'relative', overflow: 'hidden' }}>
          {spot.imageUrl ? (
            <Image
              source={{ uri: spot.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#374151' : '#e5e7eb' }}>
              <Feather name="image" size={40} color={isDark ? '#6b7280' : '#9ca3af'} />
            </View>
          )}
          
          {/* Tour Type Badge */}
          <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: isDark ? theme.colors['surface-dark'] : '#fff', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: primaryColor }}>
              {TOUR_TYPE_LABELS[spot.tourType] || spot.tourType}
            </Text>
          </View>

          {/* Rating Badge */}
          {spot.rating !== undefined && (
            <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: isDark ? theme.colors['surface-dark'] : '#fff', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 }}>
              <Feather name="star" size={14} color={starColor} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: textColorPrimary }}>
                {spot.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14 }}>
          {/* Title */}
          <Text
            style={{ fontSize: 17, fontWeight: '700', color: textColorPrimary, marginBottom: 8 }}
            numberOfLines={2}
          >
            {spot.name}
          </Text>

          {/* Location */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather name="map-pin" size={13} color={iconColorGray} />
            <Text style={{ fontSize: 13, color: textColorMuted }} numberOfLines={1}>
              {spot.locationName}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
