import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { SIDE_MENU_CONFIG } from '../menus/SideMenuConfig';
import LanguageToggle from '../ui/LanguageToggle';
import theme from '../../constants/theme';

interface SideScrollerProps {
  onNavigate?: (section: string, item: string) => void;
  onLogout?: () => void;
}

export default function SideScroller({ onNavigate, onLogout }: SideScrollerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { isDark } = useTheme();
  const { t } = useTranslation();

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
  }, [isMenuOpen, slideAnim, panelWidth]);

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
            {/* Close Button and Language Toggle */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <LanguageToggle
                textColor={textColor}
                isDark={isDark}
                size="medium"
              />
              <TouchableOpacity
                onPress={() => setIsMenuOpen(false)}
                className="p-2"
              >
                <Feather name="x" size={26} color={iconColor} />
              </TouchableOpacity>
            </View>

            {/* Menu Sections */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {SIDE_MENU_CONFIG.map((section) => (
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
                        style={{ color: textColor, flex: 1 }}
                        className="ml-3 text-lg font-semibold"
                      >
                        {t(section.titleKey)}
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
                            style={{ 
                              color: isDark ? theme.colors['muted-dark'] : theme.colors.muted,
                              flex: 1,
                            }}
                            className="ml-3 text-base"
                          >
                            {t(item.labelKey)}
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

