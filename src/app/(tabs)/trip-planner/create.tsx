/**
 * Trip Planner Wizard Screen
 * Main screen that orchestrates the trip creation flow
 * Uses Redux state management for wizard progress
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../../constants/translationKeys';
import { useTripPlannerLogic } from '../../../hooks/useTripPlannerLogic';
import { SlidingWindow } from '../../../components/tripPlanner/SlidingWindow';
import { LocationSelection } from '../../../components/tripPlanner/LocationSelection';
import { DateRangeSelection } from '../../../components/tripPlanner/DateRangeSelection';
import { SpotsSelection, Spot } from '../../../components/tripPlanner/SpotsSelection';
import { Location } from '../../../types/locations';
import { CreateTripData } from '../../../types/trips';

console.log('[TripPlannerWizard] Screen loaded');

export default function TripPlannerWizard() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    createTrip,
    isFormSubmitting,
    formError,
    // Wizard state from Redux
    wizardCurrentStep,
    wizardSelectedLocation,
    wizardStartDate,
    wizardEndDate,
    wizardSelectedSpots,
    // Wizard actions from Redux
    setWizardLocationAction,
    setWizardDatesAction,
    setWizardSpotsAction,
    resetWizardAction,
  } = useTripPlannerLogic();

  // Reset wizard when component mounts (fresh start)
  useEffect(() => {
    console.log('[TripPlannerWizard] Component mounted, resetting wizard');
    resetWizardAction();
  }, []);

  // Step 0: Location Selection
  const handleLocationSelected = (location: Location) => {
    console.log('[TripPlannerWizard] Location selected:', location);
    setWizardLocationAction(location);
  };

  // Step 1: Date Range Selection
  const handleDateRangeSelected = (start: Date, end: Date) => {
    console.log('[TripPlannerWizard] Dates selected:', start, end);
    setWizardDatesAction(start, end);
  };

  // Step 2: Spots Selection
  const handleSpotsSelected = async (spots: Spot[]) => {
    console.log('[TripPlannerWizard] Spots selected:', spots);
    setWizardSpotsAction(spots);

    // Create the trip plan
    try {
      const tripData: CreateTripData = {
        name: `${wizardSelectedLocation?.name} Trip`,
        description: `A ${Math.ceil(
          (wizardEndDate!.getTime() - wizardStartDate!.getTime()) /
            (1000 * 60 * 60 * 24) +
            1
        )}-day trip to ${wizardSelectedLocation?.name}`,
        primaryLocationId: wizardSelectedLocation!.id,
        startDate: wizardStartDate!.toISOString().split('T')[0],
        endDate: wizardEndDate!.toISOString().split('T')[0],
        estimatedBudget: 0,
        participantCount: 1,
        preferredHotelType: 'RESORT',
        preferredTransport: 'BUS',
        isPublic: false,
      };

      console.log('[TripPlannerWizard] Creating trip with data:', tripData);
      const createdTrip = await createTrip(tripData);
      console.log('[TripPlannerWizard] Trip created:', createdTrip.id);

      // Reset wizard and show success alert
      resetWizardAction();
      Alert.alert(
        t(TRANSLATION_KEYS.COMMON.SUCCESS),
        'Trip plan created! Redirecting...',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace(`/(tabs)/trip-planner/${createdTrip.id}`);
            },
          },
        ]
      );
    } catch (error) {
      console.error('[TripPlannerWizard] Error creating trip:', error);
      Alert.alert(t(TRANSLATION_KEYS.COMMON.ERROR), formError?.message || 'Failed to create trip plan');
    }
  };

  // Go back handler
  const handleGoBack = () => {
    if (wizardCurrentStep === 0) {
      // Reset wizard and go back
      resetWizardAction();
      router.back();
    } else {
      // Go to previous step
      router.back();
    }
  };

  const stepTitles = [
    t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_STEP_TITLE_LOCATION),
    t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_STEP_TITLE_DATES),
    t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_STEP_TITLE_SPOTS),
  ];
  const stepDescriptions = [
    t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_LOCATION_SUBTITLE),
    t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_DATE_SUBTITLE),
    t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_SPOTS_SUBTITLE),
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border dark:border-border-dark flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-xl font-bold font-heading text-text dark:text-text-dark">
            {stepTitles[wizardCurrentStep]}
          </Text>
          <Text className="text-xs text-muted dark:text-muted-dark mt-1">
            {t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_STEP_OF, { step: wizardCurrentStep + 1, total: 3 })}
          </Text>
        </View>
        <TouchableOpacity onPress={handleGoBack} className="p-2">
          <Feather name={wizardCurrentStep === 0 ? 'x' : 'chevron-left'} size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View className="h-1 bg-border dark:bg-border-dark">
        <View
          className="h-1 bg-primary"
          style={{
            width: `${((wizardCurrentStep + 1) / 3) * 100}%`,
          }}
        />
      </View>

      {/* Sliding Windows - MUST be flex-1 */}
      <SlidingWindow currentStep={wizardCurrentStep}>
        <LocationSelection
          onLocationSelected={handleLocationSelected}
          selectedLocation={wizardSelectedLocation}
        />
        {wizardSelectedLocation && (
          <DateRangeSelection
            onDateRangeSelected={handleDateRangeSelected}
            selectedStartDate={wizardStartDate}
            selectedEndDate={wizardEndDate}
          />
        )}
        {wizardSelectedLocation && wizardStartDate && wizardEndDate && (
          <SpotsSelection
            locationId={wizardSelectedLocation.id}
            onSpotsSelected={handleSpotsSelected}
            selectedSpots={wizardSelectedSpots}
          />
        )}
      </SlidingWindow>

      {/* Loading Overlay */}
      {isFormSubmitting && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center">
          <View className="bg-surface dark:bg-surface-dark rounded-lg p-6 items-center">
            <ActivityIndicator size="large" color="#0066FF" />
            <Text className="mt-4 text-text dark:text-text-dark font-semibold">{t(TRANSLATION_KEYS.TRIP_PLANNER.WIZARD_CREATING_TRIP)}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
