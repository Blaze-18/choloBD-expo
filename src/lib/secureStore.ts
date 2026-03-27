import * as SecureStore from 'expo-secure-store';
import { AuthTokens } from '../types/auth';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';
const USER_ID_KEY = 'userId';
const USER_ROLE_KEY = 'userRole';

async function safeSetItem(key: string, value: string): Promise<void> {
  // Prefer modern API
  // @ts-ignore
  if (typeof SecureStore.setItemAsync === 'function') return SecureStore.setItemAsync(key, value);
  // older or alternative method names
  // @ts-ignore
  if (typeof SecureStore.setValueWithKeyAsync === 'function') return SecureStore.setValueWithKeyAsync(key, value);
  // web fallback to localStorage
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') return window.localStorage.setItem(key, value);
  throw new Error('No secure storage set method available');
}

async function safeGetItem(key: string): Promise<string | null> {
  // @ts-ignore
  if (typeof SecureStore.getItemAsync === 'function') return SecureStore.getItemAsync(key);
  // @ts-ignore
  if (typeof SecureStore.getValueWithKeyAsync === 'function') return SecureStore.getValueWithKeyAsync(key);
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') return Promise.resolve(window.localStorage.getItem(key));
  return null;
}

async function safeDeleteItem(key: string): Promise<void> {
  // @ts-ignore
  if (typeof SecureStore.deleteItemAsync === 'function') return SecureStore.deleteItemAsync(key);
  // @ts-ignore
  if (typeof SecureStore.deleteValueWithKeyAsync === 'function') return SecureStore.deleteValueWithKeyAsync(key);
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') return window.localStorage.removeItem(key);
  return;
}

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await safeSetItem(ACCESS_KEY, tokens.accessToken);
  await safeSetItem(REFRESH_KEY, tokens.refreshToken);
}

export async function getTokens(): Promise<AuthTokens | null> {
  const accessToken = await safeGetItem(ACCESS_KEY);
  const refreshToken = await safeGetItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export async function clearTokens(): Promise<void> {
  await safeDeleteItem(ACCESS_KEY);
  await safeDeleteItem(REFRESH_KEY);
}

export async function saveUserIdAndRole(userId: string, role: string): Promise<void> {
  await safeSetItem(USER_ID_KEY, userId);
  await safeSetItem(USER_ROLE_KEY, role);
}

export async function getUserIdAndRole(): Promise<{ userId: string; role: string } | null> {
  const userId = await safeGetItem(USER_ID_KEY);
  const role = await safeGetItem(USER_ROLE_KEY);
  if (!userId || !role) return null;
  return { userId, role };
}

export async function clearUserIdAndRole(): Promise<void> {
  await safeDeleteItem(USER_ID_KEY);
  await safeDeleteItem(USER_ROLE_KEY);
}
