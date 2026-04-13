/**
 * Trip Planner Business Logic Hook
 * Encapsulates trip planner state management and operations
 */

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchTrips,
  fetchTripDetail,
  fetchTripSummary,
  createTripAsync,
  updateTripAsync,
  deleteTripAsync,
  addSegmentAsync,
  updateSegmentAsync,
  deleteSegmentAsync,
  setFilters,
  clearFilters,
  clearFormError,
  clearCurrentTrip,
  clearTripsData,
  clearTripSummary,
  setWizardLocation,
  setWizardDates,
  setWizardSpots,
  setWizardStep,
  resetWizard,
} from '../store/slices/tripPlannerSlice';
import {
  TripFilters,
  CreateTripData,
  UpdateTripData,
  CreateSegmentData,
  UpdateSegmentData,
  TripPlan,
  UserSegment,
  TripSummary,
} from '../types/trips';
import { Location } from '../types/locations';
import { Spot } from '../components/tripPlanner/SpotsSelection';

console.log('[useTripPlannerLogic] Hook loaded');

export interface TripPlannerLogic {
  // List State
  trips: TripPlan[];
  totalTrips: number;
  currentPage: number;
  isTripsLoading: boolean;
  tripsError: any | null;

  // Detail State
  currentTrip: TripPlan | null;
  currentSegments: UserSegment[];
  isTripLoading: boolean;
  tripError: any | null;

  // Summary State
  tripSummary: TripSummary | null;
  isSummaryLoading: boolean;
  summaryError: any | null;

  // Form State
  isFormSubmitting: boolean;
  formError: any | null;

  // Filters
  filters: TripFilters;

  // Wizard State
  wizardCurrentStep: number;
  wizardSelectedLocation: Location | null;
  wizardStartDate: Date | null;
  wizardEndDate: Date | null;
  wizardSelectedSpots: Spot[];

  // Trip List Actions
  loadTrips: (filters?: TripFilters) => Promise<void>;
  refreshTrips: () => Promise<void>;
  updateTripFilters: (newFilters: TripFilters) => void;
  resetTripFilters: () => void;

  // Trip Detail Actions
  loadTripDetail: (tripId: string) => Promise<void>;
  createTrip: (data: CreateTripData) => Promise<TripPlan>;
  updateTrip: (tripId: string, data: UpdateTripData) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  clearCurrentTripData: () => void;

  // Segment Actions
  addSegment: (tripId: string, data: CreateSegmentData) => Promise<UserSegment>;
  updateSegment: (
    tripId: string,
    segmentId: string,
    data: UpdateSegmentData
  ) => Promise<void>;
  deleteSegment: (tripId: string, segmentId: string) => Promise<void>;

  // Summary Actions
  loadTripSummary: (tripId: string) => Promise<void>;
  clearSummaryData: () => void;

  // Wizard Actions
  setWizardLocationAction: (location: Location | null) => void;
  setWizardDatesAction: (startDate: Date, endDate: Date) => void;
  setWizardSpotsAction: (spots: Spot[]) => void;
  setWizardStepAction: (step: number) => void;
  resetWizardAction: () => void;

  // General
  clearFormError: () => void;
  clearAllData: () => void;
}

/**
 * Custom hook: useTripPlannerLogic
 * Provides trip planner state and operations
 */
