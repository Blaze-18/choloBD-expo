/**
 * Tour List Card Component
 * Modern, clean, minimal design with nativewind
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TourPackage } from '../../types/tours';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

console.log('[TourListCard] Component loaded');

interface TourListCardProps {
  tour: TourPackage;
  onPress?: (tourId: string) => void;
  onEdit?: (tourId: string) => void;
  onDelete?: (tourId: string) => void;
  showAdminActions?: boolean;
}

export function TourListCard({
  tour,
  onPress,
  onEdit,
  onDelete,
  showAdminActions = false,
}: TourListCardProps) {
  const { isDark } = useTheme();
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;
  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];
  const onErrorColor = isDark ? theme.colors['onError-dark'] : theme.colors['onError'];

  console.log('[TourListCard] Rendering tour:', tour.packageName, 'adminActions:', showAdminActions);

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('[TourListCard] Pressed tour:', tour.id);
        onPress?.(tour.id);
      }}
      className="mx-3 mb-3 overflow-hidden rounded-2xl active:opacity-70"
      style={{
        backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text className="flex-1 pr-2 text-base font-bold text-text dark:text-text-dark" numberOfLines={2}>
          {tour.packageName}
        </Text>
        
        {/* Badges */}
        <View className="flex-row gap-2 ml-2">
          {tour.isPopular && (
            <View style={{ backgroundColor: theme.colors.warning }} className="px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-white">Popular</Text>
            </View>
          )}
          {!tour.isActive && (
            <View className="px-2 py-1 bg-gray-400 rounded-full">
              <Text className="text-xs font-semibold text-white">Inactive</Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-2 px-4 py-3">
        <StatItem 
          icon="calendar" 
          label="Duration" 
          value={`${tour.duration}d`} 
          color={primaryColor}
          isDark={isDark}
        />
        <StatItem 
          icon="pricetag" 
          label="Budget" 
          value={`৳${(tour.totalBudget / 1000).toFixed(0)}K`} 
          color={successColor}
          isDark={isDark}
        />
        <StatItem 
          icon="map" 
          label="Stops" 
          value={tour.daySegments?.length || 0} 
          color={primaryColor}
          isDark={isDark}
        />
        {tour.rating !== undefined && (
          <StatItem 
            icon="star" 
            label="Rating" 
            value={tour.rating.toFixed(1)} 
            color={theme.colors.warning}
            isDark={isDark}
          />
        )}
      </View>

      {/* Description & Location */}
      {tour.shortDescription && (
        <View className="px-4 py-2">
          <Text className="text-sm leading-5 text-muted dark:text-muted-dark line-clamp-2">
            {tour.shortDescription}
          </Text>
        </View>
      )}

      <View className="flex-row items-center gap-2 px-4 py-3 border-t border-border dark:border-border-dark">
        <Ionicons name="location" size={14} color={primaryColor} />
        <Text className="flex-1 text-xs font-medium text-muted dark:text-muted-dark">
          {tour.location.name}
        </Text>
      </View>

      {/* Admin Actions */}
      {showAdminActions && (
        <View className="flex-row gap-2 px-4 py-3 border-t bg-gray-50 dark:bg-gray-900 border-border dark:border-border-dark">
          <TouchableOpacity
            onPress={() => {
              console.log('[TourListCard] Edit pressed for:', tour.id);
              onEdit?.(tour.id);
            }}
            style={{ backgroundColor: primaryColor }}
            className="flex-1 py-2 rounded-lg active:opacity-80"
          >
            <Text className="text-sm font-semibold text-center text-white">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('[TourListCard] Delete pressed for:', tour.id);
              onDelete?.(tour.id);
            }}
            style={{ backgroundColor: errorColor }}
            className="flex-1 py-2 rounded-lg active:opacity-80"
          >
            <Text className="text-sm font-semibold text-center text-white">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

function StatItem({ icon, label, value, color, isDark }: any) {
  return (
    <View className="flex-1 px-2 py-2 rounded-lg" style={{ backgroundColor: isDark ? color + '15' : color + '10' }}>
      <View className="flex-row items-center gap-1 mb-1">
        <Ionicons name={icon} size={12} color={color} />
        <Text className="text-xs font-medium text-muted dark:text-muted-dark">{label}</Text>
      </View>
      <Text className="text-sm font-bold text-text dark:text-text-dark">{value}</Text>
    </View>
  );
}

export default TourListCard;
