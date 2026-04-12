/**
 * Tour Builder Form Component
 * Form for creating and editing tour packages - Modern theme styling
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  Switch,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateTourPlanData,
  UpdateTourPlanData,
  TourDaySegmentInput,
  TourPackage,
} from '../../types/tours';
import {
  CreateTourPlanSchema,
  UpdateTourPlanSchema,
  validateCreateTourPlan,
  validateSegmentsForDuration,
} from '../../validators/tours';
import { DaySegmentCard } from './DaySegmentCard';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';

console.log('[TourBuilderForm] Component loaded');

interface TourBuilderFormProps {
  initialData?: TourPackage;
  isEditing?: boolean;
  locations?: Array<{ id: string; name: string }>;
  onSubmit: (data: CreateTourPlanData | UpdateTourPlanData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export function TourBuilderForm({
  initialData,
  isEditing = false,
  locations = [],
  onSubmit,
  onCancel,
  isSubmitting = false,
  errorMessage,
}: TourBuilderFormProps) {
  const { isDark } = useTheme();
  
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const bgColor = isDark ? theme.colors['background-dark'] : theme.colors.background;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;

  console.log('[TourBuilderForm] Rendering, isEditing:', isEditing);

  const [daySegments, setDaySegments] = useState<TourDaySegmentInput[]>(
    initialData?.daySegments?.map(({ dayNumber, tourSpotId, activitySpotId, transportOption, hotelOption }) => ({
      dayNumber,
      tourSpotId,
      activitySpotId,
      transportOption,
      hotelOption,
    })) || []
  );

  const [tourTypeModalVisible, setTourTypeModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');

  const TOUR_TYPES = ['ADVENTURE', 'CULTURAL', 'BEACH', 'CITY_TOUR', 'NATURE', 'RELIGIOUS', 'HISTORICAL', 'MIXED'];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEditing ? UpdateTourPlanSchema : CreateTourPlanSchema),
    defaultValues: initialData
      ? {
          packageName: initialData.packageName,
          shortDescription: initialData.shortDescription,
          tourType: initialData.tourType,
          duration: initialData.duration,
          maxGroupSize: initialData.maxGroupSize,
          totalBudget: initialData.totalBudget,
          rating: initialData.rating,
          isActive: initialData.isActive,
          isPopular: initialData.isPopular,
          locationId: initialData.locationId || '',
        }
      : {
          packageName: '',
          shortDescription: '',
          tourType: '',
          duration: 1,
          maxGroupSize: 10,
          totalBudget: 0,
          rating: 0,
          isActive: true,
          isPopular: false,
          locationId: '',
        },
  });

  const duration = watch('duration');
  const isActive = watch('isActive');
  const isPopular = watch('isPopular');
  const locationId = watch('locationId');

  // Validate segments when duration changes
  useEffect(() => {
    if (daySegments.length > 0 && duration) {
      const segmentValidation = validateSegmentsForDuration(daySegments, duration);
      if (!segmentValidation.isValid) {
        console.warn('[TourBuilderForm] Segments are invalid for new duration:', segmentValidation.errors);
      }
    }
  }, [duration, daySegments]);

  const handleAddSegment = () => {
    console.log('[TourBuilderForm] Adding segment for day:', daySegments.length + 1);
    const newSegment: TourDaySegmentInput = {
      dayNumber: daySegments.length + 1,
      tourSpotId: '',
      transportOption: 'BUS',
      hotelOption: 'LUXURY',
    };
    setDaySegments([...daySegments, newSegment]);
  };

  const handleUpdateSegment = (index: number, segment: TourDaySegmentInput) => {
    console.log('[TourBuilderForm] Updating segment at index:', index);
    const updated = [...daySegments];
    updated[index] = segment;
    // Re-number to ensure sequential days
    updated.forEach((seg, idx) => {
      seg.dayNumber = idx + 1;
    });
    setDaySegments(updated);
  };

  const handleDeleteSegment = (index: number) => {
    console.log('[TourBuilderForm] Deleting segment at index:', index);
    const updated = daySegments.filter((_, idx) => idx !== index);
    // Re-number
    updated.forEach((seg, idx) => {
      seg.dayNumber = idx + 1;
    });
    setDaySegments(updated);
  };

  const onSubmitForm = (formData: any) => {
    console.log('[TourBuilderForm] ========== FORM SUBMITTED ==========');
    console.log('[TourBuilderForm] Form data:', formData);
    console.log('[TourBuilderForm] Day segments:', daySegments);

    // Validate segments
    if (daySegments.length > 0) {
      console.log('[TourBuilderForm] Validating segments for duration:', formData.duration);
      const segmentValidation = validateSegmentsForDuration(daySegments, formData.duration);
      if (!segmentValidation.isValid) {
        console.error('[TourBuilderForm] ❌ Segment validation failed:', segmentValidation.errors);
        return;
      }
      console.log('[TourBuilderForm] ✅ Segments validation passed');
    } else {
      console.log('[TourBuilderForm] No day segments provided');
    }

    const payload = {
      ...formData,
      daySegments: daySegments.length > 0 ? daySegments : undefined,
    };

    // Validate entire payload
    console.log('[TourBuilderForm] Validating payload...');
    const validation = validateCreateTourPlan(payload);
    if (!validation.isValid) {
      console.error('[TourBuilderForm] ❌ Form validation failed:', validation.errors);
      return;
    }
    console.log('[TourBuilderForm] ✅ Payload validation passed');
    console.log('[TourBuilderForm] Calling onSubmit callback with payload');

    onSubmit(payload);
  };

  const handleSubmitButtonPress = () => {
    console.log('[TourBuilderForm] ========== SUBMIT BUTTON PRESSED ==========');
    console.log('[TourBuilderForm] isSubmitting:', isSubmitting);
    console.log('[TourBuilderForm] Form errors:', JSON.stringify(errors, null, 2));
    console.log('[TourBuilderForm] Watched form values:', watch());
    if (isSubmitting) {
      console.log('[TourBuilderForm] Button disabled (already submitting)');
      return;
    }
    console.log('[TourBuilderForm] Triggering form submission via handleSubmit...');
    handleSubmit(onSubmitForm)();
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
    title: {
      color: textColor,
    },
    label: {
      color: textColor,
    },
    input: {
      borderColor: borderColor,
      backgroundColor: surfaceColor,
      color: textColor,
      placeholderTextColor: mutedColor,
    },
    inputError: {
      borderColor: errorColor,
      backgroundColor: errorColor + '10',
    },
    errorText: {
      color: errorColor,
    },
    errorAlert: {
      backgroundColor: errorColor + '10',
      borderColor: errorColor,
    },
    switchRow: {
      backgroundColor: surfaceColor,
    },
    emptyText: {
      color: mutedColor,
      backgroundColor: surfaceColor,
    },
    sectionTitle: {
      color: textColor,
    },
  });

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]}>
      {errorMessage && (
        <View className="mx-4 mb-4 p-3 rounded-lg border" style={[dynamicStyles.errorAlert, { borderColor: errorColor }]}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={18} color={errorColor} />
            <Text style={[styles.errorText, dynamicStyles.errorText]} className="flex-1">
              {errorMessage}
            </Text>
          </View>
        </View>
      )}

      <View className="px-4 gap-4 pb-6">
        {/* Package Name */}
        <View>
          <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
            Package Name *
          </Text>
          <Controller
            control={control}
            name="packageName"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={[styles.input, dynamicStyles.input, errors.packageName && dynamicStyles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder="Enter package name"
                placeholderTextColor={mutedColor}
              />
            )}
          />
          {errors.packageName && (
            <Text style={[styles.errorText, dynamicStyles.errorText]} className="text-xs mt-1">
              {errors.packageName.message}
            </Text>
          )}
        </View>

        {/* Location */}
        <View>
          <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
            Location *
          </Text>
          <Controller
            control={control}
            name="locationId"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setLocationModalVisible(true)}
                  style={[styles.input, dynamicStyles.input, errors.locationId && dynamicStyles.inputError]}
                  className="px-4 py-3 rounded-lg border flex-row justify-between items-center"
                >
                  <Text style={{ color: value ? textColor : mutedColor }}>
                    {value
                      ? locations.find((loc) => loc.id === value)?.name ||
                        'Select Location...'
                      : 'Select Location...'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={textColor} />
                </TouchableOpacity>

                <Modal
                  transparent
                  animationType="fade"
                  visible={locationModalVisible}
                  onRequestClose={() => setLocationModalVisible(false)}
                >
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => setLocationModalVisible(false)}
                    activeOpacity={1}
                  >
                    <View className="flex-1 justify-end">
                      <View
                        style={{ backgroundColor: surfaceColor }}
                        className="rounded-t-2xl p-4 max-h-96"
                      >
                        <View className="flex-row justify-between items-center mb-4">
                          <Text
                            style={{ color: textColor }}
                            className="text-lg font-semibold"
                          >
                            Select Location
                          </Text>
                          <TouchableOpacity
                            onPress={() => setLocationModalVisible(false)}
                          >
                            <Ionicons name="close" size={24} color={textColor} />
                          </TouchableOpacity>
                        </View>

                        <TextInput
                          style={[styles.input, dynamicStyles.input]}
                          value={locationSearch}
                          onChangeText={setLocationSearch}
                          placeholder="Search locations..."
                          placeholderTextColor={mutedColor}
                        />

                        <ScrollView className="mt-3">
                          {locations
                            .filter((loc) =>
                              loc.name
                                .toLowerCase()
                                .includes(locationSearch.toLowerCase())
                            )
                            .map((location) => (
                              <TouchableOpacity
                                key={location.id}
                                onPress={() => {
                                  onChange(location.id);
                                  setLocationModalVisible(false);
                                  setLocationSearch('');
                                }}
                                className={`py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between ${
                                  value === location.id ? 'opacity-100' : 'opacity-60'
                                }`}
                                style={{
                                  backgroundColor:
                                    value === location.id
                                      ? primaryColor + '20'
                                      : 'transparent',
                                }}
                              >
                                <Text
                                  style={{
                                    color:
                                      value === location.id
                                        ? primaryColor
                                        : textColor,
                                    fontWeight:
                                      value === location.id ? '600' : '400',
                                  }}
                                >
                                  {location.name}
                                </Text>
                                {value === location.id && (
                                  <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color={primaryColor}
                                  />
                                )}
                              </TouchableOpacity>
                            ))}
                        </ScrollView>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>
            )}
          />
          {errors.locationId && (
            <Text style={[styles.errorText, dynamicStyles.errorText]} className="text-xs mt-1">
              {errors.locationId.message}
            </Text>
          )}
        </View>

        {/* Tour Type */}
        <View>
          <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
            Tour Type *
          </Text>
          <Controller
            control={control}
            name="tourType"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setTourTypeModalVisible(true)}
                  style={[styles.input, dynamicStyles.input, errors.tourType && dynamicStyles.inputError]}
                  className="px-4 py-3 rounded-lg border flex-row justify-between items-center"
                >
                  <Text style={{ color: value ? textColor : mutedColor }}>
                    {value || 'Select Tour Type...'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={textColor} />
                </TouchableOpacity>

                <Modal
                  transparent
                  animationType="fade"
                  visible={tourTypeModalVisible}
                  onRequestClose={() => setTourTypeModalVisible(false)}
                >
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onPress={() => setTourTypeModalVisible(false)}
                    activeOpacity={1}
                  >
                    <View className="flex-1 justify-end">
                      <View
                        style={{ backgroundColor: surfaceColor }}
                        className="rounded-t-2xl p-4 max-h-96"
                      >
                        <View className="flex-row justify-between items-center mb-4">
                          <Text
                            style={{ color: textColor }}
                            className="text-lg font-semibold"
                          >
                            Select Tour Type
                          </Text>
                          <TouchableOpacity
                            onPress={() => setTourTypeModalVisible(false)}
                          >
                            <Ionicons name="close" size={24} color={textColor} />
                          </TouchableOpacity>
                        </View>

                        <ScrollView>
                          {TOUR_TYPES.map((type) => (
                            <TouchableOpacity
                              key={type}
                              onPress={() => {
                                onChange(type);
                                setTourTypeModalVisible(false);
                              }}
                              className={`py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between ${
                                value === type ? 'opacity-100' : 'opacity-60'
                              }`}
                              style={{
                                backgroundColor: value === type ? primaryColor + '20' : 'transparent',
                              }}
                            >
                              <Text
                                style={{
                                  color: value === type ? primaryColor : textColor,
                                  fontWeight: value === type ? '600' : '400',
                                }}
                              >
                                {type.replace(/_/g, ' ')}
                              </Text>
                              {value === type && (
                                <Ionicons
                                  name="checkmark-circle"
                                  size={20}
                                  color={primaryColor}
                                />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>
            )}
          />
          {errors.tourType && (
            <Text style={[styles.errorText, dynamicStyles.errorText]} className="text-xs mt-1">
              {errors.tourType.message}
            </Text>
          )}
        </View>

        {/* Duration & Budget Row */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
              Duration (days) *
            </Text>
            <Controller
              control={control}
              name="duration"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={[styles.input, dynamicStyles.input, errors.duration && dynamicStyles.inputError]}
                  value={String(value)}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  placeholder="Days"
                  keyboardType="number-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
            {errors.duration && (
              <Text style={[styles.errorText, dynamicStyles.errorText]} className="text-xs mt-1">
                {errors.duration.message}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
              Budget (৳) *
            </Text>
            <Controller
              control={control}
              name="totalBudget"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={[styles.input, dynamicStyles.input, errors.totalBudget && dynamicStyles.inputError]}
                  value={String(value)}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  placeholder="Amount"
                  keyboardType="decimal-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
            {errors.totalBudget && (
              <Text style={[styles.errorText, dynamicStyles.errorText]} className="text-xs mt-1">
                {errors.totalBudget.message}
              </Text>
            )}
          </View>
        </View>

        {/* Max Group Size & Rating Row */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
              Max Group Size
            </Text>
            <Controller
              control={control}
              name="maxGroupSize"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  value={String(value || '')}
                  onChangeText={(text) => onChange(parseInt(text) || undefined)}
                  placeholder="Optional"
                  keyboardType="number-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
          </View>

          <View className="flex-1">
            <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
              Rating (0-5)
            </Text>
            <Controller
              control={control}
              name="rating"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  value={String(value || '')}
                  onChangeText={(text) => onChange(parseFloat(text) || undefined)}
                  placeholder="0.0"
                  keyboardType="decimal-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
          </View>
        </View>

        {/* Short Description */}
        <View>
          <Text style={[styles.label, dynamicStyles.label]} className="mb-2 text-sm font-semibold">
            Short Description
          </Text>
          <Controller
            control={control}
            name="shortDescription"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={[styles.input, dynamicStyles.input, styles.multilineInput]}
                value={value}
                onChangeText={onChange}
                placeholder="Brief description of the tour"
                multiline
                numberOfLines={3}
                placeholderTextColor={mutedColor}
              />
            )}
          />
        </View>

        {/* Active & Popular switches */}
        <View className="gap-3 rounded-xl overflow-hidden">
          <View style={[styles.switchRow, dynamicStyles.switchRow]} className="flex-row items-center justify-between px-4 py-3">
            <Text style={[styles.label, dynamicStyles.label, { marginBottom: 0 }]} className="font-semibold">
              Active
            </Text>
            <Controller
              control={control}
              name="isActive"
              render={({ field: { value, onChange } }) => (
                <Switch 
                  value={value} 
                  onValueChange={onChange}
                  trackColor={{ false: borderColor, true: primaryColor + '40' }}
                  thumbColor={isActive ? primaryColor : mutedColor}
                />
              )}
            />
          </View>

          <View style={[styles.switchRow, dynamicStyles.switchRow]} className="flex-row items-center justify-between px-4 py-3">
            <Text style={[styles.label, dynamicStyles.label, { marginBottom: 0 }]} className="font-semibold">
              Popular
            </Text>
            <Controller
              control={control}
              name="isPopular"
              render={({ field: { value, onChange } }) => (
                <Switch 
                  value={value} 
                  onValueChange={onChange}
                  trackColor={{ false: borderColor, true: primaryColor + '40' }}
                  thumbColor={isPopular ? primaryColor : mutedColor}
                />
              )}
            />
          </View>
        </View>

        {/* Day Segments Section */}
        <View className="mt-4 pt-4 border-t" style={{ borderColor: borderColor }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
              Day Segments ({daySegments.length} / {duration})
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-1 px-3 py-2 rounded-lg"
              style={{ backgroundColor: primaryColor }}
              onPress={handleAddSegment}
              disabled={daySegments.length >= duration}
              style={[{ backgroundColor: primaryColor }, daySegments.length >= duration && { opacity: 0.5 }]}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text className="text-xs font-semibold text-white">Add Day</Text>
            </TouchableOpacity>
          </View>

          {daySegments.length === 0 && (
            <View style={[styles.emptyState, dynamicStyles.emptyText]} className="p-4 rounded-xl text-center">
              <Ionicons name="calendar" size={32} color={mutedColor} style={{ marginBottom: 8, textAlign: 'center' }} />
              <Text style={[styles.emptyText, dynamicStyles.emptyText]}>
                No day segments added yet. Tap "Add Day" to start planning the tour.
              </Text>
            </View>
          )}

          {daySegments.map((segment, idx) => (
            <DaySegmentCard
              key={idx}
              segment={segment}
              dayNumber={segment.dayNumber}
              isEditable={true}
              onUpdate={(updated) => handleUpdateSegment(idx, updated)}
              onDelete={() => handleDeleteSegment(idx)}
              isEnriched={false}
              locationId={locationId}
            />
          ))}
        </View>
      </View>

      {/* Form Actions */}
      <View className="px-4 pb-8 gap-3">
        {/* Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <View className="p-3 rounded-lg border-l-4" style={{ backgroundColor: errorColor + '10', borderLeftColor: errorColor }}>
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="alert-circle" size={18} color={errorColor} />
              <Text style={{ color: errorColor }} className="font-semibold text-sm">
                Please fix the following errors:
              </Text>
            </View>
            {Object.entries(errors).map(([fieldName, error]: any) => (
              <Text
                key={fieldName}
                style={{ color: errorColor }}
                className="text-xs ml-6 mb-1"
              >
                • {fieldName}: {error?.message || 'Invalid'}
              </Text>
            ))}
          </View>
        )}

        <TouchableOpacity
          className="py-3.5 rounded-xl items-center justify-center active:opacity-80"
          style={{ backgroundColor: successColor, opacity: isSubmitting ? 0.6 : 1 }}
          onPress={handleSubmitButtonPress}
          disabled={isSubmitting}
        >
          <View className="flex-row items-center gap-2">
            <Ionicons 
              name={isSubmitting ? "hourglass" : "checkmark-done"} 
              size={18} 
              color="#fff" 
            />
            <Text className="text-white font-bold text-base">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Tour' : 'Create Tour'}
            </Text>
          </View>
        </TouchableOpacity>

        {onCancel && (
          <TouchableOpacity
            className="py-3.5 rounded-xl items-center justify-center border active:opacity-80"
            style={{ borderColor: primaryColor, opacity: isSubmitting ? 0.6 : 1 }}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={{ color: primaryColor }} className="font-bold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 44,
  },
  inputError: {
    borderWidth: 1.5,
  },
  multilineInput: {
    paddingVertical: 12,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorAlert: {
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default TourBuilderForm;
