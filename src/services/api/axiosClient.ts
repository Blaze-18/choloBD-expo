import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getTokens, saveTokens, clearTokens } from '../../lib/secureStore';

let api: AxiosInstance | null = null;

type LogoutCallback = () => void;
let onLogout: LogoutCallback | null = null;

export function setLogoutCallback(cb: LogoutCallback) {
  onLogout = cb;
}

export function createApi(baseURL: string) {
  api = axios.create({ baseURL, timeout: 10000 });

  api.interceptors.request.use(async (cfg) => {
    try {
      const tokens = await getTokens();
      if (tokens?.accessToken && cfg.headers) {
        cfg.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      console.log('[axios.request] 📡', cfg.method?.toUpperCase(), cfg.url, {
        hasAuth: !!tokens?.accessToken,
        baseURL: cfg.baseURL || baseURL
      });
    } catch (e) {
      // ignore
    }
    return cfg;
  });

  api.interceptors.response.use(
    (res) => {
      console.log('[axios.response] ✅', res.status, res.config.url, {
        dataKeys: res.data?.data ? Object.keys(res.data.data).slice(0, 5) : 'N/A',
        isArray: Array.isArray(res.data?.data)
      });
      return res;
    },
    async (error: AxiosError) => {
      // Diagnostic logging for network errors
      try {
        console.error('[axios.error] ❌', {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          baseURL: (error.config as any)?.baseURL || api?.defaults.baseURL,
          status: error.response?.status,
          data: error.response?.data,
        });
      } catch (logErr) {
        // ignore
      }
      const original = error.config as AxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const tokens = await getTokens();
          if (!tokens) throw new Error('no refresh token');

          const refreshRes = await axios.post(`${baseURL}/api/auth/refresh`, { refreshToken: tokens.refreshToken });
          const data = refreshRes.data as { data: { accessToken: string; refreshToken: string } };
          const newTokens = { accessToken: data.data.accessToken, refreshToken: data.data.refreshToken };
          await saveTokens(newTokens);

          if (!api) throw new Error('api missing');
          if (original.headers) original.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return api(original as AxiosRequestConfig);
        } catch (e) {
          await clearTokens();
          if (onLogout) onLogout();
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}

export function getApiInstance() {
  if (!api) throw new Error('API not created. Call createApi(baseURL) first.');
  return api;
}
