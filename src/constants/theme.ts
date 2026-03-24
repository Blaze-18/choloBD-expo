import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Light palette (punchy, modern)
    primary: '#0066FF', // vibrant blue
    'onPrimary': '#FFFFFF',
    secondary: '#7C3AED',
    'onSecondary': '#FFFFFF',
    accent: '#06B6D4',
    background: '#F5F7FB',
    surface: '#FFFFFF',
    'surface-2': '#F1F5F9',
    text: '#0F172A',
    muted: '#475569',
    border: '#E6E9EE',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',

    // Dark palette (accessible contrast)
    'primary-dark': '#3EA8FF',
    'onPrimary-dark': '#071129',
    'secondary-dark': '#C4B5FD',
    'onSecondary-dark': '#071129',
    'accent-dark': '#67E8F9',
    'background-dark': '#071029',
    'surface-dark': '#0F172A',
    'surface-2-dark': '#111827',
    'text-dark': '#E6EEF8',
    'muted-dark': '#94A3B8',
    'border-dark': '#1F2937',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 20,
    pill: 9999,
  },
  elevation: {
    sm: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    md: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 6 },
    lg: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 24, elevation: 12 },
  },
  zIndex: {
    dropdown: 1000,
    modal: 1100,
    sticky: 1020,
  },
  typography: {
    fonts: {
      body: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
      heading: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
      mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    },
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      '2xl': 32,
    },
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeights: {
      xs: 16,
      sm: 18,
      md: 22,
      lg: 28,
      xl: 34,
    },
  },
} as const;

export type Theme = typeof theme;

export default theme;
