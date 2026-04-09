import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface SuggestedTourCardProps {
  id: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  price: number;
  imageUrl: string;
  onPress?: () => void;
}

export default function SuggestedTourCard({
  id,
  title,
  location,
  duration,
  rating,
  price,
  imageUrl,
  onPress,
}: SuggestedTourCardProps) {
  const { isDark } = useTheme();
  const iconColorGray = isDark ? '#9ca3af' : '#6b7280';
  const cardBgColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColorPrimary = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const textColorMuted = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const starColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const secondaryColor = isDark ? theme.colors['secondary-dark'] : theme.colors.secondary;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="mr-4"
      style={{ width: 280 }}
    >
      <View style={{ borderRadius: 20, overflow: 'hidden', backgroundColor: cardBgColor, ...theme.elevation.sm }}>
        {/* Image */}
        <View style={{ height: 160, backgroundColor: isDark ? theme.colors['surface-dark'] : '#d1d5db', position: 'relative', overflow: 'hidden' }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          
          {/* Price Badge */}
          <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: isDark ? theme.colors['surface-dark'] : '#fff', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: primaryColor }}>
              ${price}
            </Text>
          </View>

          {/* Rating Badge */}
          <View style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: isDark ? theme.colors['surface-dark'] : '#fff', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 5 }}>
            <Feather name="star" size={14} color={starColor} />
            <Text style={{ fontSize: 12, fontWeight: '600', color: textColorPrimary }}>
              {rating}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
          {/* Title */}
          <Text
            style={{ fontSize: 18, fontWeight: '700', color: textColorPrimary, marginBottom: 4 }}
            numberOfLines={2}
          >
            {title}
          </Text>

          {/* Location */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Feather name="map-pin" size={14} color={iconColorGray} />
            <Text style={{ fontSize: 14, color: textColorMuted }} numberOfLines={1}>
              {location}
            </Text>
          </View>

          {/* Duration */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopColor: isDark ? theme.colors['border-dark'] : theme.colors.border, borderTopWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="clock" size={14} color={primaryColor} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: textColorMuted }}>
                {duration}
              </Text>
            </View>
            <TouchableOpacity style={{ backgroundColor: secondaryColor, borderRadius: 9999, padding: 8 }}>
              <Feather name="arrow-right" size={14} color={isDark ? theme.colors['onSecondary-dark'] : theme.colors['onSecondary']} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
