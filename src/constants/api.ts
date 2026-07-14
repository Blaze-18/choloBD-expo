// Prefer environment variable `API_BASE_URL` or `EXPO_PUBLIC_API_BASE_URL`.
// If not set, fallback to the previous placeholder. Update `.env` with your LAN IP.
const envBase =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL;

export const API_BASE_URL =
  envBase ||
  'https://expressjs-cholobd-backend-668d84e20b2a.herokuapp.com';

export const DEEP_LINK_SCHEME =
  process.env.DEEP_LINK_SCHEME || 'cholobd://auth/callback';

// Community posts endpoint
export const COMMUNITY_POSTS_ENDPOINT = `${API_BASE_URL}/api/community/posts`;

// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME =
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || '';

export const CLOUDINARY_UPLOAD_PRESET =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || '';

export const CLOUDINARY_UPLOAD_URL =
  process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_URL?.trim() || '';

export const CLOUDINARY_CONFIGURED =
  Boolean(CLOUDINARY_CLOUD_NAME) &&
  Boolean(CLOUDINARY_UPLOAD_PRESET) &&
  Boolean(CLOUDINARY_UPLOAD_URL);

// Community image upload configuration
// Use Cloudinary if configured, otherwise fallback to legacy endpoint
const communityImageUploadEndpoint =
  process.env.EXPO_PUBLIC_COMMUNITY_IMAGE_UPLOAD_ENDPOINT?.trim() || '';

export const COMMUNITY_IMAGE_UPLOAD_URL = CLOUDINARY_CONFIGURED
  ? CLOUDINARY_UPLOAD_URL
  : (communityImageUploadEndpoint
      ? (communityImageUploadEndpoint.startsWith('http')
          ? communityImageUploadEndpoint
          : `${API_BASE_URL}${communityImageUploadEndpoint}`)
      : null);

export const COMMUNITY_IMAGE_UPLOAD_ENABLED =
  CLOUDINARY_CONFIGURED || Boolean(communityImageUploadEndpoint);

export const COMMUNITY_IMAGE_UPLOAD_FIELD =
  process.env.EXPO_PUBLIC_COMMUNITY_IMAGE_UPLOAD_FIELD || 'image';

// Upload provider type for debugging/logging
export const COMMUNITY_IMAGE_UPLOAD_PROVIDER = CLOUDINARY_CONFIGURED
  ? 'cloudinary'
  : 'legacy';

