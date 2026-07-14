import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  CommunityPost,
  PaginatedPosts,
  CreatePostBody,
  UpdatePostImagesBody,
} from '../../types/community';
import * as communityApi from '../../services/api/community';

export interface CommunityState {
  feed: CommunityPost[];
  pagination: { total: number; page: number; limit: number } | null;
  feedLoading: boolean;
  feedError: any | null;

  currentPost: CommunityPost | null;
  currentLoading: boolean;
  currentError: any | null;

  formLoading: boolean;
  formError: any | null;

  pendingPosts: CommunityPost[];
  pendingLoading: boolean;
  pendingError: any | null;
}

const initialState: CommunityState = {
  feed: [],
  pagination: null,
  feedLoading: false,
  feedError: null,

  currentPost: null,
  currentLoading: false,
  currentError: null,

  formLoading: false,
  formError: null,

  pendingPosts: [],
  pendingLoading: false,
  pendingError: null,
};

export const fetchActivePosts = createAsyncThunk(
  'community/fetchActivePosts',
  async (params: { page?: number; limit?: number; userTripPlanId?: string } | undefined, { rejectWithValue }) => {
    try {
      const res = await communityApi.fetchActivePosts(params);
      return res;
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] fetchActivePosts error:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchPostById = createAsyncThunk('community/fetchPostById', async (postId: string, { rejectWithValue }) => {
  try {
    const post = await communityApi.fetchPostById(postId);
    return post;
  } catch (error: any) {
    if (__DEV__) console.error('[communitySlice] fetchPostById error:', error);
    return rejectWithValue(error);
  }
});

export const createDraftPost = createAsyncThunk(
  'community/createDraftPost',
  async (body: CreatePostBody, { rejectWithValue }) => {
    try {
      const post = await communityApi.createDraftPost(body);
      return post;
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] createDraftPost error:', error);
      return rejectWithValue(error);
    }
  }
);

export const updatePostImages = createAsyncThunk(
  'community/updatePostImages',
  async ({ postId, body }: { postId: string; body: UpdatePostImagesBody }, { rejectWithValue }) => {
    try {
      const post = await communityApi.updatePostImages(postId, body);
      return post;
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] updatePostImages error:', error);
      return rejectWithValue(error);
    }
  }
);

export const tagUser = createAsyncThunk(
  'community/tagUser',
  async ({ postId, body }: { postId: string; body: { taggedUserId: string } }, { rejectWithValue }) => {
    try {
      const res = await communityApi.tagUser(postId, body);
      return { postId, tag: res };
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] tagUser error:', error);
      return rejectWithValue(error);
    }
  }
);

export const respondToTag = createAsyncThunk(
  'community/respondToTag',
  async ({ postId, body }: { postId: string; body: { response: 'ACCEPTED' | 'DECLINED' } }, { rejectWithValue }) => {
    try {
      const res = await communityApi.respondToTag(postId, body);
      return { postId, res };
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] respondToTag error:', error);
      return rejectWithValue(error);
    }
  }
);

export const removeTag = createAsyncThunk(
  'community/removeTag',
  async ({ postId, taggedUserId }: { postId: string; taggedUserId: string }, { rejectWithValue }) => {
    try {
      const res = await communityApi.removeTag(postId, taggedUserId);
      return { postId, taggedUserId, res };
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] removeTag error:', error);
      return rejectWithValue(error);
    }
  }
);

export const reactToPost = createAsyncThunk(
  'community/reactToPost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await communityApi.reactToPost(postId);
      return { postId, wowCount: res.wowCount };
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] reactToPost error:', error);
      return rejectWithValue(error);
    }
  }
);

export const deactivatePost = createAsyncThunk(
  'community/deactivatePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const res = await communityApi.deactivatePost(postId);
      return { postId, res };
    } catch (error: any) {
      if (__DEV__) console.error('[communitySlice] deactivatePost error:', error);
      return rejectWithValue(error);
    }
  }
);

// Admin
export const fetchPendingPosts = createAsyncThunk('community/fetchPendingPosts', async (params: { page?: number; limit?: number } | undefined, { rejectWithValue }) => {
  try {
    const res = await communityApi.fetchPendingPosts(params);
    return res;
  } catch (error: any) {
    if (__DEV__) console.error('[communitySlice] fetchPendingPosts error:', error);
    return rejectWithValue(error);
  }
});

