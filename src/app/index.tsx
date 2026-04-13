import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function RootRedirect() {
  const router = useRouter();
  const auth = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    // Wait until tokens are restored from SecureStore before deciding
    if (auth.isInitializing) return;

    if (auth.isAuthenticated && auth.tokens) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [auth.isAuthenticated, auth.tokens, auth.isInitializing]);

  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-surface dark:bg-surface-dark">
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}