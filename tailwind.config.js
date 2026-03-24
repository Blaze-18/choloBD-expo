/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light
        primary: '#0066FF',
        'on-primary': '#FFFFFF',
        secondary: '#7C3AED',
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

        // Dark
        'primary-dark': '#3EA8FF',
        'on-primary-dark': '#071129',
        'secondary-dark': '#C4B5FD',
        'accent-dark': '#67E8F9',
        'background-dark': '#071029',
        'surface-dark': '#0F172A',
        'surface-2-dark': '#111827',
        'text-dark': '#E6EEF8',
        'muted-dark': '#94A3B8',
        'border-dark': '#1F2937',
      },
          fontFamily: {
            body: ['System'],
            heading: ['System'],
            mono: ['Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};