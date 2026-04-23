import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailRowProps {
    icon: any;
    label: string;
    value: string;
    color: string;
}

export function DetailRow({ icon, label, value, color }: DetailRowProps) {
    return (
            <View className="flex-row items-center gap-3">
            <Ionicons name={icon} size={18} color={color} />
            <View className="flex-1">
                <Text className="mb-1 text-xs font-medium tracking-wide uppercase text-muted dark:text-muted-dark">
                {label}
                </Text>
                <Text className="text-sm font-semibold text-text dark:text-text-dark">
                {value}
                </Text>
            </View>
            </View>
    );
}
