import React, { useEffect } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import theme from '../../constants/theme';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginForm } from '../../validators/auth';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const { isDark } = useTheme();
  const placeholderColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;

  const { register, setValue, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    register('email');
    register('password');
  }, [register]);

  const onSubmit = (values: LoginForm) => {
    console.log('[Login] Form submitted with values:', values);
    void dispatch(loginUser(values));
  };

  useEffect(() => {
    console.log('[Login] Auth state changed:', { isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading, error: auth.error });
    if (auth.isAuthenticated) {
      console.log('[Login] Authenticated! Redirecting to /home...');
      router.replace('/home');
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
            <Text className="mb-4 text-3xl font-bold text-center font-heading text-text dark:text-text-dark">Welcome back</Text>
            <Text className="mb-6 text-center text-muted dark:text-muted-dark">Sign in to continue to CholoBD</Text>

            <View className="space-y-4">
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
                {errors.email ? <Text className="text-xs text-danger mt-1">{String(errors.email.message)}</Text> : null}
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
                {errors.password ? <Text className="text-xs text-danger mt-1">{String(errors.password.message)}</Text> : null}
              </View>

              <TouchableOpacity onPress={handleSubmit(onSubmit)} className="p-3 rounded-lg bg-primary dark:bg-primary-dark">
                <Text className="font-medium text-center text-white">{auth.isLoading ? 'Signing in...' : 'Sign in'}</Text>
              </TouchableOpacity>
              {auth.error ? <Text className="text-sm text-danger text-center mt-2">{String(auth.error)}</Text> : null}
            </View>

            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-border dark:bg-border-dark" />
              <Text className="px-3 text-sm text-muted dark:text-muted-dark">Or continue with</Text>
              <View className="flex-1 h-px bg-border dark:bg-border-dark" />
            </View>

            <View className="flex-row justify-center space-x-3">
              <TouchableOpacity className="items-center flex-1 p-3 bg-white border rounded-lg border-border dark:border-border-dark dark:bg-surface-dark">
                <Text className="text-sm text-text dark:text-text-dark">Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center flex-1 p-3 bg-white border rounded-lg border-border dark:border-border-dark dark:bg-surface-dark">
                <Text className="text-sm text-text dark:text-text-dark">Continue with Facebook</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center mt-4">
              <Text className="text-sm text-muted dark:text-muted-dark">Don't have an account?</Text>
              <Link href="/register">
                <Text className="ml-2 text-sm text-primary dark:text-primary-dark">Create account</Text>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
