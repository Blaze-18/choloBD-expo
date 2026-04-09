/**
 * Tour Builder Business Logic Hook
 * Encapsulates tour builder state management and operations
 */

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchTourPlans,
  fetchTourPlanDetail,
  createTourPlanAsync,
  updateTourPlanAsync,
  deleteTourPlanAsync,
  setFilters,
  clearFilters,
  clearFormError,
  clearDetail,
} from '../store/slices/tourBuilderSlice';
import { TourFilters, CreateTourPlanData, UpdateTourPlanData } from '../types/tours';
import { useAuthWithAdminCheck } from './useAuthWithAdminCheck';

console.log('[useTourBuilderLogic] Hook loaded');

export interface TourBuilderLogic {
  // State
  tours: any[];
  selectedTour: any | null;
  isLoading: boolean;
  isFormSubmitting: boolean;
  error: any | null;
  formError: any | null;
  filters: TourFilters;
  isAdmin: boolean;

  // Actions
  loadTourList: (filters?: TourFilters) => Promise<void>;
  loadTourDetail: (tourId: string) => Promise<void>;
  createTour: (data: CreateTourPlanData) => Promise<void>;
  updateTour: (tourId: string, data: UpdateTourPlanData) => Promise<void>;
  deleteTour: (tourId: string) => Promise<void>;
  updateFilters: (newFilters: TourFilters) => void;
  resetFilters: () => void;
  clearForm: () => void;
  clearErrors: () => void;
}

/**
 * Custom hook: useTourBuilderLogic
 * Provides tour builder state and operations
 */
export function useTourBuilderLogic(): TourBuilderLogic {
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin } = useAuthWithAdminCheck();

  const state = useSelector((state: RootState) => state.tourBuilder);

  console.log('[useTourBuilderLogic] Hook called, isAdmin:', isAdmin, 'tourCount:', state.list.length);

  const loadTourList = async (filters?: TourFilters) => {
    console.log('[useTourBuilderLogic] Loading tour list with filters:', filters);
    try {
      await dispatch(fetchTourPlans(filters)).unwrap();
      console.log('[useTourBuilderLogic] Tour list loaded successfully');
    } catch (error) {
      console.error('[useTourBuilderLogic] Failed to load tour list:', error);
      throw error;
    }
  };

  const loadTourDetail = async (tourId: string) => {
    console.log('[useTourBuilderLogic] Loading tour detail:', tourId);
    try {
      await dispatch(fetchTourPlanDetail(tourId)).unwrap();
      console.log('[useTourBuilderLogic] Tour detail loaded successfully');
    } catch (error) {
      console.error('[useTourBuilderLogic] Failed to load tour detail:', error);
      throw error;
    }
  };

  const createTour = async (data: CreateTourPlanData) => {
    console.log('[useTourBuilderLogic] Creating tour:', data.packageName);
    if (!isAdmin) {
      console.error('[useTourBuilderLogic] User is not admin, cannot create tour');
      throw new Error('Insufficient permissions to create tour');
    }

    try {
      await dispatch(createTourPlanAsync(data)).unwrap();
      console.log('[useTourBuilderLogic] Tour created successfully');
    } catch (error) {
      console.error('[useTourBuilderLogic] Failed to create tour:', error);
      throw error;
    }
  };

  const updateTour = async (tourId: string, data: UpdateTourPlanData) => {
    console.log('[useTourBuilderLogic] Updating tour:', tourId);
    if (!isAdmin) {
      console.error('[useTourBuilderLogic] User is not admin, cannot update tour');
      throw new Error('Insufficient permissions to update tour');
    }

    try {
      await dispatch(updateTourPlanAsync({ id: tourId, payload: data })).unwrap();
      console.log('[useTourBuilderLogic] Tour updated successfully');
    } catch (error) {
      console.error('[useTourBuilderLogic] Failed to update tour:', error);
      throw error;
    }
  };

  const deleteTour = async (tourId: string) => {
    console.log('[useTourBuilderLogic] Deleting tour:', tourId);
    if (!isAdmin) {
      console.error('[useTourBuilderLogic] User is not admin, cannot delete tour');
      throw new Error('Insufficient permissions to delete tour');
    }

    try {
      await dispatch(deleteTourPlanAsync(tourId)).unwrap();
      console.log('[useTourBuilderLogic] Tour deleted successfully');
    } catch (error) {
      console.error('[useTourBuilderLogic] Failed to delete tour:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters: TourFilters) => {
    console.log('[useTourBuilderLogic] Updating filters:', newFilters);
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    console.log('[useTourBuilderLogic] Resetting filters');
    dispatch(clearFilters());
  };

  const clearForm = () => {
    console.log('[useTourBuilderLogic] Clearing form error');
    dispatch(clearFormError());
  };

  const clearErrors = () => {
    console.log('[useTourBuilderLogic] Clearing all errors');
    dispatch(clearFormError());
    dispatch(clearDetail());
  };

  return {
    // State
    tours: state.list,
    selectedTour: state.detail,
    isLoading: state.listLoading || state.detailLoading,
    isFormSubmitting: state.formLoading,
    error: state.listError || state.detailError,
    formError: state.formError,
    filters: state.filters,
    isAdmin,

    // Actions
    loadTourList,
    loadTourDetail,
    createTour,
    updateTour,
    deleteTour,
    updateFilters,
    resetFilters,
    clearForm,
    clearErrors,
  };
}

console.log('[useTourBuilderLogic] Hook module loaded');
