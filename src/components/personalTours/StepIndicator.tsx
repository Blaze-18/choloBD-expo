/**
 * Step Indicator Component
 * Shows progress through the multi-step form
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface Step {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepPress?: (index: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepPress }: StepIndicatorProps) {
  const { isDark } = useTheme();
  
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;

  return (
    <View className="flex-row items-center justify-between px-4 py-4">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const canNavigate = onStepPress && index <= currentStep;

        const StepContent = (
          <View className="items-center" style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: isCompleted
                  ? successColor
                  : isActive
                    ? primaryColor
                    : mutedColor + '40',
              }}
              className="w-10 h-10 rounded-full items-center justify-center mb-2"
            >
              {isCompleted ? (
                <Ionicons name="checkmark" size={20} color="#fff" />
              ) : (
                <Ionicons
                  name={step.icon}
                  size={20}
                  color={isActive ? '#fff' : mutedColor}
                />
              )}
            </View>
            <Text
              style={{
                color: isActive ? textColor : mutedColor,
                fontWeight: isActive ? '600' : '400',
              }}
              className="text-xs text-center"
              numberOfLines={2}
            >
              {step.label}
            </Text>
          </View>
        );

        if (canNavigate) {
          return (
            <TouchableOpacity
              key={step.id}
              onPress={() => onStepPress(index)}
              style={{ flex: 1 }}
              disabled={!canNavigate}
            >
              {StepContent}
            </TouchableOpacity>
          );
        }

        return (
          <View key={step.id} style={{ flex: 1 }}>
            {StepContent}
          </View>
        );
      })}
    </View>
  );
}
