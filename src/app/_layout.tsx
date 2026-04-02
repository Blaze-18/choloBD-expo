import './globals.css';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useAuthInitializer } from '../hooks/state/useAuthInitializer';
import { API_BASE_URL } from '../constants/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function AppContent() {
  useAuthInitializer(API_BASE_URL);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}