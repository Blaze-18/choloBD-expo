import React, { useState, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import SideScroller from '../modals/SideScroller';
import AppBrandSection from './AppBrandSection';
import SearchSection from './SearchSection';

interface HomeHeaderProps {
  onNavigate?: (section: string, item: string) => void;
  onLogout?: () => void;
}

export default function HomeHeader({ onNavigate, onLogout }: HomeHeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const searchAnim = useRef(new Animated.Value(0)).current;

  const bgColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;

  const toggleSearch = (active: boolean) => {
    setIsSearchActive(active);
    Animated.timing(searchAnim, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

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
      >
        {/* Header Row (regular layout when search not active) */}
        {!isSearchActive && (
          <View className="flex-row items-center justify-between h-20 px-3 py-2">
            {/* Left: Side Scroller Button + Brand */}
            <View className="flex-row items-center gap-2 flex-1">
              <SideScroller onNavigate={onNavigate} onLogout={onLogout} />
              {/* App Brand beside menu */}
              <AppBrandSection />
            </View>

            {/* Right: Search Icon */}
            <View>
              <SearchSection isActive={false} onToggle={toggleSearch} />
            </View>
          </View>
        )}

        {/* Animated Search Overlay (full-width centered search) */}
        {isSearchActive && (
          <Animated.View
            pointerEvents="auto"
            style={{
              position: 'relative',
              width: '100%',
              opacity: searchAnim,
            }}
          >
            <View className="flex-row items-center justify-between h-20 px-3 py-2">
              {/* Left: Menu button (placeholder space) */}
              <View className="w-10" />
              
              {/* Center: Search Input */}
              <View className="flex-1 mx-2">
                <SearchSection isActive={true} onToggle={toggleSearch} />
              </View>
              
              {/* Right: Placeholder space */}
              <View className="w-10" />
            </View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}
