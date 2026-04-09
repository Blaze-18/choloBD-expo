export type UserRole = 'user' | 'admin' | 'masterAdmin';

export type AuthUser = {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
};

export type ApiResponse<T> = {
  data: T;
};
