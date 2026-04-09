/**
 * Day Segment Card Component
 * Modern, clean, minimal design with nativewind
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TourDaySegment, TourDaySegmentInput, TransportServiceType, HotelOptionType } from '../../types/tours';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { getTourSpots, getActivitySpots } from '../../services/api/tourBuilder';

console.log('[DaySegmentCard] Component loaded');

interface DaySegmentCardProps {
  segment: TourDaySegment | TourDaySegmentInput;
  dayNumber: number;
  isEditable?: boolean;
  onUpdate?: (segment: TourDaySegmentInput) => void;
  onDelete?: () => void;
  isEnriched?: boolean; // true if it's a TourDaySegment with names
}

interface EditState {
  tourSpotId: string;
  activitySpotId?: string;
  transportOption: TransportServiceType;
  hotelOption: HotelOptionType;
}

export function DaySegmentCard({
  segment,
  dayNumber,
  isEditable = false,
  onUpdate,
  onDelete,
  isEnriched = false,
}: DaySegmentCardProps) {
  const { isDark } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<EditState>({
    tourSpotId: segment.tourSpotId,
    activitySpotId: segment.activitySpotId,
    transportOption: segment.transportOption,
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

  // Fetch available spots when edit mode opens
  useEffect(() => {
    if (isEditMode && tourSpots.length === 0 && activitySpots.length === 0) {
      fetchAvailableSpots();
    }
  }, [isEditMode]);

  // Also fetch spots on mount to show names in display mode
  useEffect(() => {
    if (tourSpots.length === 0 && activitySpots.length === 0) {
      fetchAvailableSpots();
    }
  }, []);

  const fetchAvailableSpots = async () => {
    try {
      setSpotsLoading(true);
      const [spots, activities] = await Promise.all([getTourSpots(), getActivitySpots()]);
      setTourSpots(spots);
      setActivitySpots(activities);
    } catch (error) {
      console.error('[DaySegmentCard] Error fetching spots:', error);
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
  const onPrimaryColor = isDark ? theme.colors['onPrimary-dark'] : theme.colors['onPrimary'];

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: surfaceColor,
    },
    dayLabel: {
      color: textColor,
    },
    editText: {
      color: primaryColor,
    },
    cancelText: {
      color: mutedColor,
    },
    detailLabel: {
      color: mutedColor,
    },
    detailValue: {
      color: textColor,
    },
    transportBadge: {
      backgroundColor: primaryColor,
      color: onPrimaryColor,
    },
    formLabel: {
      color: textColor,
    },
    input: {
      borderColor: borderColor,
      backgroundColor: surfaceColor,
      color: textColor,
    },
    transportButton: {
      borderColor: borderColor,
      backgroundColor: surfaceColor,
    },
    transportButtonActive: {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
    transportButtonText: {
      color: textColor,
    },
    hotelButton: {
      borderColor: borderColor,
      backgroundColor: surfaceColor,
    },
    hotelButtonActive: {
      backgroundColor: warningColor,
      borderColor: warningColor,
    },
    hotelButtonText: {
      color: textColor,
    },
    saveButton: {
      backgroundColor: successColor,
    },
    deleteButton: {
      backgroundColor: errorColor,
    },
  });

  const transportOptions: TransportServiceType[] = ['BUS', 'FLIGHT', 'TRAIN', 'CAR_RENTAL', 'FERRY', 'SELF_MANAGED'];
  const hotelOptions: HotelOptionType[] = ['LUXURY', 'BUDGET', 'BOUTIQUE', 'RESORT', 'HOSTEL', 'GUESTHOUSE', 'APARTMENT'];

  const handleSave = () => {
    console.log('[DaySegmentCard] Saving segment:', dayNumber, editData);
    onUpdate?.({ dayNumber, ...editData });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    console.log('[DaySegmentCard] Cancelled edit mode for day:', dayNumber);
    setEditData({
      tourSpotId: segment.tourSpotId,
      activitySpotId: segment.activitySpotId,
      transportOption: segment.transportOption,
      hotelOption: segment.hotelOption,
    });
    setIsEditMode(false);
  };

  if (isEditMode && isEditable) {
    return (
      <View
        className="mx-3 mb-3 rounded-2xl overflow-hidden"
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
        <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b border-border dark:border-border-dark">
          <View>
            <Text className="text-sm font-bold text-primary dark:text-primary-dark">Day {dayNumber} - Edit</Text>
            <Text className="text-xs text-muted dark:text-muted-dark mt-1">Customize this itinerary</Text>
          </View>
          <TouchableOpacity onPress={handleCancel} className="p-1">
            <Ionicons name="close" size={24} color={mutedColor} />
          </TouchableOpacity>
        </View>

        <View className="px-4 py-4 gap-4">
          {/* Tour Spot Selection */}
          <View>
            <Text className="text-xs font-semibold text-muted dark:text-muted-dark mb-2 uppercase tracking-wider">
              Tour Spot
            </Text>
            <TouchableOpacity
              onPress={() => setTourSpotModalVisible(true)}
              style={[styles.input, dynamicStyles.input]}
              className="px-4 py-3 rounded-lg border flex-row justify-between items-center"
            >
              <Text style={{ color: editData.tourSpotId ? textColor : mutedColor }}>
                {editData.tourSpotId ? getTourSpotName(editData.tourSpotId) : 'Select Tour Spot...'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={primaryColor} />
            </TouchableOpacity>
          </View>

          {/* Activity Spot Selection */}
          <View>
            <Text className="text-xs font-semibold text-muted dark:text-muted-dark mb-2 uppercase tracking-wider">
              Activity Spot (Optional)
            </Text>
            <TouchableOpacity
              onPress={() => setActivitySpotModalVisible(true)}
              style={[styles.input, dynamicStyles.input]}
              className="px-4 py-3 rounded-lg border flex-row justify-between items-center"
            >
              <Text style={{ color: editData.activitySpotId ? textColor : mutedColor }}>
                {editData.activitySpotId ? getActivitySpotName(editData.activitySpotId) : 'Select Activity Spot...'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={primaryColor} />
            </TouchableOpacity>
          </View>

          {/* Transport Option */}
          <View>
            <Text className="text-xs font-semibold text-muted dark:text-muted-dark mb-2 uppercase tracking-wider">
              Transport
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              <View style={{ gap: 8, flexDirection: 'row' }}>
                {transportOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.transportButton,
                      dynamicStyles.transportButton,
                      editData.transportOption === option && dynamicStyles.transportButtonActive,
                    ]}
                    onPress={() => setEditData({ ...editData, transportOption: option })}
                  >
                    <Text
                      style={[
                        styles.transportButtonText,
                        dynamicStyles.transportButtonText,
                        editData.transportOption === option && styles.transportButtonTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {option.replace(/_/g, ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Hotel Option */}
          <View>
            <Text className="text-xs font-semibold text-muted dark:text-muted-dark mb-2 uppercase tracking-wider">
              Hotel Type
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, paddingHorizontal: 16 }}>
              <View style={{ gap: 8, flexDirection: 'row' }}>
                {hotelOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.hotelButton,
                      dynamicStyles.hotelButton,
                      editData.hotelOption === option && dynamicStyles.hotelButtonActive,
                    ]}
                    onPress={() => setEditData({ ...editData, hotelOption: option })}
                  >
                    <Text
                      style={[
                        styles.hotelButtonText,
                        dynamicStyles.hotelButtonText,
                        editData.hotelOption === option && styles.hotelButtonTextActive,
                      ]}
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
            <View className="flex-1 justify-end">
              <View
                style={{ backgroundColor: surfaceColor }}
                className="rounded-t-2xl p-4 max-h-80"
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    style={{ color: textColor }}
                    className="text-lg font-semibold"
                  >
                    Select Tour Spot
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTourSpotModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>

                {spotsLoading ? (
                  <View className="py-8 items-center justify-center">
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={{ color: mutedColor }} className="mt-2 text-sm">
                      Loading tour spots...
                    </Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={[styles.input, dynamicStyles.input]}
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
                                  className="text-xs mt-1"
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
            <View className="flex-1 justify-end">
              <View
                style={{ backgroundColor: surfaceColor }}
                className="rounded-t-2xl p-4 max-h-80"
              >
                <View className="flex-row justify-between items-center mb-3">
                  <Text
                    style={{ color: textColor }}
                    className="text-lg font-semibold"
                  >
                    Select Activity Spot
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActivitySpotModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>

                {spotsLoading ? (
                  <View className="py-8 items-center justify-center">
                    <ActivityIndicator size="large" color={primaryColor} />
                    <Text style={{ color: mutedColor }} className="mt-2 text-sm">
                      Loading activity spots...
                    </Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      style={[styles.input, dynamicStyles.input]}
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
                      className="py-3 px-4 rounded-lg mb-2 border border-border dark:border-border-dark"
                      style={{
                        borderColor: borderColor,
                      }}
                    >
                      <Text style={{ color: mutedColor }}>
                        <Ionicons name="ban" size={16} /> None
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
                                  className="text-xs mt-1"
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
        <View className="px-4 py-4 flex-row gap-2 border-t border-border dark:border-border-dark">
          <TouchableOpacity style={[styles.actionButton, dynamicStyles.saveButton]} onPress={handleSave} className="active:opacity-80">
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity style={[styles.actionButton, dynamicStyles.deleteButton]} onPress={onDelete} className="active:opacity-80">
              <Text style={styles.actionButtonText}>Delete</Text>
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
      className="mx-3 mb-3 rounded-2xl overflow-hidden"
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
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between border-b border-border dark:border-border-dark">
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-lg items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <Text className="text-white font-bold text-lg">{dayNumber}</Text>
          </View>
          <View>
            <Text className="text-base font-bold text-text dark:text-text-dark">Day {dayNumber}</Text>
            <Text className="text-xs text-muted dark:text-muted-dark">{tourSpotName}</Text>
          </View>
        </View>
        {isEditable && (
          <TouchableOpacity
            onPress={() => {
              console.log('[DaySegmentCard] Entering edit mode for day:', dayNumber);
              setIsEditMode(true);
            }}
            className="p-2"
          >
            <Ionicons name="create-outline" size={20} color={primaryColor} />
          </TouchableOpacity>
        )}
      </View>

      {/* Details */}
      <View className="px-4 py-4 gap-3">
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
        <Text className="text-xs text-muted dark:text-muted-dark font-medium uppercase tracking-wide mb-1">
          {label}
        </Text>
        <Text className="text-sm font-semibold text-text dark:text-text-dark">
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 44,
  },
  transportButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  transportButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transportButtonTextActive: {
    color: '#fff',
  },
  hotelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 90,
  },
  hotelButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hotelButtonTextActive: {
    color: '#fff',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default DaySegmentCard;
