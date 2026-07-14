import { COMMUNITY_IMAGE_UPLOAD_ENABLED, COMMUNITY_IMAGE_UPLOAD_PROVIDER, COMMUNITY_IMAGE_UPLOAD_URL } from '../../constants/api';
import { uploadCommunityImageToCloudinary } from './cloudinaryUpload';

export interface UploadableImage {
  uri: string;
  name?: string | null;
  type?: string | null;
}

type UploadResponse = {
  url?: string;
  data?: {
    url?: string;
  };
};

export async function uploadCommunityImage(file: UploadableImage): Promise<string> {
  if (!COMMUNITY_IMAGE_UPLOAD_ENABLED) {
    throw new Error('Community image upload is not configured');
  }

  // Use Cloudinary if configured
  if (COMMUNITY_IMAGE_UPLOAD_PROVIDER === 'cloudinary') {
    return uploadCommunityImageToCloudinary(file);
  }

  // Legacy fallback (should not be used with Cloudinary configured)
  const api = await import('./axiosClient').then(m => m.getApiInstance());
  const formData = new FormData();

  formData.append('image', {
    uri: file.uri,
    name: file.name || 'community-image.jpg',
    type: file.type || 'image/jpeg',
  } as any);

  // Use the configured upload URL or default to /api/upload/community
  const uploadEndpoint = COMMUNITY_IMAGE_UPLOAD_URL || '/api/upload/community';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const res = await api.post<UploadResponse>(uploadEndpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const uploadedUrl = res.data?.data?.url || res.data?.url;
    if (!uploadedUrl) {
      throw new Error('Image upload succeeded but no URL was returned');
    }

    return uploadedUrl;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (__DEV__) {
      console.error('[communityMedia] uploadCommunityImage error:', error);
    }
    if (error.name === 'AbortError') {
      throw new Error('Upload timed out. Please check your connection and try again.');
    }
    if (error.message?.includes('Network request failed')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw new Error(error?.message || 'Failed to upload image');
  }
}
