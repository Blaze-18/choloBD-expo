import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

interface UserInfoUIProps {
  userName?: string;
  email?: string;
  imageUrl?: string;
  role?: string;
  userStatus?: string;
  onLogout: () => void;
}

export function UserInfoUI({ userName, email, imageUrl, role, userStatus, onLogout }: UserInfoUIProps) {
  const { isDark } = useTheme();
  const avatarUrl = imageUrl || 'https://api.dicebear.com/6.x/initials/svg?seed=' + (userName || email || 'user');
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;

  return (
    <View className="mb-6">
      {/* Profile Header Card with gradient-like appearance */}
      <View className="p-6 rounded-2xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark" style={theme.elevation.sm}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {/* Avatar */}
            <View className="rounded-2xl bg-primary dark:bg-primary-dark p-1">
              <Image source={{ uri: avatarUrl }} style={{ width: 72, height: 72, borderRadius: 16 }} />
            </View>
            
            {/* User Info */}
            <View className="flex-1 ml-4">
              <Text className="text-2xl font-bold font-heading text-text dark:text-text-dark">
                {(userName || 'User').split(' ')[0]}
              </Text>
              <Text className="mt-1 text-xs text-muted dark:text-muted-dark">{email || 'No email'}</Text>
              
              {/* Quick Status */}
              <View className="flex-row items-center mt-2">
                <View className="w-2 h-2 rounded-full bg-green-500" />
                <Text className="ml-1 text-xs text-text dark:text-text-dark">{userStatus || 'ACTIVE'}</Text>
              </View>
            </View>
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity onPress={onLogout} className="p-3 rounded-lg bg-danger" style={{ elevation: 2 }}>
            <Ionicons name="log-out" size={20} color={onPrimaryColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-3 mt-4">
        <View className="flex-1 p-4 rounded-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark" style={theme.elevation.sm}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-muted dark:text-muted-dark uppercase tracking-wider">Role</Text>
              <Text className="mt-2 text-lg font-bold text-text dark:text-text-dark">{role || 'USER'}</Text>
              </View>
            <Ionicons name="person" size={24} color={primaryColor} />
          </View>
        </View>
        
        <View className="flex-1 p-4 rounded-xl bg-white dark:bg-surface-dark border border-border dark:border-border-dark" style={theme.elevation.sm}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-muted dark:text-muted-dark uppercase tracking-wider">Status</Text>
              <Text className="mt-2 text-lg font-bold text-text dark:text-text-dark">{userStatus || 'ACTIVE'}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={successColor} />
          </View>
        </View>
      </View>
    </View>
  );
}
