import React from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';

export default function DebugThemePage() {
  const { mode, setMode, isDark, system } = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Theme Debug</Text>

      <Text style={{ marginBottom: 8 }}>mode: {String(mode)}</Text>
      <Text style={{ marginBottom: 8 }}>isDark: {String(isDark)}</Text>
      <Text style={{ marginBottom: 8 }}>system color scheme: {String(system)}</Text>

      <View style={{ marginVertical: 12 }}>
        <Text style={{ marginBottom: 8 }}>Quick actions:</Text>
        <Button title="Set light" onPress={() => setMode('light')} />
        <View style={{ height: 8 }} />
        <Button title="Set dark" onPress={() => setMode('dark')} />
        <View style={{ height: 8 }} />
        <Button title="Set system" onPress={() => setMode('system')} />
      </View>

      <View style={{ marginVertical: 12, padding: 12, borderRadius: 8, backgroundColor: isDark ? theme.colors['surface-dark'] : theme.colors.surface }}>
        <Text style={{ color: isDark ? theme.colors['text-dark'] : theme.colors.text, fontWeight: '700', marginBottom: 8 }}>Sample Card</Text>
        <Text style={{ color: isDark ? theme.colors['muted-dark'] : theme.colors.muted }}>This text should follow dark/text color.</Text>
      </View>
    </ScrollView>
  );
}
