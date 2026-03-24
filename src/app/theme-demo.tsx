import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import theme from '../constants/theme';

export default function ThemeDemo() {
  const { mode, setMode, isDark, toggle } = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-6" style={{ backgroundColor: isDark ? theme.colors['background-dark'] : theme.colors.background }}>
      <Text className="font-heading" style={{ color: isDark ? theme.colors['text-dark'] : theme.colors.text, fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Theme Demo</Text>

      <View style={{ width: '100%', padding: 16, borderRadius: 12, marginBottom: 12, backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface, borderColor: isDark ? theme.colors['border-dark'] : theme.colors.border, borderWidth: 1 }}>
        <Text className="font-body" style={{ color: isDark ? theme.colors['muted-dark'] : theme.colors.muted }}>This surface uses token-backed background, border and text colors.</Text>
      </View>

      <TouchableOpacity onPress={toggle} style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginBottom: 8, backgroundColor: isDark ? theme.colors['primary-dark'] : theme.colors.primary }}>
        <Text className="font-body" style={{ color: isDark ? theme.colors['onPrimary-dark'] : theme.colors.onPrimary, textAlign: 'center', fontWeight: '700' }}>Toggle Theme</Text>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={() => setMode('system')} style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface, borderWidth: 1, borderColor: isDark ? theme.colors['border-dark'] : theme.colors.border, marginRight: 8 }}>
          <Text className="font-body" style={{ color: isDark ? theme.colors['text-dark'] : theme.colors.text, fontWeight: '700' }}>System</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('light')} style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface, borderWidth: 1, borderColor: isDark ? theme.colors['border-dark'] : theme.colors.border, marginRight: 8 }}>
          <Text className="font-body" style={{ color: isDark ? theme.colors['text-dark'] : theme.colors.text, fontWeight: '700' }}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('dark')} style={{ padding: 10, borderRadius: 8, backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface, borderWidth: 1, borderColor: isDark ? theme.colors['border-dark'] : theme.colors.border }}>
          <Text className="font-body" style={{ color: isDark ? theme.colors['text-dark'] : theme.colors.text, fontWeight: '700' }}>Dark</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 18 }}>
        <Text style={{ color: isDark ? theme.colors['muted-dark'] : theme.colors.muted }}>Mode: {mode} • isDark: {isDark ? 'true' : 'false'}</Text>
        <Text style={{ marginTop: 8, color: isDark ? theme.colors['primary-dark'] : theme.colors.primary }}>Primary color (inline token)</Text>
      </View>
    </View>
  );
}
