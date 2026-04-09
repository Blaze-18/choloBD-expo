/**
 * Loading Indicator Component
 * Displays loading states for various operations
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

console.log('[LoadingIndicator] Component loaded');

interface LoadingIndicatorProps {
  loading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export function LoadingIndicator({
  loading,
  message = 'Loading...',
  fullScreen = false,
}: LoadingIndicatorProps) {
  const { isDark } = useTheme();
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const bgColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;

  if (!loading) return null;

  const containerStyle = fullScreen ? styles.containerFullScreen : { ...styles.containerInline, backgroundColor: bgColor };

  console.log('[LoadingIndicator] Showing loading, fullScreen:', fullScreen);

  return (
    <View style={containerStyle}>
      <ActivityIndicator size="large" color={primaryColor} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  containerInline: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f5f5f5',
  },
  containerFullScreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default LoadingIndicator;
