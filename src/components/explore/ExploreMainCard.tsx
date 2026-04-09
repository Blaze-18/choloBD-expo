/**
 * Explore Main Card Component
 * Reusable card for displaying feature options on the explore main screen
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface ExploreMainCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  colorKey: 'primary' | 'success' | 'secondary' | 'warning' | 'error' | 'accent';
  onPress: () => void;
  badge?: string;
}

export function ExploreMainCard({
  title,
  description,
  iconName,
  colorKey,
  onPress,
  badge,
}: ExploreMainCardProps) {
  const { isDark } = useTheme();

  // Get color from theme
  const bgColor = isDark ? theme.colors[`${colorKey}-dark`] : theme.colors[colorKey];
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const onBgColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl overflow-hidden mb-4"
      style={{
        backgroundColor: surfaceColor,
        borderColor: borderColor,
        borderWidth: 1,
        ...theme.elevation.sm,
      }}
    >
      <View className="flex-row items-center p-4">
        {/* Icon Container */}
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            backgroundColor: bgColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name={iconName} size={28} color={onBgColor} />
        </View>

        {/* Text Container */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text
              className="text-lg font-bold flex-1"
              style={{ color: textColor }}
            >
              {title}
            </Text>
            {badge && (
              <View style={{ backgroundColor: bgColor, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: onBgColor }}>{badge}</Text>
              </View>
            )}
          </View>
          <Text
            className="text-sm mt-1"
            style={{ color: mutedColor }}
          >
            {description}
          </Text>
        </View>

        {/* Arrow */}
        <Ionicons
          name="chevron-forward"
          size={24}
          color={mutedColor}
          style={{ marginLeft: 12 }}
        />
      </View>
    </TouchableOpacity>
  );
}

export default ExploreMainCard;
