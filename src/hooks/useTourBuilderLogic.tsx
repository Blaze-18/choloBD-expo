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

  const loadTourList = async (filters?: TourFilters) => {
    try {
      await dispatch(fetchTourPlans(filters)).unwrap();
    } catch (error) {
      if (__DEV__) console.error('[useTourBuilderLogic] Failed to load tour list:', error);
      throw error;
    }
  };

  const loadTourDetail = async (tourId: string) => {
    try {
      await dispatch(fetchTourPlanDetail(tourId)).unwrap();
    } catch (error) {
      if (__DEV__) console.error('[useTourBuilderLogic] Failed to load tour detail:', error);
      throw error;
    }
  };

  const createTour = async (data: CreateTourPlanData) => {
    if (!isAdmin) {
      throw new Error('Insufficient permissions to create tour');
    }
    try {
      await dispatch(createTourPlanAsync(data)).unwrap();
    } catch (error) {
      if (__DEV__) console.error('[useTourBuilderLogic] Failed to create tour:', error);
      throw error;
    }
  };

  const updateTour = async (tourId: string, data: UpdateTourPlanData) => {
    if (!isAdmin) {
      throw new Error('Insufficient permissions to update tour');
    }
    try {
      await dispatch(updateTourPlanAsync({ id: tourId, payload: data })).unwrap();
    } catch (error) {
      if (__DEV__) console.error('[useTourBuilderLogic] Failed to update tour:', error);
      throw error;
    }
  };

  const deleteTour = async (tourId: string) => {
    if (!isAdmin) {
      throw new Error('Insufficient permissions to delete tour');
    }
    try {
      await dispatch(deleteTourPlanAsync(tourId)).unwrap();
    } catch (error) {
      if (__DEV__) console.error('[useTourBuilderLogic] Failed to delete tour:', error);
      throw error;
    }
  };

  const updateFilters = (newFilters: TourFilters) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const clearForm = () => {
    dispatch(clearFormError());
  };

  const clearErrors = () => {
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
