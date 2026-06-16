/**
 * OAuth API Service
 * Handles OAuth token exchange with backend
 * Follows API layer conventions: unwrapped data returns, error handling with rejectWithValue
 */

import { getApiInstance } from './axiosClient';
import { AuthUser, AuthTokens, ApiResponse } from '@/types/auth';
import { OAuthProvider } from '@/constants/oauth';
import { logOAuthError, isValidOAuthToken } from '@/utils/oauthUtils';

/**
 * Exchange OAuth token from provider with backend JWT tokens
 * @param provider - OAuth provider ('google' or 'facebook')
 * @param token - OAuth token from provider
 * @returns JWT tokens and user data
 * @throws Error if token exchange fails
 */
export async function exchangeOAuthToken(
  provider: OAuthProvider,
  token: string
): Promise<{ accessToken: string; refreshToken: string; user: AuthUser }> {
  try {
    if (!isValidOAuthToken(token)) {
      throw new Error('Invalid OAuth token format');
    }

    if (__DEV__) {
      console.log('[oauth.exchangeOAuthToken] Starting token exchange', {
        provider,
        tokenLength: token.length,
      });
    }

    const api = getApiInstance();

    const res = await api.post('/api/auth/oauth/callback', {
      provider,
      token,
    });

    if (__DEV__) {
      console.log('[oauth.exchangeOAuthToken] Token exchange successful', {
        hasUser: !!res.data?.data?.user,
        hasTokens: !!res.data?.data?.accessToken,
      });
    }

    const data = res.data as ApiResponse<{
      accessToken: string;
      refreshToken: string;
      user: AuthUser;
    }>;

    if (!data.data?.accessToken || !data.data?.refreshToken || !data.data?.user) {
      throw new Error('Invalid response from OAuth endpoint');
    }

    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      user: data.data.user,
    };
  } catch (e: any) {
    logOAuthError('exchangeOAuthToken', e);

    // Re-throw with user-friendly message
    const message = e?.response?.data?.message || e?.message || 'OAuth token exchange failed';
    const error = new Error(message);
    (error as any).originalError = e;
    throw error;
  }
}

/**
 * Validate OAuth token with backend
 * Optional: can be called before exchange to verify token validity
 * @param provider - OAuth provider
 * @param token - OAuth token
 * @returns Boolean indicating if token is valid
 */
export async function validateOAuthToken(provider: OAuthProvider, token: string): Promise<boolean> {
  try {
    if (!isValidOAuthToken(token)) {
      return false;
    }

    const api = getApiInstance();

    const res = await api.post('/api/auth/oauth/validate', {
      provider,
      token,
    });

    return res.status === 200;
  } catch (e: any) {
    if (__DEV__) {
      console.log('[oauth.validateOAuthToken] Validation failed', e?.response?.status);
    }
    return false;
  }
}
