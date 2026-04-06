import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

interface SearchSectionProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export default function SearchSection({ isActive, onToggle }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark } = useTheme();
  
  const iconColor = isDark ? theme.colors['text-dark'] : '#000';
  const placeholderColor = isDark ? theme.colors['muted-dark'] : '#999';
  const inputBgColor = isDark ? theme.colors['surface-2-dark'] : '#f3f4f6';
  const inputBorderColor = isDark ? theme.colors['border-dark'] : '#d1d5db';

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Handle search logic here
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onToggle(false);
  };

  return (
    <View className="w-full">
      {!isActive ? (
        // Search Icon Button
        <TouchableOpacity
          className="p-1"
          onPress={() => onToggle(true)}
          activeOpacity={0.7}
        >
          <Feather name="search" size={26} color={iconColor} />
        </TouchableOpacity>
      ) : (
        // Search Input - Full width centered
        <View className="w-full flex-row items-center justify-center gap-2">
          <TextInput
            className="flex-1 bg-gray-100 dark:bg-surface-2-dark rounded-xl px-4 py-2 text-neutral-900 dark:text-text-dark text-base border border-gray-300 dark:border-border-dark"
            placeholder="Search hotels, spots..."
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
            style={{ minHeight: 40 }}
          />
          <TouchableOpacity
            className="p-2"
            onPress={handleSearch}
            activeOpacity={0.7}
          >
            <Feather name="arrow-right" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2"
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Feather name="x" size={22} color={isDark ? theme.colors['muted-dark'] : '#666'} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
