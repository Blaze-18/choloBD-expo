import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom ?? 0;

  const { isDark } = useTheme();

  const tabBarActiveTintColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const tabBarInactiveTintColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const tabBarBackground = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const tabBarBorderTop = isDark ? theme.colors['border-dark'] : theme.colors.border;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabBarActiveTintColor,
        tabBarInactiveTintColor: tabBarInactiveTintColor,
        tabBarStyle: {
          borderTopColor: tabBarBorderTop,
          backgroundColor: tabBarBackground,
          height: 60 + bottomInset,
          paddingBottom: Platform.OS === 'ios' ? bottomInset : bottomInset + 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Homepage',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Tracking',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'checkmark-done' : 'checkmark-done-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trip-planner"
        options={{
          title: 'Trip Planner',
          href: null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
