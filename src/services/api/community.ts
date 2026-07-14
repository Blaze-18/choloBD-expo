import { AxiosError } from 'axios';
import { getApiInstance } from './axiosClient';
import {
  CommunityPost,
  PaginatedPosts,
  CreatePostBody,
  UpdatePostImagesBody,
  TagUserBody,
  TagResponseBody,
  ReactResponse,
} from '../../types/community';
import { COMMUNITY_POSTS_ENDPOINT } from '../../constants/api';

function mapApiError(error: any) {
  console.error('[community.ts] API error:', error?.response?.status, error?.message);
  const status = error?.response?.status;
  if (status === 400) return { type: 'VALIDATION', statusCode: 400, message: error?.response?.data?.message || 'Validation failed' };
  if (status === 401) return { type: 'UNAUTHORIZED', statusCode: 401, message: 'Unauthorized' };
  if (status === 403) return { type: 'FORBIDDEN', statusCode: 403, message: 'Forbidden' };
  if (status === 404) return { type: 'NOT_FOUND', statusCode: 404, message: 'Not found' };
  return { type: 'SERVER', statusCode: status || 500, message: error?.message || 'Server error' };
}

export async function fetchActivePosts(params?: { page?: number; limit?: number; userTripPlanId?: string }): Promise<PaginatedPosts> {
  try {
    const api = getApiInstance();
    const query: any = {};
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;
    if (params?.userTripPlanId) query.userTripPlanId = params.userTripPlanId;

    const res = await api.get(COMMUNITY_POSTS_ENDPOINT, { params: query });
    const payload = res.data?.data ?? res.data;

    // Support different shapes: { results,... } or { data: { results... } }
    const results = payload.results ?? payload.results ?? payload;

    return {
      results: payload.results ?? payload.data ?? results ?? [],
      total: payload.total ?? payload.pagination?.total ?? 0,
      page: payload.page ?? payload.pagination?.page ?? 1,
      limit: payload.limit ?? payload.pagination?.limit ?? 10,
    } as PaginatedPosts;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function fetchPostById(postId: string): Promise<CommunityPost> {
  try {
    const api = getApiInstance();
    const res = await api.get(`${COMMUNITY_POSTS_ENDPOINT}/${postId}`);
    const payload = res.data?.data ?? res.data;
    return payload as CommunityPost;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function fetchMyPosts(params?: { page?: number; limit?: number; userTripPlanId?: string }): Promise<PaginatedPosts> {
  try {
    const api = getApiInstance();
    const query: Record<string, any> = {};
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;
    if (params?.userTripPlanId) query.userTripPlanId = params.userTripPlanId;

    const res = await api.get(`${COMMUNITY_POSTS_ENDPOINT}/my-posts`, { params: query });
    const payload = res.data?.data ?? res.data;

    return {
      results: payload.results ?? payload.data ?? [],
      total: payload.total ?? payload.pagination?.total ?? 0,
      page: payload.page ?? payload.pagination?.page ?? 1,
      limit: payload.limit ?? payload.pagination?.limit ?? 10,
    } as PaginatedPosts;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function createDraftPost(body: CreatePostBody): Promise<CommunityPost> {
  try {
    const api = getApiInstance();
    const res = await api.post(COMMUNITY_POSTS_ENDPOINT, body);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function updatePostImages(postId: string, body: UpdatePostImagesBody): Promise<CommunityPost> {
  try {
    const api = getApiInstance();
    const res = await api.put(`${COMMUNITY_POSTS_ENDPOINT}/${postId}`, body);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function tagUser(postId: string, body: TagUserBody): Promise<any> {
  try {
    const api = getApiInstance();
    const res = await api.post(`${COMMUNITY_POSTS_ENDPOINT}/${postId}/tags`, body);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function respondToTag(postId: string, body: TagResponseBody): Promise<any> {
  try {
    const api = getApiInstance();
    const res = await api.put(`${COMMUNITY_POSTS_ENDPOINT}/${postId}/tags/respond`, body);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function removeTag(postId: string, taggedUserId: string): Promise<any> {
  try {
    const api = getApiInstance();
    const res = await api.delete(`${COMMUNITY_POSTS_ENDPOINT}/${postId}/tags/${taggedUserId}`);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function reactToPost(postId: string): Promise<ReactResponse> {
  try {
    const api = getApiInstance();
    const res = await api.post(`${COMMUNITY_POSTS_ENDPOINT}/${postId}/react`);
    return res.data?.data ?? res.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function deactivatePost(postId: string): Promise<any> {
  try {
    const api = getApiInstance();
    const res = await api.put(`${COMMUNITY_POSTS_ENDPOINT}/${postId}/deactivate`);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

// Admin endpoints
export async function fetchPendingPosts(params?: { page?: number; limit?: number }): Promise<PaginatedPosts> {
  try {
    const api = getApiInstance();
    const res = await api.get(`${COMMUNITY_POSTS_ENDPOINT}/pending`, { params });
    const payload = res.data?.data ?? res.data;
    return {
      results: payload.results ?? payload.data ?? payload ?? [],
      total: payload.total ?? payload.pagination?.total ?? 0,
      page: payload.page ?? payload.pagination?.page ?? 1,
      limit: payload.limit ?? payload.pagination?.limit ?? 10,
    } as PaginatedPosts;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export async function activatePost(postId: string): Promise<CommunityPost> {
  try {
    const api = getApiInstance();
    const res = await api.put(`${COMMUNITY_POSTS_ENDPOINT}/${postId}/activate`);
    return res.data?.data;
  } catch (error: any) {
    throw mapApiError(error);
  }
}

export { CommunityPost } from '../../types/community';
