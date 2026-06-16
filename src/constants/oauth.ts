/**
 * OAuth Configuration Constants
 * Used for Google and Facebook authentication setup
 */

export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  FACEBOOK_APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '',
  REDIRECT_SCHEME: 'cholobd',
};

/**
 * OAuth scopes for each provider
 */
export const OAUTH_SCOPES = {
  GOOGLE: ['profile', 'email', 'openid'],
  FACEBOOK: ['public_profile', 'email'],
};

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'facebook';

/**
 * OAuth response type
 */
export type OAuthResponse = {
  provider: OAuthProvider;
  token: string;
};
