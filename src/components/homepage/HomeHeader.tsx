import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import SideScroller from '../modals/SideScroller';
import AppBrandSection from './AppBrandSection';

interface HomeHeaderProps {
  onNavigate?: (section: string, item: string) => void;
  onLogout?: () => void;
}

export default function HomeHeader({ onNavigate, onLogout }: HomeHeaderProps) {
  const { isDark } = useTheme();

  const bgColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <View
        style={{
          backgroundColor: bgColor,
          borderBottomWidth: 0.5,
          borderBottomColor: borderColor,
        }}
        className="flex-row items-center justify-between h-20 px-3 py-2"
      >
        {/* Left: Side Scroller Button + Brand */}
        <View className="flex-row items-center gap-2 flex-1">
          <SideScroller onNavigate={onNavigate} onLogout={onLogout} />
          {/* App Brand beside menu */}
          <AppBrandSection />
        </View>
      </View>
    </SafeAreaView>
  );
}
