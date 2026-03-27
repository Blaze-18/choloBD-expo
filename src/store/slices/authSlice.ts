import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser, AuthTokens, ApiResponse } from '../../types/auth';
import { createApi, getApiInstance, setLogoutCallback } from '../../services/api/axiosClient';
import { saveTokens, clearTokens, saveUserIdAndRole, clearUserIdAndRole, getUserIdAndRole } from '../../lib/secureStore';

// We'll export a function to initialize the API base URL from the app bootstrap
export const configureApi = (baseURL: string) => {
  createApi(baseURL);
};

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { rejectWithValue }) => {
  try {
    console.log('[initializeAuth] Reading tokens from SecureStore...');
    const tokensRes = await (await import('../../lib/secureStore')).getTokens();
    const userInfo = await getUserIdAndRole();
    if (tokensRes && userInfo) {
      console.log('[initializeAuth] Found existing tokens, restoring auth state');
      return { tokens: tokensRes, user: { id: userInfo.userId, email: '', userName: '', role: userInfo.role } } as any;
    }
    console.log('[initializeAuth] No existing tokens found');
    return null;
  } catch (e) {
    console.error('[initializeAuth] Error:', e);
    return rejectWithValue('Failed to initialize auth');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (payload: { email: string; password: string }, { rejectWithValue }) => {
  try {
    console.log('[loginUser] Starting login...', payload);
    const api = getApiInstance();
    console.log('[loginUser] API instance obtained');
    const res = await api.post('/api/auth/login-jwt', payload);
    console.log('[loginUser] Login response:', res.data);
    const data = res.data as ApiResponse<{ accessToken: string; refreshToken: string; user: AuthUser }>;
    await saveTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
    await saveUserIdAndRole(data.data.user.id, data.data.user.role);
    console.log('[loginUser] Success');
    return { tokens: { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken }, user: data.data.user };
  } catch (e: any) {
    console.error('[loginUser] Error:', e?.response?.data || e.message);
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload: { email: string; password: string; userName: string }, { rejectWithValue }) => {
  try {
    console.log('[registerUser] Starting register...', payload);
    const api = getApiInstance();
    console.log('[registerUser] API instance obtained');
    const res = await api.post('/api/auth/register-jwt', payload);
    console.log('[registerUser] Register response:', res.data);
    const data = res.data as ApiResponse<{ accessToken: string; refreshToken: string; user: AuthUser }>;
    await saveTokens({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
    await saveUserIdAndRole(data.data.user.id, data.data.user.role);
    console.log('[registerUser] Success');
    return { tokens: { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken }, user: data.data.user };
  } catch (e: any) {
    console.error('[registerUser] Error:', e?.response?.data || e.message);
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const tokens = await (await import('../../lib/secureStore')).getTokens();
    const api = getApiInstance();
    if (tokens) {
      await api.post('/api/auth/logout-jwt', { refreshToken: tokens.refreshToken });
    }
    await clearTokens();
    await clearUserIdAndRole();
    return true;
  } catch (e: any) {
    // still clear local tokens
    await clearTokens();
    await clearUserIdAndRole();
    return rejectWithValue(e?.response?.data || e.message);
  }
});

export const loginWithOAuth = createAsyncThunk('auth/oauth', async (payload: { accessToken: string; refreshToken: string; userId: string; role: string }, { rejectWithValue }) => {
  try {
    await saveTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
    await saveUserIdAndRole(payload.userId, payload.role);
    // user details will be fetched later if needed
    return { tokens: { accessToken: payload.accessToken, refreshToken: payload.refreshToken }, user: { id: payload.userId, email: '', userName: '', role: payload.role } as AuthUser };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (s) => {
        s.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (s, a: PayloadAction<any>) => {
        s.isInitializing = false;
        if (a.payload) {
          s.tokens = a.payload.tokens;
          s.user = a.payload.user;
          s.isAuthenticated = true;
        } else {
          s.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (s) => {
        s.isInitializing = false;
        s.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.tokens = a.payload.tokens;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (s, a: any) => {
        s.isLoading = false;
        s.error = a.payload || String(a.error?.message || a.error);
      })
      .addCase(registerUser.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.tokens = a.payload.tokens;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (s, a: any) => {
        s.isLoading = false;
        s.error = a.payload || String(a.error?.message || a.error);
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
        s.tokens = null;
        s.isAuthenticated = false;
      })
      .addCase(loginWithOAuth.fulfilled, (s, a) => {
        s.tokens = a.payload.tokens;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      });
  },
});

export const { clearError } = slice.actions;

export default slice.reducer;
