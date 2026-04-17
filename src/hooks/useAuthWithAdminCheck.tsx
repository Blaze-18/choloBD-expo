/**
 * Auth Hook with Admin Check
 * Custom hook for accessing auth state and checking admin status
 */

import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AuthUser, UserRole } from '../types/auth';

/**
 * Check if user has admin role (includes SERVICE_ADMIN)
 */
function isMasterAdminUser(user: AuthUser | null): boolean {
  const isAdmin = user?.role === 'masterAdmin' || user?.role === 'admin' || user?.role === 'SERVICE_ADMIN';
  return isAdmin;
}

/**
 * Check if user has master admin role specifically
 */
function isMasterAdmin(user: AuthUser | null): boolean {
  return user?.role === 'masterAdmin';
}

export interface AuthWithAdminStatus {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  userRole: UserRole | null;
}

/**
 * Custom hook: useAuthWithAdminCheck
 * Returns auth state plus admin/masterAdmin status flags
 */
export function useAuthWithAdminCheck(): AuthWithAdminStatus {
  const auth = useSelector((state: RootState) => state.auth);

  console.log('[useAuthWithAdminCheck] Hook called, user role:', auth.user?.role, 'isAdmin:', isMasterAdminUser(auth.user));

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isInitializing: auth.isInitializing,
    error: auth.error,
    isAdmin: isMasterAdminUser(auth.user),
    isMasterAdmin: isMasterAdmin(auth.user),
    userRole: auth.user?.role ?? null,
  };
}

/**
 * Helper hook: Check if current user can perform admin actions
 */
export function useCanPerformAdminActions(): boolean {
  const { isAdmin } = useAuthWithAdminCheck();
  console.log('[useAuthWithAdminCheck] canPerformAdminActions:', isAdmin);
  return isAdmin;
}

console.log('[useAuthWithAdminCheck] Hook module loaded');
