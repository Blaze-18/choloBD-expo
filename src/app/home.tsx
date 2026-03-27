import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        <Text className="text-3xl font-heading font-bold text-text dark:text-text-dark">Home</Text>
        <Text className="mt-2 text-muted dark:text-muted-dark">Welcome — {auth.user?.email ?? 'user'}</Text>

        <TouchableOpacity onPress={handleLogout} className="mt-6 bg-danger p-3 rounded-lg w-40 items-center">
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