export const activatePost = createAsyncThunk('community/activatePost', async (postId: string, { rejectWithValue }) => {
  try {
    const post = await communityApi.activatePost(postId);
    return post;
  } catch (error: any) {
    if (__DEV__) console.error('[communitySlice] activatePost error:', error);
    return rejectWithValue(error);
  }
});

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearFeedError: (state) => {
      state.feedError = null;
    },
    clearCurrentError: (state) => {
      state.currentError = null;
    },
    clearFormError: (state) => {
      state.formError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchActivePosts
      .addCase(fetchActivePosts.pending, (state) => {
        state.feedLoading = true;
        state.feedError = null;
      })
      .addCase(fetchActivePosts.fulfilled, (state, action: PayloadAction<PaginatedPosts>) => {
        state.feedLoading = false;
        state.feed = action.payload.results;
        state.pagination = { total: action.payload.total, page: action.payload.page, limit: action.payload.limit };
      })
      .addCase(fetchActivePosts.rejected, (state, action) => {
        state.feedLoading = false;
        state.feedError = action.payload;
      })

      // fetchPostById
      .addCase(fetchPostById.pending, (state) => {
        state.currentLoading = true;
        state.currentError = null;
        state.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<CommunityPost>) => {
        state.currentLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.currentLoading = false;
        state.currentError = action.payload;
      })

      // createDraftPost
      .addCase(createDraftPost.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(createDraftPost.fulfilled, (state, action: PayloadAction<CommunityPost>) => {
        state.formLoading = false;
        // add draft to top of pendingPosts
        state.pendingPosts.unshift(action.payload);
      })
      .addCase(createDraftPost.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = action.payload;
      })

      // updatePostImages
      .addCase(updatePostImages.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(updatePostImages.fulfilled, (state, action: PayloadAction<CommunityPost>) => {
        state.formLoading = false;
        const updated = action.payload;
        // update in pendingPosts
        const idx = state.pendingPosts.findIndex((p) => p.id === updated.id);
        if (idx >= 0) state.pendingPosts[idx] = updated;
        // also update currentPost if matches
        if (state.currentPost?.id === updated.id) state.currentPost = updated;
      })
      .addCase(updatePostImages.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = action.payload;
      })

      // tagUser
      .addCase(tagUser.fulfilled, (state, action: any) => {
        const { postId, tag } = action.payload;
        const post = state.pendingPosts.find((p) => p.id === postId) || (state.currentPost?.id === postId ? state.currentPost : undefined);
        if (post) post.tags = post.tags ? [...post.tags, tag] : [tag];
      })

      // respondToTag
      .addCase(respondToTag.fulfilled, (state, action: any) => {
        // backend returns updated tag or post; for safety, refetch not done here — mutate minimal
      })

      // removeTag
      .addCase(removeTag.fulfilled, (state, action: any) => {
        const { postId, taggedUserId } = action.payload;
        const post = state.pendingPosts.find((p) => p.id === postId) || (state.currentPost?.id === postId ? state.currentPost : undefined);
        if (post) post.tags = post.tags?.filter((t) => t.taggedUserId !== taggedUserId) ?? [];
      })

      // reactToPost
      .addCase(reactToPost.fulfilled, (state, action: any) => {
        const { postId, wowCount } = action.payload;
        // update in feed
        const updateIn = (p: CommunityPost) => {
          if (p.id === postId) {
            p.wowCount = wowCount;
            p.userHasReacted = !p.userHasReacted;
          }
        };
        state.feed.forEach(updateIn);
        state.pendingPosts.forEach(updateIn);
        if (state.currentPost && state.currentPost.id === postId) updateIn(state.currentPost);
      })

      // deactivatePost
      .addCase(deactivatePost.fulfilled, (state, action: any) => {
        const { postId } = action.payload;
        // remove from feed
        state.feed = state.feed.filter((p) => p.id !== postId);
        // update pending if present
        state.pendingPosts = state.pendingPosts.map((p) => (p.id === postId ? { ...p, isActive: false } : p));
        if (state.currentPost && state.currentPost.id === postId) state.currentPost.isActive = false;
      })

      // admin: fetchPendingPosts
      .addCase(fetchPendingPosts.pending, (state) => {
        state.pendingLoading = true;
        state.pendingError = null;
      })
      .addCase(fetchPendingPosts.fulfilled, (state, action: PayloadAction<PaginatedPosts>) => {
        state.pendingLoading = false;
        state.pendingPosts = action.payload.results;
      })
      .addCase(fetchPendingPosts.rejected, (state, action) => {
        state.pendingLoading = false;
        state.pendingError = action.payload;
      })

      // admin: activatePost
      .addCase(activatePost.fulfilled, (state, action: PayloadAction<CommunityPost>) => {
        const post = action.payload;
        // remove from pending and add to feed
        state.pendingPosts = state.pendingPosts.filter((p) => p.id !== post.id);
        state.feed.unshift(post);
      });
  },
});

export const { clearFeedError, clearCurrentError, clearFormError } = communitySlice.actions;

export default communitySlice.reducer;
