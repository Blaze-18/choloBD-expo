/**
 * Tour Builder Form Component
 * Form for creating and editing tour packages - Modern theme styling
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

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
  const { t } = useTranslation();
  
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
          tourType: initialData.tourType ?? undefined,
          duration: initialData.duration,
          maxGroupSize: initialData.maxGroupSize,
          totalBudget: initialData.totalBudget,
          rating: initialData.rating,
          isActive: initialData.isActive,
          isPopular: initialData.isPopular,
          locationId: (initialData as any).locationId || initialData.location?.id || '',
        }
      : {
          packageName: '',
          shortDescription: '',
          tourType: undefined,
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
        if (__DEV__) console.warn('[TourBuilderForm] Segments are invalid for new duration:', segmentValidation.errors);
      }
    }
  }, [duration, daySegments]);

  const handleAddSegment = () => {
    const newSegment: TourDaySegmentInput = {
      dayNumber: daySegments.length + 1,
      tourSpotId: '',
      transportOption: 'BUS',
      hotelOption: 'LUXURY',
    };
    setDaySegments([...daySegments, newSegment]);
  };

  const handleUpdateSegment = (index: number, segment: TourDaySegmentInput) => {
    const updated = [...daySegments];
    updated[index] = segment;
    // Re-number to ensure sequential days
    updated.forEach((seg, idx) => {
      seg.dayNumber = idx + 1;
    });
    setDaySegments(updated);
  };

  const handleDeleteSegment = (index: number) => {
    const updated = daySegments.filter((_, idx) => idx !== index);
    // Re-number
    updated.forEach((seg, idx) => {
      seg.dayNumber = idx + 1;
    });
    setDaySegments(updated);
  };

  const onSubmitForm = (formData: any) => {
    if (daySegments.length > 0) {
      const segmentValidation = validateSegmentsForDuration(daySegments, formData.duration);
      if (!segmentValidation.isValid) {
        if (__DEV__) console.error('[TourBuilderForm] Segment validation failed:', segmentValidation.errors);
        return;
      }
    }

    const payload = {
      ...formData,
      daySegments: daySegments.length > 0 ? daySegments : undefined,
    };

    const validation = validateCreateTourPlan(payload);
    if (!validation.isValid) {
      if (__DEV__) console.error('[TourBuilderForm] Form validation failed:', validation.errors);
      return;
    }

    onSubmit(payload);
  };

  const handleSubmitButtonPress = () => {
    if (isSubmitting) return;
    handleSubmit(onSubmitForm)();
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: bgColor }}>
      {errorMessage && (
        <View className="p-3 mx-4 mb-4 border rounded-lg" style={{ backgroundColor: errorColor + '10', borderColor: errorColor }}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="alert-circle" size={18} color={errorColor} />
            <Text style={{ color: errorColor }} className="flex-1 text-sm font-medium">
              {errorMessage}
            </Text>
          </View>
        </View>
      )}

      <View className="gap-4 px-4 pb-6">
        {/* Package Name */}
        <View>
          <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
            {t(TRANSLATION_KEYS.TOUR_BUILDER.PACKAGE_NAME)}
          </Text>
          <Controller
            control={control}
            name="packageName"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={{
                  borderColor: errors.packageName ? errorColor : borderColor,
                  backgroundColor: errors.packageName ? errorColor + '10' : surfaceColor,
                  color: textColor,
                  borderWidth: errors.packageName ? 1.5 : 1,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  minHeight: 44,
                }}
                value={value}
                onChangeText={onChange}
                placeholder={t(TRANSLATION_KEYS.TOUR_BUILDER.ENTER_PACKAGE_NAME)}
                placeholderTextColor={mutedColor}
              />
            )}
          />
          {errors.packageName && (
            <Text style={{ color: errorColor }} className="mt-1 text-xs font-medium">
              {errors.packageName.message}
            </Text>
          )}
        </View>

        {/* Location */}
        <View>
          <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
            {t(TRANSLATION_KEYS.TOUR_BUILDER.LOCATION)}
          </Text>
          <Controller
            control={control}
            name="locationId"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setLocationModalVisible(true)}
                  style={{
                    borderColor: (errors as any).locationId ? errorColor : borderColor,
                    backgroundColor: (errors as any).locationId ? errorColor + '10' : surfaceColor,
                    borderWidth: (errors as any).locationId ? 1.5 : 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                  className="flex-row items-center justify-between"
                >
                  <Text style={{ color: value ? textColor : mutedColor }}>
                    {value
                      ? locations.find((loc) => loc.id === value)?.name ||
                        t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_LOCATION)
                      : t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_LOCATION)}
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
                    <View className="justify-end flex-1">
                      <View
                        style={{ backgroundColor: surfaceColor }}
                        className="p-4 rounded-t-2xl max-h-96"
                      >
                        <View className="flex-row items-center justify-between mb-4">
                          <Text
                            style={{ color: textColor }}
                            className="text-lg font-semibold"
                          >
                            {t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_LOCATION)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => setLocationModalVisible(false)}
                          >
                            <Ionicons name="close" size={24} color={textColor} />
                          </TouchableOpacity>
                        </View>

                        <TextInput
                          style={{
                            borderColor,
                            backgroundColor: surfaceColor,
                            color: textColor,
                            borderWidth: 1,
                            borderRadius: 12,
                            paddingHorizontal: 14,
                            paddingVertical: 12,
                            fontSize: 14,
                            minHeight: 44,
                          }}
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
          {(errors as any).locationId && (
            <Text style={{ color: errorColor }} className="mt-1 text-xs font-medium">
              {(errors as any).locationId.message}
            </Text>
          )}
        </View>

        {/* Tour Type */}
        <View>
          <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
            {t(TRANSLATION_KEYS.TOUR_BUILDER.TOUR_TYPE)}
          </Text>
          <Controller
            control={control}
            name="tourType"
            render={({ field: { value, onChange } }) => (
              <>
                <TouchableOpacity
                  onPress={() => setTourTypeModalVisible(true)}
                  style={{
                    borderColor: errors.tourType ? errorColor : borderColor,
                    backgroundColor: errors.tourType ? errorColor + '10' : surfaceColor,
                    borderWidth: errors.tourType ? 1.5 : 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                  className="flex-row items-center justify-between"
                >
                  <Text style={{ color: value ? textColor : mutedColor }}>
                    {value || t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_TOUR_TYPE)}
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
                    <View className="justify-end flex-1">
                      <View
                        style={{ backgroundColor: surfaceColor }}
                        className="p-4 rounded-t-2xl max-h-96"
                      >
                        <View className="flex-row items-center justify-between mb-4">
                          <Text
                            style={{ color: textColor }}
                            className="text-lg font-semibold"
                          >
                            {t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_TOUR_TYPE)}
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
                                {t((TRANSLATION_KEYS.TOUR_BUILDER.TOUR_TYPES as any)[type] || `tourBuilder.tourTypes.${type.toLowerCase()}`)}
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
            <Text style={{ color: errorColor }} className="mt-1 text-xs font-medium">
              {errors.tourType.message}
            </Text>
          )}
        </View>

        {/* Duration & Budget Row */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.DURATION_DAYS)}
            </Text>
            <Controller
              control={control}
              name="duration"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={{
                    borderColor: errors.duration ? errorColor : borderColor,
                    backgroundColor: errors.duration ? errorColor + '10' : surfaceColor,
                    color: textColor,
                    borderWidth: errors.duration ? 1.5 : 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    minHeight: 44,
                  }}
                  value={String(value)}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  placeholder={t(TRANSLATION_KEYS.COMMON.SEARCH)}
                  keyboardType="number-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
            {errors.duration && (
              <Text style={{ color: errorColor }} className="mt-1 text-xs font-medium">
                {errors.duration.message}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.BUDGET)}
            </Text>
            <Controller
              control={control}
              name="totalBudget"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={{
                    borderColor: errors.totalBudget ? errorColor : borderColor,
                    backgroundColor: errors.totalBudget ? errorColor + '10' : surfaceColor,
                    color: textColor,
                    borderWidth: errors.totalBudget ? 1.5 : 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    minHeight: 44,
                  }}
                  value={String(value)}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  placeholder={t(TRANSLATION_KEYS.TOUR_BUILDER.AMOUNT)}
                  keyboardType="decimal-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
            {errors.totalBudget && (
              <Text style={{ color: errorColor }} className="mt-1 text-xs font-medium">
                {errors.totalBudget.message}
              </Text>
            )}
          </View>
        </View>

        {/* Max Group Size & Rating Row */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.MAX_GROUP_SIZE)}
            </Text>
            <Controller
              control={control}
              name="maxGroupSize"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={{
                    borderColor,
                    backgroundColor: surfaceColor,
                    color: textColor,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    minHeight: 44,
                  }}
                  value={String(value || '')}
                  onChangeText={(text) => onChange(parseInt(text) || undefined)}
                  placeholder={t(TRANSLATION_KEYS.BOOKING.OPTIONAL)}
                  keyboardType="number-pad"
                  placeholderTextColor={mutedColor}
                />
              )}
            />
          </View>

          <View className="flex-1">
            <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.RATING)}
            </Text>
            <Controller
              control={control}
              name="rating"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  style={{
                    borderColor,
                    backgroundColor: surfaceColor,
                    color: textColor,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 14,
                    minHeight: 44,
                  }}
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
          <Text style={{ color: textColor }} className="mb-2 text-sm font-semibold">
            {t(TRANSLATION_KEYS.TOUR_BUILDER.SHORT_DESCRIPTION)}
          </Text>
          <Controller
            control={control}
            name="shortDescription"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={{
                  borderColor,
                  backgroundColor: surfaceColor,
                  color: textColor,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 14,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
                value={value}
                onChangeText={onChange}
                placeholder={t(TRANSLATION_KEYS.TOUR_BUILDER.BRIEF_DESCRIPTION)}
                multiline
                numberOfLines={3}
                placeholderTextColor={mutedColor}
              />
            )}
          />
        </View>

        {/* Active & Popular switches */}
        <View className="gap-3 overflow-hidden rounded-xl">
          <View className="flex-row items-center justify-between px-4 py-3" style={{ backgroundColor: surfaceColor }}>
            <Text style={{ color: textColor }} className="font-semibold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.ACTIVE)}
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

          <View className="flex-row items-center justify-between px-4 py-3" style={{ backgroundColor: surfaceColor }}>
            <Text style={{ color: textColor }} className="font-semibold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.POPULAR)}
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
        <View className="pt-4 mt-4 border-t" style={{ borderColor: borderColor }}>
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: textColor }} className="text-base font-bold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.DAY_SEGMENTS)} ({daySegments.length} / {duration})
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-1 px-3 py-2 rounded-lg"
              onPress={handleAddSegment}
              disabled={daySegments.length >= (duration ?? 0)}
              style={[{ backgroundColor: primaryColor }, daySegments.length >= (duration ?? 0) && { opacity: 0.5 }]}
            >
              <Ionicons name="add" size={16} color="#fff" />
              <Text className="text-xs font-semibold text-white">{t(TRANSLATION_KEYS.TOUR_BUILDER.ADD_DAY)}</Text>
            </TouchableOpacity>
          </View>

          {daySegments.length === 0 && (
            <View className="items-center p-4 text-center rounded-xl" style={{ backgroundColor: surfaceColor }}>
              <Ionicons name="calendar" size={32} color={mutedColor} style={{ marginBottom: 8 }} />
              <Text style={{ color: mutedColor }} className="text-sm italic leading-none text-center">
                {t(TRANSLATION_KEYS.TOUR_BUILDER.NO_SEGMENTS)}
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
      <View className="gap-3 px-4 pb-8">
        {/* Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <View className="p-3 border-l-4 rounded-lg" style={{ backgroundColor: errorColor + '10', borderLeftColor: errorColor }}>
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="alert-circle" size={18} color={errorColor} />
              <Text style={{ color: errorColor }} className="text-sm font-semibold">
                {t(TRANSLATION_KEYS.TOUR_BUILDER.PLEASE_FIX_ERRORS)}
              </Text>
            </View>
            {Object.entries(errors).map(([fieldName, error]: any) => (
              <Text
                key={fieldName}
                style={{ color: errorColor }}
                className="mb-1 ml-6 text-xs"
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
            <Text className="text-base font-bold text-white">
              {isSubmitting ? t(TRANSLATION_KEYS.TOUR_BUILDER.SAVING) : isEditing ? t(TRANSLATION_KEYS.TOUR_BUILDER.UPDATE_TOUR) : t(TRANSLATION_KEYS.TOUR_BUILDER.CREATE_TOUR)}
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
            <Text style={{ color: primaryColor }} className="text-base font-bold">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.CANCEL)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

export default TourBuilderForm;
