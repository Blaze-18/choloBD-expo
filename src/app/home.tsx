import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';
import { getApiInstance } from '../services/api/axiosClient';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const [serverRole, setServerRole] = useState<string | null>(null);
  const [loadingServerRole, setLoadingServerRole] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  useEffect(() => {
    const fetchServerProfile = async () => {
      if (!auth.isAuthenticated && !auth.tokens) return;
      try {
        setLoadingServerRole(true);
        const api = getApiInstance();
        // try common profile endpoints
        let res;
        try {
          res = await api.get('/api/auth/me');
        } catch (err) {
          if (auth.user?.id) {
            res = await api.get(`/api/users/${auth.user.id}`);
          } else {
            throw err;
          }
        }
        const serverUser = res?.data?.data || res?.data;
        const role = serverUser?.role || serverUser?.data?.role || null;
        setServerRole(role);
      } catch (e: any) {
        console.warn('[Home] fetchServerProfile failed', e?.response?.data || e?.message || e);
        setServerRole(null);
      } finally {
        setLoadingServerRole(false);
      }
    };

    void fetchServerProfile();
  }, [auth.isAuthenticated, auth.tokens, auth.user?.id]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6">
        <View className="flex-row items-center space-x-4">
          <Image source={{ uri: auth.user?.imageUrl || 'https://api.dicebear.com/6.x/initials/svg?seed=' + (auth.user?.userName || auth.user?.email || 'user') }} style={{ width: 72, height: 72, borderRadius: 18 }} />
          <View className="flex-1">
            <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">{auth.user?.userName ?? 'No name'}</Text>
            <Text className="mt-1 text-sm text-muted dark:text-muted-dark">{auth.user?.email ?? 'No email'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="px-3 py-2 rounded-md bg-danger">
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="grid-cols-2 gap-3 mt-6">
          <View className="p-4 mt-4 rounded-lg shadow bg-surface dark:bg-surface-dark">
            <Text className="text-sm text-muted dark:text-muted-dark">Role</Text>
            <Text className="mt-1 text-base text-text dark:text-text-dark">{auth.user?.role ?? 'USER'}</Text>
            <Text className="mt-1 text-sm text-muted dark:text-muted-dark">Server: {loadingServerRole ? 'Loading...' : (serverRole ?? 'n/a')}</Text>
          </View>
          <View className="p-4 mt-4 rounded-lg shadow bg-surface dark:bg-surface-dark">
            <Text className="text-sm text-muted dark:text-muted-dark">Status</Text>
            <Text className="mt-1 text-base text-text dark:text-text-dark">{auth.user?.userStatus ?? 'ACTIVE'}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
