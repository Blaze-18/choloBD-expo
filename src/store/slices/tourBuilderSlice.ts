/**
 * Tour Builder Redux Slice
 * State management for tour packages, filtering, and CRUD operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TourPackage,
  TourFilters,
  CreateTourPlanData,
  UpdateTourPlanData,
  TourApiError,
} from '../../types/tours';
import * as tourApi from '../../services/api/tourBuilder';

console.log('[tourBuilderSlice] Initializing tour builder slice...');

/**
 * Tour builder state shape
 */
export interface TourBuilderState {
  // List view state
  list: TourPackage[];
  listLoading: boolean;
  listError: TourApiError | null;

  // Detail view state
  detail: TourPackage | null;
  detailLoading: boolean;
  detailError: TourApiError | null;

  // Form submission state
  formLoading: boolean;
  formError: TourApiError | null;

  // Filters
  filters: TourFilters;

  // Admin mode
  adminMode: boolean;
}

const initialState: TourBuilderState = {
  list: [],
  listLoading: false,
  listError: null,
  detail: null,
  detailLoading: false,
  detailError: null,
  formLoading: false,
  formError: null,
  filters: {},
  adminMode: false,
};

/**
 * Async thunk: Fetch tour list
 */
export const fetchTourPlans = createAsyncThunk(
  'tourBuilder/fetchTourPlans',
  async (filters: TourFilters | undefined, { rejectWithValue }) => {
    try {
      console.log('[tourBuilderSlice] Fetching tour plans with filters:', filters);
      const tours = await tourApi.getTourPlans(filters);
      console.log('[tourBuilderSlice] Fetched', tours.length, 'tours');
      return tours;
    } catch (error: any) {
      console.error('[tourBuilderSlice] fetchTourPlans error:', error);
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk: Fetch tour plans by admin ID
 * Pass 'me' for current authenticated admin or specific adminId
 */
export const fetchTourPlansByAdmin = createAsyncThunk(
  'tourBuilder/fetchTourPlansByAdmin',
  async ({ adminId = 'me', filters }: { adminId?: string; filters?: TourFilters } = {}, { rejectWithValue }) => {
    try {
      console.log('[tourBuilderSlice] Fetching tour plans by admin:', adminId, 'filters:', filters);
      const tours = await tourApi.getTourPlansByAdmin(adminId, filters);
      console.log('[tourBuilderSlice] Fetched', tours.length, 'tours for admin:', adminId);
      return tours;
    } catch (error: any) {
      console.error('[tourBuilderSlice] fetchTourPlansByAdmin error:', error);
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk: Fetch single tour detail
 */
export const fetchTourPlanDetail = createAsyncThunk(
  'tourBuilder/fetchTourPlanDetail',
  async (tourPackageId: string, { rejectWithValue }) => {
    try {
      console.log('[tourBuilderSlice] Fetching tour detail:', tourPackageId);
      const tour = await tourApi.getTourPlan(tourPackageId);
      console.log('[tourBuilderSlice] Fetched tour detail:', tour.packageName);
      return tour;
    } catch (error: any) {
      console.error('[tourBuilderSlice] fetchTourPlanDetail error:', error);
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk: Create tour plan
 */
export const createTourPlanAsync = createAsyncThunk(
  'tourBuilder/createTourPlan',
  async (payload: CreateTourPlanData, { rejectWithValue }) => {
    try {
      console.log('[tourBuilderSlice] ========== THUNK: CREATE TOUR PLAN ==========');
      console.log('[tourBuilderSlice] Package Name:', payload.packageName);
      console.log('[tourBuilderSlice] Calling tourApi.createTourPlan()...');
      const tour = await tourApi.createTourPlan(payload);
      console.log('[tourBuilderSlice] ✅ Tour created by API:', tour.id);
      console.log('[tourBuilderSlice] Returning tour object');
      return tour;
    } catch (error: any) {
      console.error('[tourBuilderSlice] ❌ createTourPlan thunk error:', error);
      console.error('[tourBuilderSlice] Error type:', error?.type);
      console.error('[tourBuilderSlice] Error message:', error?.message);
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk: Update tour plan
 */
export const updateTourPlanAsync = createAsyncThunk(
  'tourBuilder/updateTourPlan',
  async (
    { id, payload }: { id: string; payload: UpdateTourPlanData },
    { rejectWithValue }
  ) => {
    try {
      console.log('[tourBuilderSlice] Updating tour plan:', id);
      const tour = await tourApi.updateTourPlan(id, payload);
      console.log('[tourBuilderSlice] Tour updated:', tour.id);
      return tour;
    } catch (error: any) {
      console.error('[tourBuilderSlice] updateTourPlan error:', error);
      return rejectWithValue(error);
    }
  }
);

/**
 * Async thunk: Delete tour plan
 */
export const deleteTourPlanAsync = createAsyncThunk(
  'tourBuilder/deleteTourPlan',
  async (tourPackageId: string, { rejectWithValue }) => {
    try {
      console.log('[tourBuilderSlice] Deleting tour plan:', tourPackageId);
      await tourApi.deleteTourPlan(tourPackageId);
      console.log('[tourBuilderSlice] Tour deleted:', tourPackageId);
      return tourPackageId;
    } catch (error: any) {
      console.error('[tourBuilderSlice] deleteTourPlan error:', error);
      return rejectWithValue(error);
    }
  }
);

const tourBuilderSlice = createSlice({
  name: 'tourBuilder',
  initialState,
  reducers: {
    /**
     * Update filters and keep in state for re-fetching
     */
    setFilters(state, action: PayloadAction<TourFilters>) {
      console.log('[tourBuilderSlice] Setting filters:', action.payload);
      state.filters = action.payload;
    },

    /**
     * Clear all filters
     */
    clearFilters(state) {
      console.log('[tourBuilderSlice] Clearing filters');
      state.filters = {};
    },

    /**
     * Set admin mode
     */
    setAdminMode(state, action: PayloadAction<boolean>) {
      console.log('[tourBuilderSlice] Setting admin mode:', action.payload);
      state.adminMode = action.payload;
    },

    /**
     * Clear list and detail
     */
    clearTourData(state) {
      console.log('[tourBuilderSlice] Clearing tour data');
      state.list = [];
      state.detail = null;
      state.listError = null;
      state.detailError = null;
    },

    /**
     * Clear form error
     */
    clearFormError(state) {
      console.log('[tourBuilderSlice] Clearing form error');
      state.formError = null;
    },

    /**
     * Clear detail
     */
    clearDetail(state) {
      console.log('[tourBuilderSlice] Clearing detail');
      state.detail = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tour plans
    builder
      .addCase(fetchTourPlans.pending, (state) => {
        console.log('[tourBuilderSlice] fetchTourPlans pending');
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchTourPlans.fulfilled, (state, action) => {
        console.log('[tourBuilderSlice] fetchTourPlans fulfilled, count:', action.payload.length);
        state.listLoading = false;
        state.list = action.payload;
        state.listError = null;
      })
      .addCase(fetchTourPlans.rejected, (state, action: any) => {
        console.error('[tourBuilderSlice] fetchTourPlans rejected:', action.payload);
        state.listLoading = false;
        state.listError = action.payload;
      });

    // Fetch tour plans by admin
    builder
      .addCase(fetchTourPlansByAdmin.pending, (state) => {
        console.log('[tourBuilderSlice] fetchTourPlansByAdmin pending');
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchTourPlansByAdmin.fulfilled, (state, action) => {
        console.log('[tourBuilderSlice] fetchTourPlansByAdmin fulfilled, count:', action.payload.length);
        state.listLoading = false;
        state.list = action.payload;
        state.listError = null;
      })
      .addCase(fetchTourPlansByAdmin.rejected, (state, action: any) => {
        console.error('[tourBuilderSlice] fetchTourPlansByAdmin rejected:', action.payload);
        state.listLoading = false;
        state.listError = action.payload;
      });

    // Fetch tour detail
    builder
      .addCase(fetchTourPlanDetail.pending, (state) => {
        console.log('[tourBuilderSlice] fetchTourPlanDetail pending');
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchTourPlanDetail.fulfilled, (state, action) => {
        console.log('[tourBuilderSlice] fetchTourPlanDetail fulfilled:', action.payload.packageName);
        state.detailLoading = false;
        state.detail = action.payload;
        state.detailError = null;
      })
      .addCase(fetchTourPlanDetail.rejected, (state, action: any) => {
        console.error('[tourBuilderSlice] fetchTourPlanDetail rejected:', action.payload);
        state.detailLoading = false;
        state.detailError = action.payload;
      });

    // Create tour plan
    builder
      .addCase(createTourPlanAsync.pending, (state) => {
        console.log('[tourBuilderSlice] ⏳ createTourPlan PENDING - Setting formLoading=true');
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(createTourPlanAsync.fulfilled, (state, action) => {
        console.log('[tourBuilderSlice] ✅ createTourPlan FULFILLED');
        console.log('[tourBuilderSlice] Created tour ID:', action.payload.id);
        console.log('[tourBuilderSlice] Payload:', action.payload);
        state.formLoading = false;
        state.formError = null;
        // Add to list
        state.list.push(action.payload);
        // Set as detail
        state.detail = action.payload;
        console.log('[tourBuilderSlice] Added to state.list and state.detail');
      })
      .addCase(createTourPlanAsync.rejected, (state, action: any) => {
        console.error('[tourBuilderSlice] ❌ createTourPlan REJECTED');
        console.error('[tourBuilderSlice] Error payload:', action.payload);
        state.formLoading = false;
        state.formError = action.payload;
      });

    // Update tour plan
    builder
      .addCase(updateTourPlanAsync.pending, (state) => {
        console.log('[tourBuilderSlice] updateTourPlan pending');
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(updateTourPlanAsync.fulfilled, (state, action) => {
        console.log('[tourBuilderSlice] updateTourPlan fulfilled:', action.payload.id);
        state.formLoading = false;
        state.formError = null;
        // Update in list
        const idx = state.list.findIndex((t) => t.id === action.payload.id);
        if (idx >= 0) {
          state.list[idx] = action.payload;
        }
        // Update detail
        if (state.detail?.id === action.payload.id) {
          state.detail = action.payload;
        }
      })
      .addCase(updateTourPlanAsync.rejected, (state, action: any) => {
        console.error('[tourBuilderSlice] updateTourPlan rejected:', action.payload);
        state.formLoading = false;
        state.formError = action.payload;
      });

    // Delete tour plan
    builder
      .addCase(deleteTourPlanAsync.pending, (state) => {
        console.log('[tourBuilderSlice] deleteTourPlan pending');
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(deleteTourPlanAsync.fulfilled, (state, action) => {
        console.log('[tourBuilderSlice] deleteTourPlan fulfilled:', action.payload);
        state.formLoading = false;
        state.formError = null;
        // Remove from list
        state.list = state.list.filter((t) => t.id !== action.payload);
        // Clear detail if it was deleted
        if (state.detail?.id === action.payload) {
          state.detail = null;
        }
      })
      .addCase(deleteTourPlanAsync.rejected, (state, action: any) => {
        console.error('[tourBuilderSlice] deleteTourPlan rejected:', action.payload);
        state.formLoading = false;
        state.formError = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setAdminMode, clearTourData, clearFormError, clearDetail } = tourBuilderSlice.actions;

export default tourBuilderSlice.reducer;

console.log('[tourBuilderSlice] Slice initialized');
