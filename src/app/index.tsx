import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function RootRedirect() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    // Redirect based on authentication status
    if (auth.isAuthenticated && auth.tokens) {
      // User is authenticated, show tabs layout (which includes the homepage)
      router.replace('/(tabs)');
    } else {
      // User is not authenticated, show login page
      router.replace('/(auth)/login');
    }
  }, [auth.isAuthenticated, auth.tokens]);

  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-surface dark:bg-surface-dark">
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}