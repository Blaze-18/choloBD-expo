import React, { useEffect, useState } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { registerUser, clearError } from '../../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterForm } from '../../validators/auth';
import AppBrandSection from '../../components/homepage/AppBrandSection';

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const { isDark } = useTheme();
  const placeholderColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    register('userName');
    register('email');
    register('password');
    register('confirm');
    register('role');
  }, [register]);

  const [showRolePicker, setShowRolePicker] = useState(false);
  const ROLE_OPTIONS = ['MASTER_ADMIN', 'SERVICE_ADMIN', 'EMPLOYEE', 'USER'] as const;

  const onSubmit = (values: RegisterForm) => {
    console.log('[Register] Form submitted with values:', values);
    void dispatch(registerUser({ email: values.email, password: values.password, userName: values.userName, role: values.role }));
  };

  useEffect(() => {
    console.log('[Register] Auth state changed:', { isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading, error: auth.error });
    if (auth.isAuthenticated) {
      console.log('[Register] Authenticated! Redirecting to /(tabs)...');
      router.replace('/(tabs)/dashboard');
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.error]);

  useEffect(() => {
    return () => {
      void dispatch(clearError());
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 p-6 bg-surface dark:bg-surface-dark">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="justify-center flex-1">
        <View className="w-full max-w-md mx-auto">
          <View className="p-6 shadow-md bg-surface dark:bg-surface-dark rounded-2xl">
            <View className="items-center mb-6">
              <AppBrandSection width={240} height={90} />
            </View>
            <Text className="mb-2 text-3xl font-bold text-center font-heading text-text dark:text-text-dark">Create account</Text>
            <Text className="mb-6 text-center text-muted dark:text-muted-dark">Start your CholoBD journey</Text>

            <View className="space-y-4">
              <View>
                <Text className="mb-2 text-sm text-muted dark:text-muted-dark">Username</Text>
                <TextInput
                  onChangeText={(v) => setValue('userName', v)}
                  autoCapitalize="none"
                  className="p-3 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark text-text dark:text-text-dark"
                  placeholder="Your name"
                  placeholderTextColor={placeholderColor}
                />
                {errors.userName ? <Text className="mt-1 text-xs text-danger">{String(errors.userName.message)}</Text> : null}
              </View>

              <View>
                <Text className="mb-2 text-sm text-muted dark:text-muted-dark">Email</Text>
                <TextInput
                  onChangeText={(v) => setValue('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="p-3 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark text-text dark:text-text-dark"
                  placeholder="you@example.com"
                  placeholderTextColor={placeholderColor}
                />
                {errors.email ? <Text className="mt-1 text-xs text-danger">{String(errors.email.message)}</Text> : null}
              </View>

              <View>
                <Text className="mb-2 text-sm text-muted dark:text-muted-dark">Password</Text>
                <TextInput
                  onChangeText={(v) => setValue('password', v)}
                  secureTextEntry
                  className="p-3 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark text-text dark:text-text-dark"
                  placeholder="••••••••"
                  placeholderTextColor={placeholderColor}
                />
                {errors.password ? <Text className="mt-1 text-xs text-danger">{String(errors.password.message)}</Text> : null}
              </View>

              <View>
                <Text className="mb-2 text-sm text-muted dark:text-muted-dark">Confirm Password</Text>
                <TextInput
                  onChangeText={(v) => setValue('confirm', v)}
                  secureTextEntry
                  className="p-3 border rounded-lg border-border dark:border-border-dark bg-background-input dark:bg-background-input-dark text-text dark:text-text-dark"
                  placeholder="••••••••"
                  placeholderTextColor={placeholderColor}
                />
                {errors.confirm ? <Text className="mt-1 text-xs text-danger">{String(errors.confirm.message)}</Text> : null}
              </View>

              <View>
                <Text className="mb-2 text-sm text-muted dark:text-muted-dark">Role</Text>
                <TouchableOpacity
                  onPress={() => setShowRolePicker(!showRolePicker)}
                  className="flex-row items-center justify-between p-3 border rounded-lg border-border dark:border-border-dark bg-background dark:bg-background-dark"
                >
                  <Text className={"flex-1"}>
                    {watch('role') || 'Select role'}
                  </Text>
                  <Ionicons name={showRolePicker ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.primary} />
                </TouchableOpacity>

                {showRolePicker && (
                  <View className="mt-2 overflow-hidden bg-white border rounded-lg border-border dark:border-border-dark dark:bg-surface-dark">
                    {ROLE_OPTIONS.map((r) => (
                      <TouchableOpacity
                        key={r}
                        onPress={() => {
                          setValue('role', r as any);
                          setShowRolePicker(false);
                        }}
                        className={`p-4 border-b border-border dark:border-border-dark`}
                      >
                        <Text className="font-medium text-text dark:text-text-dark">{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text className="mt-2 text-xs text-muted dark:text-muted-dark">Select your role. MASTER_ADMIN is reserved — if unavailable the server will reject it.</Text>
                {errors.role ? <Text className="mt-1 text-xs text-danger">{String((errors.role as any).message)}</Text> : null}
              </View>

              <TouchableOpacity onPress={handleSubmit(onSubmit)} className="p-3 rounded-lg bg-primary dark:bg-primary-dark">
                <Text className="font-medium text-center text-white">{auth.isLoading ? 'Creating...' : 'Create account'}</Text>
              </TouchableOpacity>
              {auth.error ? <Text className="mt-2 text-sm text-center text-danger">{String(auth.error)}</Text> : null}
            </View>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-border dark:bg-border-dark" />
              <Text className="px-3 text-sm text-muted dark:text-muted-dark">Or sign up with</Text>
              <View className="flex-1 h-px bg-border dark:bg-border-dark" />
            </View>

            <View className="flex-row justify-center space-x-3">
              <TouchableOpacity className="items-center flex-1 p-3 bg-white border rounded-lg border-border dark:border-border-dark dark:bg-surface-dark">
                <Text className="text-sm text-text dark:text-text-dark">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center flex-1 p-3 bg-white border rounded-lg border-border dark:border-border-dark dark:bg-surface-dark">
                <Text className="text-sm text-text dark:text-text-dark">Facebook</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-4">
              <Text className="text-sm text-muted dark:text-muted-dark">Already have an account?</Text>
              <Link href="/login">
                <Text className="ml-2 text-sm text-primary dark:text-primary-dark">Sign in</Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
