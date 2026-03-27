import React, { useEffect } from 'react';
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login on app open
    router.replace('/login');
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-surface dark:bg-surface-dark">
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}