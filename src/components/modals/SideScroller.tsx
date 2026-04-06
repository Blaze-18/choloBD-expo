import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface SideScrollerProps {
  onNavigate?: (section: string, item: string) => void;
  onLogout?: () => void;
}

interface MenuSection {
  id: string;
  title: string;
  icon: string;
  items: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

const getMenuSections = (): MenuSection[] => [
  {
    id: 'pages',
    title: 'Pages',
    icon: 'book',
    items: [
      { id: 'explore', label: 'Explore Hotels', icon: 'map-pin' },
      { id: 'bookings', label: 'My Bookings', icon: 'calendar' },
      { id: 'activity', label: 'Activity Spots', icon: 'align-left' },
      { id: 'tours', label: 'Tour Spots', icon: 'compass' },
    ],
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    icon: 'zap',
    items: [
      { id: 'scan-qr', label: 'Scan QR', icon: 'camera' },
      { id: 'wallet', label: 'Wallet', icon: 'credit-card' },
      { id: 'payment', label: 'Make Payment', icon: 'dollar-sign' },
      { id: 'track', label: 'Track Booking', icon: 'navigation' },
    ],
  },
  {
    id: 'general',
    title: 'General',
    icon: 'settings',
    items: [
      { id: 'profile', label: 'My Profile', icon: 'user' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
      { id: 'help', label: 'Help & Support', icon: 'help-circle' },
      { id: 'about', label: 'About', icon: 'info' },
      { id: 'logout', label: 'Logout', icon: 'log-out' },
    ],
  },
];

export default function SideScroller({ onNavigate, onLogout }: SideScrollerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { isDark } = useTheme();
  const menuSections = getMenuSections();

  const screenWidth = Dimensions.get('window').width;
  // Panel will take up to 70% of screen but never exceed 360px
  const panelWidth = Math.min(Math.round(screenWidth * 0.7), 360);

  const slideAnim = useRef(new Animated.Value(-panelWidth)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Dynamic colors based on theme
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const iconColor = isDark ? theme.colors['text-dark'] : '#000';
  const mutedIconColor = isDark ? theme.colors['muted-dark'] : '#666';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: isMenuOpen ? 0 : -panelWidth,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: isMenuOpen ? 0.45 : 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isMenuOpen, slideAnim]);

  const handleMenuPress = (sectionId: string) => {
    setSelectedSection(selectedSection === sectionId ? null : sectionId);
  };

  const handleItemPress = (section: string, item: string) => {
    if (item === 'logout') {
      onLogout?.();
    } else {
      onNavigate?.(section, item);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <TouchableOpacity
        className="p-1"
        onPress={() => setIsMenuOpen(true)}
        activeOpacity={0.7}
      >
        <Feather name="menu" size={26} color={isDark ? theme.colors['text-dark'] : '#000'} />
      </TouchableOpacity>

      {/* Side Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Overlay (animated opacity) */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: isDark ? theme.colors['text-dark'] : theme.colors.text,
              opacity: overlayAnim,
            }}
          />

          {/* Animated Menu Panel */}
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
              width: panelWidth,
              height: '100%',
            }}
            className="bg-white dark:bg-surface-dark"
          >
            {/* Close Button */}
            <View className="flex-row justify-end px-4 py-3">
              <TouchableOpacity
                onPress={() => setIsMenuOpen(false)}
                className="p-2"
              >
                <Feather name="x" size={26} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Menu Sections */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {menuSections.map((section) => (
                <View key={section.id}>
                  {/* Section Header */}
                  <TouchableOpacity
                    className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700"
                    onPress={() => handleMenuPress(section.id)}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center flex-1">
                      <Feather name={section.icon as any} size={22} color={iconColor} />
                      <Text 
                        style={{ color: textColor }}
                        className="text-lg font-semibold ml-3"
                      >
                        {section.title}
                      </Text>
                    </View>
                    <Feather
                      name={selectedSection === section.id ? 'chevron-up' : 'chevron-down'}
                      size={22}
                      color={iconColor}
                    />
                  </TouchableOpacity>

                  {/* Section Items */}
                  {selectedSection === section.id && (
                    <View className="bg-gray-50 dark:bg-neutral-800">
                      {section.items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          className="flex-row items-center px-8 py-3 border-b border-neutral-100 dark:border-neutral-700"
                          onPress={() => handleItemPress(section.id, item.id)}
                          activeOpacity={0.7}
                        >
                          <Feather name={item.icon as any} size={18} color={mutedIconColor} />
                          <Text 
                            style={{ color: isDark ? theme.colors['muted-dark'] : theme.colors.muted }}
                            className="text-base ml-3"
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Tap outside to close */}
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={() => setIsMenuOpen(false)}
          />
        </View>
      </Modal>
    </>
  );
}
