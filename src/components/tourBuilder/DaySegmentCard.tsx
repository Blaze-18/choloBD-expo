/**
 * Day Segment Card Component
 * Modern, clean, minimal design with nativewind
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TourDaySegment, TourDaySegmentInput, TransportServiceType, HotelOptionType, TransportQualityType, TRANSPORT_QUALITY_MAP } from '../../types/tours';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { getTourSpots, getActivitySpots } from '../../services/api/tourBuilder';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface DaySegmentCardProps {
  segment: TourDaySegment | TourDaySegmentInput;
  dayNumber: number;
  isEditable?: boolean;
  onUpdate?: (segment: TourDaySegmentInput) => void;
  onDelete?: () => void;
  isEnriched?: boolean; // true if it's a TourDaySegment with names
  locationId?: string; // Location ID to filter tour spots and activity spots
}

interface EditState {
  tourSpotId: string;
  activitySpotId?: string;
  transportOption: TransportServiceType;
  transportQuality?: TransportQualityType;
  hotelOption: HotelOptionType;
}

export function DaySegmentCard({
  segment,
  dayNumber,
  isEditable = false,
  onUpdate,
  onDelete,
  isEnriched = false,
  locationId,
}: DaySegmentCardProps) {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<EditState>({
    tourSpotId: segment.tourSpotId,
    activitySpotId: segment.activitySpotId,
    transportOption: segment.transportOption,
    transportQuality: segment.transportQuality,
    hotelOption: segment.hotelOption,
  });

  // Browse spots states
  const [tourSpots, setTourSpots] = useState<Array<{ id: string; name: string; location?: string }>>([]);
  const [activitySpots, setActivitySpots] = useState<Array<{ id: string; name: string; location?: string }>>([]);
  const [spotsLoading, setSpotsLoading] = useState(false);
  const [tourSpotModalVisible, setTourSpotModalVisible] = useState(false);
  const [activitySpotModalVisible, setActivitySpotModalVisible] = useState(false);
  const [tourSpotSearch, setTourSpotSearch] = useState('');
  const [activitySpotSearch, setActivitySpotSearch] = useState('');

  // Fetch available spots when edit mode opens or locationId changes
  useEffect(() => {
    if (isEditMode) {
      fetchAvailableSpots();
    }
  }, [isEditMode, locationId]);

  // Also fetch spots on mount to show names in display mode
  useEffect(() => {
    fetchAvailableSpots();
  }, [locationId]);

  const fetchAvailableSpots = async () => {
    try {
      setSpotsLoading(true);
      const [spots, activities] = await Promise.all([
        getTourSpots(locationId),
        getActivitySpots(locationId),
      ]);
      setTourSpots(spots);
      setActivitySpots(activities);
    } catch (error) {
      if (__DEV__) console.error('[DaySegmentCard] Error fetching spots:', error);
    } finally {
      setSpotsLoading(false);
    }
  };

  const getTourSpotName = (spotId: string) => {
    return tourSpots.find((s) => s.id === spotId)?.name || spotId;
  };

  const getActivitySpotName = (spotId: string) => {
    return activitySpots.find((s) => s.id === spotId)?.name || spotId;
  };

  // Theme colors
  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const successColor = isDark ? theme.colors['success-dark'] : theme.colors.success;
  const warningColor = isDark ? theme.colors['warning-dark'] : theme.colors.warning;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;

  const transportOptions: TransportServiceType[] = ['BUS', 'FLIGHT', 'TRAIN', 'CAR_RENTAL', 'FERRY', 'SELF_MANAGED'];
  const hotelOptions: HotelOptionType[] = ['LUXURY', 'BUDGET', 'BOUTIQUE', 'RESORT', 'HOSTEL', 'GUESTHOUSE', 'APARTMENT'];

  // Get quality options for the selected transport type
  const getQualityOptionsForTransport = (transportOption: TransportServiceType): TransportQualityType[] | null => {
    return TRANSPORT_QUALITY_MAP[transportOption];
  };

  const currentTransportQualityOptions = getQualityOptionsForTransport(editData.transportOption);

  const handleSave = () => {
    onUpdate?.({ dayNumber, ...editData });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditData({
      tourSpotId: segment.tourSpotId,
      activitySpotId: segment.activitySpotId,
      transportOption: segment.transportOption,
      transportQuality: segment.transportQuality,
      hotelOption: segment.hotelOption,
    });
    setIsEditMode(false);
  };

  if (isEditMode && isEditable) {
    return (
      <View
        className="mx-3 mb-3 overflow-hidden rounded-2xl"
        style={{
          backgroundColor: surfaceColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        {/* Edit Mode Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-border dark:border-border-dark">
          <View>
            <Text className="text-sm font-bold text-primary dark:text-primary-dark">{t(TRANSLATION_KEYS.TOUR_BUILDER.DAY_EDIT, { day: dayNumber })}</Text>
            <Text className="mt-1 text-xs text-muted dark:text-muted-dark">{t(TRANSLATION_KEYS.TOUR_BUILDER.CUSTOMIZE_ITINERARY)}</Text>
          </View>
          <TouchableOpacity onPress={handleCancel} className="p-1">
            <Ionicons name="close" size={24} color={mutedColor} />
          </TouchableOpacity>
        </View>

        <View className="gap-4 px-4 py-4">
          {/* Tour Spot Selection */}
          <View>
            <Text className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.TOUR_SPOT)}
            </Text>
            <TouchableOpacity
              onPress={() => setTourSpotModalVisible(true)}
              style={{
                borderColor,
                backgroundColor: surfaceColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
              className="flex-row items-center justify-between"
            >
              <Text style={{ color: editData.tourSpotId ? textColor : mutedColor }}>
                {editData.tourSpotId ? getTourSpotName(editData.tourSpotId) : t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_TOUR_SPOT)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={primaryColor} />
            </TouchableOpacity>
          </View>

          {/* Activity Spot Selection */}
          <View>
            <Text className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.ACTIVITY_SPOT)}
            </Text>
            <TouchableOpacity
              onPress={() => setActivitySpotModalVisible(true)}
              style={{
                borderColor,
                backgroundColor: surfaceColor,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
              }}
              className="flex-row items-center justify-between"
            >
              <Text style={{ color: editData.activitySpotId ? textColor : mutedColor }}>
                {editData.activitySpotId ? getActivitySpotName(editData.activitySpotId) : t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_ACTIVITY_SPOT)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={primaryColor} />
            </TouchableOpacity>
          </View>

          {/* Transport Option */}
          <View>
            <Text className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.TRANSPORT)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              <View style={{ gap: 8, flexDirection: 'row' }}>
                {transportOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={{
                      borderColor: editData.transportOption === option ? primaryColor : borderColor,
                      backgroundColor: editData.transportOption === option ? primaryColor : surfaceColor,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                    onPress={() => setEditData({ ...editData, transportOption: option, transportQuality: undefined })}
                  >
                    <Text
                      style={{
                        color: editData.transportOption === option ? '#fff' : textColor,
                        fontWeight: '500',
                      }}
                      numberOfLines={1}
                    >
                      {option.replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Transport Quality */}
          {currentTransportQualityOptions !== null && (
            <View>
              <Text className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted dark:text-muted-dark">
                {t(TRANSLATION_KEYS.TOUR_BUILDER.TRANSPORT_QUALITY)}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
                <View style={{ gap: 8, flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{
                      borderColor: !editData.transportQuality ? primaryColor : borderColor,
                      backgroundColor: !editData.transportQuality ? primaryColor : surfaceColor,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                    onPress={() => setEditData({ ...editData, transportQuality: undefined })}
                  >
                    <Text
                      style={{
                        color: !editData.transportQuality ? '#fff' : textColor,
                        fontWeight: '500',
                      }}
                      numberOfLines={1}
                    >
                      {t(TRANSLATION_KEYS.TOUR_BUILDER.NONE)}
                    </Text>
                  </TouchableOpacity>
                  {currentTransportQualityOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={{
                        borderColor: editData.transportQuality === option ? primaryColor : borderColor,
                        backgroundColor: editData.transportQuality === option ? primaryColor : surfaceColor,
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                      }}
                      onPress={() => setEditData({ ...editData, transportQuality: option })}
                    >
                      <Text
                        style={{
                          color: editData.transportQuality === option ? '#fff' : textColor,
                          fontWeight: '500',
                        }}
                        numberOfLines={1}
                      >
                        {option.replace(/_/g, ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Hotel Option */}
          <View>
            <Text className="mb-2 text-xs font-semibold tracking-wider uppercase text-muted dark:text-muted-dark">
              {t(TRANSLATION_KEYS.TOUR_BUILDER.HOTEL)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              <View style={{ gap: 8, flexDirection: 'row' }}>
                {hotelOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={{
                      borderColor: editData.hotelOption === option ? warningColor : borderColor,
                      backgroundColor: editData.hotelOption === option ? warningColor : surfaceColor,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                    onPress={() => setEditData({ ...editData, hotelOption: option })}
                  >
                    <Text
                      style={{
                        color: editData.hotelOption === option ? '#fff' : textColor,
                        fontWeight: '500',
                      }}
                      numberOfLines={1}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Tour Spot Browse Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={tourSpotModalVisible}
          onRequestClose={() => setTourSpotModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setTourSpotModalVisible(false)}
            activeOpacity={1}
          >
            <View className="justify-end flex-1">
              <View
                style={{ backgroundColor: surfaceColor }}
                className="p-4 rounded-t-2xl max-h-80"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text
                    style={{ color: textColor }}
                    className="text-lg font-semibold"
                  >
                    {t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_TOUR_SPOT)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTourSpotModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>

                {spotsLoading ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={{ color: mutedColor }} className="mt-2 text-sm">
                      {t(TRANSLATION_KEYS.COMMON.LOADING)}
                    </Text>
                  </View>
                ) : (
                  <>
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
                      value={tourSpotSearch}
                      onChangeText={setTourSpotSearch}
                      placeholder="Search tour spots..."
                      placeholderTextColor={mutedColor}
                    />

                    <ScrollView className="mt-3">
                      {tourSpots
                        .filter((spot) =>
                          spot.name
                            .toLowerCase()
                            .includes(tourSpotSearch.toLowerCase())
                        )
                        .map((spot) => (
                          <TouchableOpacity
                            key={spot.id}
                            onPress={() => {
                              setEditData({ ...editData, tourSpotId: spot.id });
                              setTourSpotModalVisible(false);
                            }}
                            className={`py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between ${
                              editData.tourSpotId === spot.id ? 'opacity-100' : 'opacity-70'
                            }`}
                            style={{
                              backgroundColor:
                                editData.tourSpotId === spot.id
                                  ? primaryColor + '20'
                                  : 'transparent',
                            }}
                          >
                            <View className="flex-1">
                              <Text
                                style={{
                                  color:
                                    editData.tourSpotId === spot.id
                                      ? primaryColor
                                      : textColor,
                                  fontWeight:
                                    editData.tourSpotId === spot.id ? '600' : '400',
                                }}
                              >
                                {spot.name}
                              </Text>
                              {spot.location && (
                                <Text
                                  style={{ color: mutedColor }}
                                  className="mt-1 text-xs"
                                >
                                  {spot.location}
                                </Text>
                              )}
                            </View>
                            {editData.tourSpotId === spot.id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={primaryColor}
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Activity Spot Browse Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={activitySpotModalVisible}
          onRequestClose={() => setActivitySpotModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
            onPress={() => setActivitySpotModalVisible(false)}
            activeOpacity={1}
          >
            <View className="justify-end flex-1">
              <View
                style={{ backgroundColor: surfaceColor }}
                className="p-4 rounded-t-2xl max-h-80"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text
                    style={{ color: textColor }}
                    className="text-lg font-semibold"
                  >
                    {t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_ACTIVITY_SPOT)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActivitySpotModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>

                {spotsLoading ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={{ color: mutedColor }} className="mt-2 text-sm">
                      {t(TRANSLATION_KEYS.COMMON.LOADING)}
                    </Text>
                  </View>
                ) : (
                  <>
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
                      value={activitySpotSearch}
                      onChangeText={setActivitySpotSearch}
                      placeholder="Search activity spots..."
                      placeholderTextColor={mutedColor}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        setEditData({ ...editData, activitySpotId: undefined });
                        setActivitySpotModalVisible(false);
                      }}
                      className="px-4 py-3 mb-2 border rounded-lg"
                      style={{
                        borderColor,
                      }}
                    >
                      <Text style={{ color: mutedColor }}>
                        <Ionicons name="ban" size={16} /> {t(TRANSLATION_KEYS.TOUR_BUILDER.NONE)}
                      </Text>
                    </TouchableOpacity>

                    <ScrollView className="mt-2">
                      {activitySpots
                        .filter((spot) =>
                          spot.name
                            .toLowerCase()
                            .includes(activitySpotSearch.toLowerCase())
                        )
                        .map((spot) => (
                          <TouchableOpacity
                            key={spot.id}
                            onPress={() => {
                              setEditData({
                                ...editData,
                                activitySpotId: spot.id,
                              });
                              setActivitySpotModalVisible(false);
                            }}
                            className={`py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between ${
                              editData.activitySpotId === spot.id
                                ? 'opacity-100'
                                : 'opacity-70'
                            }`}
                            style={{
                              backgroundColor:
                                editData.activitySpotId === spot.id
                                  ? primaryColor + '20'
                                  : 'transparent',
                            }}
                          >
                            <View className="flex-1">
                              <Text
                                style={{
                                  color:
                                    editData.activitySpotId === spot.id
                                      ? primaryColor
                                      : textColor,
                                  fontWeight:
                                    editData.activitySpotId === spot.id
                                      ? '600'
                                      : '400',
                                }}
                              >
                                {spot.name}
                              </Text>
                              {spot.location && (
                                <Text
                                  style={{ color: mutedColor }}
                                  className="mt-1 text-xs"
                                >
                                  {spot.location}
                                </Text>
                              )}
                            </View>
                            {editData.activitySpotId === spot.id && (
                              <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={primaryColor}
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Action Buttons */}
        <View className="flex-row gap-2 px-4 py-4 border-t" style={{ borderColor }}>
          <TouchableOpacity style={{ flex: 1, backgroundColor: successColor, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', minHeight: 44 }} onPress={handleSave} className="active:opacity-80">
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{t(TRANSLATION_KEYS.TOUR_BUILDER.SAVE)}</Text>
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity style={{ flex: 1, backgroundColor: errorColor, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center', minHeight: 44 }} onPress={onDelete} className="active:opacity-80">
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{t(TRANSLATION_KEYS.TOUR_BUILDER.DELETE)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Display mode (not editing)
  const enrichedSeg = segment as TourDaySegment;
  const tourSpotName = isEnriched 
    ? enrichedSeg.tourSpotName 
    : getTourSpotName(segment.tourSpotId) || 'Tour Spot';
  const activityName = isEnriched 
    ? enrichedSeg.activitySpotName 
    : (segment.activitySpotId ? getActivitySpotName(segment.activitySpotId) : 'N/A');

  return (
    <View
      className="mx-3 mb-3 overflow-hidden rounded-2xl"
      style={{
        backgroundColor: surfaceColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Day Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-border dark:border-border-dark">
        <View className="flex-row items-center gap-3">
          <View
            className="items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <Text className="text-lg font-bold text-white">{dayNumber}</Text>
          </View>
          <View>
            <Text className="text-base font-bold text-text dark:text-text-dark">Day {dayNumber}</Text>
            <Text className="text-xs text-muted dark:text-muted-dark">{tourSpotName}</Text>
          </View>
        </View>
        {isEditable && (
          <TouchableOpacity
            onPress={() => {
              setIsEditMode(true);
            }}
            className="p-2"
          >
            <Ionicons name="create-outline" size={20} color={primaryColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Details */}
      <View className="gap-3 px-4 py-4">
        {segment.activitySpotId && (
          <DetailRow
            icon="sparkles"
            label="Activity"
            value={activityName}
            color={successColor}
          />
        )}

        <DetailRow
          icon="car"
          label="Transport"
          value={segment.transportOption.replace(/_/g, ' ')}
          color={primaryColor}
        />

        {segment.transportQuality && (
          <DetailRow
            icon="star"
            label="Quality"
            value={segment.transportQuality.replace(/_/g, ' ')}
            color={primaryColor}
          />
        )}

        <DetailRow
          icon="bed"
          label="Hotel"
          value={segment.hotelOption}
          color={warningColor}
        />
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value, color }: any) {
  return (
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} size={18} color={color} />
      <View className="flex-1">
        <Text className="mb-1 text-xs font-medium tracking-wide uppercase text-muted dark:text-muted-dark">
          {label}
        </Text>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">
          {value}
        </Text>
      </View>
    </View>
  );
}

export default DaySegmentCard;
