import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import theme from '../constants/theme';

export default function App() {
    const { mode, setMode, isDark, toggle } = useTheme();

    return (
        <View className="flex-1 items-center justify-center p-6 bg-background dark:bg-background-dark">
            <Text className="font-heading text-2xl font-bold mb-4 text-text dark:text-text-dark">Header Font</Text>

            <Text className="font-body text-base text-muted dark:text-muted-dark mb-4">Body Font</Text>

            <TouchableOpacity onPress={toggle} className="px-4 py-2 rounded-lg bg-primary dark:bg-primary-dark">
                <Text className="font-body text-white font-semibold">Toggle Theme</Text>
            </TouchableOpacity>

            <View className="flex-row gap-2 mt-4">
                <TouchableOpacity onPress={() => setMode('system')} className="px-3 py-1 rounded-md bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
                    <Text className="font-body text-text dark:text-text-dark font-medium">System</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('light')} className="px-3 py-1 rounded-md bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
                    <Text className="font-body text-text dark:text-text-dark font-medium">Light</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMode('dark')} className="px-3 py-1 rounded-md bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
                    <Text className="font-body text-text dark:text-text-dark font-medium">Dark</Text>
                </TouchableOpacity>
            </View>

            <View className="mt-4">
                <Text className="text-sm text-muted dark:text-muted-dark">Mode: {mode} • isDark: {isDark ? 'true' : 'false'}</Text>
                <Text className="text-sm mt-2" style={{ color: isDark ? theme.colors['primary-dark'] : theme.colors.primary }}>Primary color (inline token)</Text>
            </View> 
        </View>
    );
}