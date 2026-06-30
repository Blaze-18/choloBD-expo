/**
 * Quick Action Grid Component
 * Displays horizontal scrollable quick action buttons for main features
 * Gozayan-inspired compact design with space-efficient layout
 */

import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface QuickAction {
  id: string;
  translationKey: string;
  icon: keyof typeof Feather.glyphMap;
  route: string | null;
  disabled?: boolean;
}

interface QuickActionGridProps {
  onNavigate?: (actionId: string) => void;
}

export default function QuickActionGrid({ onNavigate }: QuickActionGridProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  // Define quick actions
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        id: 'plan-trip',
        translationKey: TRANSLATION_KEYS.HOME.QUICK_ACTIONS.PLAN_TRIP,
        icon: 'calendar',
        route: '/(tabs)/trip-planner',
      },
      {
        id: 'book-hotel',
        translationKey: TRANSLATION_KEYS.HOME.QUICK_ACTIONS.BOOK_HOTEL,
        icon: 'home',
        route: '/(tabs)/explore/hotel-search?fromHome=true',
      },
      {
        id: 'browse-tours',
        translationKey: TRANSLATION_KEYS.HOME.QUICK_ACTIONS.ATTRACTIONS,
        icon: 'compass',
        route: '/(tabs)/explore/tour-spots-list?fromHome=true',
      },
      {
        id: 'transport',
        translationKey: TRANSLATION_KEYS.HOME.QUICK_ACTIONS.TRANSPORT,
        icon: 'truck',
        route: null,
        disabled: true,
      },
    ],
    []
  );

  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const disabledColor = isDark ? theme.colors['muted-dark'] : '#d1d5db';
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;

  const handleActionPress = (action: QuickAction) => {
    if (action.disabled || !action.route) {
      return;
    }

    if (onNavigate) {
      onNavigate(action.id);
    }

    router.push(action.route);
  };

  const renderQuickActionButton = (action: QuickAction) => {
    const isDisabled = action.disabled || !action.route;
    const iconColor = isDisabled ? disabledColor : primaryColor;
    const labelText = isDisabled ? t(TRANSLATION_KEYS.COMMON.COMING_SOON) : t(action.translationKey);

    return (
      <TouchableOpacity
        key={action.id}
        activeOpacity={isDisabled ? 1 : 0.7}
        onPress={() => handleActionPress(action)}
        className="flex-1 items-center"
        style={{ opacity: isDisabled ? 0.6 : 1 }}
      >
        <View
          className="items-center justify-center rounded-2xl mb-1.5"
          style={{
            width: 56,
            height: 56,
            backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.18)' : '#e5e7eb',
          }}
        >
          <Feather name={action.icon} size={28} color={iconColor} />
        </View>

        {/* Label */}
        <Text
          className="font-semibold text-center"
          style={{ 
            color: textColor, 
            fontSize: 12,
            maxWidth: 80,
          }}
          numberOfLines={2}
        >
          {labelText}
        </Text>

        {/* Coming Soon Badge */}
        {isDisabled && (
          <View className="mt-1 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <Text className="text-xs font-bold text-yellow-700 dark:text-yellow-200">
              Soon
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      className="flex-row px-4 py-4 bg-background dark:bg-background-dark"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: isDark ? theme.colors['border-dark'] : theme.colors.border,
      }}
    >
      {quickActions.map((action) => renderQuickActionButton(action))}
    </View>
  );
}