export function useTripPlannerLogic(): TripPlannerLogic {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.tripPlanner);

  console.log('[useTripPlannerLogic] Hook called, tripCount:', state.list.length);

  // ============= TRIP LIST ACTIONS =============

  const loadTrips = async (filters?: TripFilters) => {
    console.log('[useTripPlannerLogic] Loading trips with filters:', filters);
    try {
      await dispatch(fetchTrips(filters)).unwrap();
      console.log('[useTripPlannerLogic] Trips loaded successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to load trips:', error);
      throw error;
    }
  };

  const refreshTrips = async () => {
    console.log('[useTripPlannerLogic] Refreshing trips with current filters:', state.filters);
    try {
      await dispatch(fetchTrips(state.filters)).unwrap();
      console.log('[useTripPlannerLogic] Trips refreshed successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to refresh trips:', error);
      throw error;
    }
  };

  const updateTripFilters = (newFilters: TripFilters) => {
    console.log('[useTripPlannerLogic] Updating filters:', newFilters);
    dispatch(setFilters(newFilters));
  };

  const resetTripFilters = () => {
    console.log('[useTripPlannerLogic] Resetting filters');
    dispatch(clearFilters());
  };

  // ============= TRIP DETAIL ACTIONS =============

  const loadTripDetail = async (tripId: string) => {
    console.log('[useTripPlannerLogic] Loading trip detail:', tripId);
    try {
      await dispatch(fetchTripDetail(tripId)).unwrap();
      console.log('[useTripPlannerLogic] Trip detail loaded successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to load trip detail:', error);
      throw error;
    }
  };

  const createTrip = async (data: CreateTripData): Promise<TripPlan> => {
    console.log('[useTripPlannerLogic] Creating trip:', data.name);
    try {
      const result = await dispatch(createTripAsync(data)).unwrap();
      console.log('[useTripPlannerLogic] Trip created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to create trip:', error);
      throw error;
    }
  };

  const updateTrip = async (tripId: string, data: UpdateTripData) => {
    console.log('[useTripPlannerLogic] Updating trip:', tripId);
    try {
      await dispatch(updateTripAsync({ id: tripId, payload: data })).unwrap();
      console.log('[useTripPlannerLogic] Trip updated successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to update trip:', error);
      throw error;
    }
  };

  const deleteTrip = async (tripId: string) => {
    console.log('[useTripPlannerLogic] Deleting trip:', tripId);
    try {
      await dispatch(deleteTripAsync(tripId)).unwrap();
      console.log('[useTripPlannerLogic] Trip deleted successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to delete trip:', error);
      throw error;
    }
  };

  const clearCurrentTripData = () => {
    console.log('[useTripPlannerLogic] Clearing current trip data');
    dispatch(clearCurrentTrip());
  };

  // ============= SEGMENT ACTIONS =============

  const addSegment = async (
    tripId: string,
    data: CreateSegmentData
  ): Promise<UserSegment> => {
    console.log('[useTripPlannerLogic] Adding segment to trip:', tripId);
    try {
      const result = await dispatch(addSegmentAsync({ tripId, payload: data })).unwrap();
      console.log('[useTripPlannerLogic] Segment added successfully:', result.id);
      return result;
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to add segment:', error);
      throw error;
    }
  };

  const updateSegment = async (
    tripId: string,
    segmentId: string,
    data: UpdateSegmentData
  ) => {
    console.log('[useTripPlannerLogic] Updating segment:', segmentId);
    try {
      await dispatch(updateSegmentAsync({ tripId, segmentId, payload: data })).unwrap();
      console.log('[useTripPlannerLogic] Segment updated successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to update segment:', error);
      throw error;
    }
  };

  const deleteSegment = async (tripId: string, segmentId: string) => {
    console.log('[useTripPlannerLogic] Deleting segment:', segmentId);
    try {
      await dispatch(deleteSegmentAsync({ tripId, segmentId })).unwrap();
      console.log('[useTripPlannerLogic] Segment deleted successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to delete segment:', error);
      throw error;
    }
  };

  // ============= SUMMARY ACTIONS =============

  const loadTripSummary = async (tripId: string) => {
    console.log('[useTripPlannerLogic] Loading trip summary:', tripId);
    try {
      await dispatch(fetchTripSummary(tripId)).unwrap();
      console.log('[useTripPlannerLogic] Trip summary loaded successfully');
    } catch (error) {
      console.error('[useTripPlannerLogic] Failed to load trip summary:', error);
      throw error;
    }
  };

  const clearSummaryData = () => {
    console.log('[useTripPlannerLogic] Clearing trip summary');
    dispatch(clearTripSummary());
  };

  // ============= GENERAL ACTIONS =============

  const clearFormErrorAction = () => {
    console.log('[useTripPlannerLogic] Clearing form error');
    dispatch(clearFormError());
  };

  const clearAllData = () => {
    console.log('[useTripPlannerLogic] Clearing all trip data');
    dispatch(clearTripsData());
  };

  // ============= WIZARD ACTIONS =============

  const setWizardLocationAction = (location: Location | null) => {
    console.log('[useTripPlannerLogic] Setting wizard location:', location?.name);
    dispatch(setWizardLocation(location));
  };

  const setWizardDatesAction = (startDate: Date, endDate: Date) => {
    console.log('[useTripPlannerLogic] Setting wizard dates');
    dispatch(setWizardDates({ 
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }));
  };

  const setWizardSpotsAction = (spots: Spot[]) => {
    console.log('[useTripPlannerLogic] Setting wizard spots, count:', spots.length);
    dispatch(setWizardSpots(spots));
  };

  const setWizardStepAction = (step: number) => {
    console.log('[useTripPlannerLogic] Setting wizard step:', step);
    dispatch(setWizardStep(step));
  };

  const resetWizardAction = () => {
    console.log('[useTripPlannerLogic] Resetting wizard');
    dispatch(resetWizard());
  };

  return {
    // List State
    trips: state.list,
    totalTrips: state.pagination?.total || 0,
    currentPage: state.pagination?.page || 1,
    isTripsLoading: state.listLoading,
    tripsError: state.listError,

    // Detail State
    currentTrip: state.currentTrip,
    currentSegments: state.currentSegments,
    isTripLoading: state.detailLoading,
    tripError: state.detailError,

    // Summary State
    tripSummary: state.tripSummary,
    isSummaryLoading: state.summaryLoading,
    summaryError: state.summaryError,

    // Form State
    isFormSubmitting: state.formLoading,
    formError: state.formError,

    // Filters
    filters: state.filters,

    // Wizard State
    wizardCurrentStep: state.wizard.currentStep,
    wizardSelectedLocation: state.wizard.selectedLocation,
    wizardStartDate: state.wizard.startDate ? new Date(state.wizard.startDate) : null,
    wizardEndDate: state.wizard.endDate ? new Date(state.wizard.endDate) : null,
    wizardSelectedSpots: state.wizard.selectedSpots,

    // Trip List Actions
    loadTrips,
    refreshTrips,
    updateTripFilters,
    resetTripFilters,

    // Trip Detail Actions
    loadTripDetail,
    createTrip,
    updateTrip,
    deleteTrip,
    clearCurrentTripData,

    // Segment Actions
    addSegment,
    updateSegment,
    deleteSegment,

    // Summary Actions
    loadTripSummary,
    clearSummaryData,

    // Wizard Actions
    setWizardLocationAction,
    setWizardDatesAction,
    setWizardSpotsAction,
    setWizardStepAction,
    resetWizardAction,

    // General
    clearFormError: clearFormErrorAction,
    clearAllData,
  };
}

console.log('[useTripPlannerLogic] Hook module loaded');
