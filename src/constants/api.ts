// Prefer environment variable `API_BASE_URL` or `EXPO_PUBLIC_API_BASE_URL`.
// If not set, fallback to the previous placeholder. Update `.env` with your LAN IP.
const envBase = process.env.API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;
export const API_BASE_URL = envBase || 'http://192.168.0.107:5000';

export const DEEP_LINK_SCHEME = process.env.DEEP_LINK_SCHEME || 'cholobd://auth/callback';
