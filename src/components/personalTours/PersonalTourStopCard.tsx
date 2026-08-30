/**
 * Personal Tour Stop Card Component
 * Displays and allows editing of a single stop in the itinerary
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { theme } from '../../constants/theme';
import { HotelType, TransportServiceType } from '../../types/enums';
import type { PersonalTourSegmentRow, SpotOption, SelectOption } from './utils';
import { formatTaka, toTitle } from './utils';

interface PersonalTourStopCardProps {
  stop: PersonalTourSegmentRow;
  stopNumber: number;
  isLastOfDay: boolean;
  tourSpotOptions: SpotOption[];
  activitySpotOptions: SpotOption[];
  transportOptions: SelectOption[];
  hotelOptions: SelectOption[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  onChange: (updated: PersonalTourSegmentRow) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function PersonalTourStopCard({
  stop,
  stopNumber,
  isLastOfDay,
  tourSpotOptions,
  activitySpotOptions,
  transportOptions,
  hotelOptions,
  canMoveUp,
  canMoveDown,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: PersonalTourStopCardProps) {
  const { isDark } = useTheme();
  const [tourSpotModalVisible, setTourSpotModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [transportModalVisible, setTransportModalVisible] = useState(false);
  const [hotelModalVisible, setHotelModalVisible] = useState(false);

  const surfaceColor = isDark ? theme.colors['surface-dark'] : theme.colors.surface;
  const textColor = isDark ? theme.colors['text-dark'] : theme.colors.text;
  const mutedColor = isDark ? theme.colors['muted-dark'] : theme.colors.muted;
  const borderColor = isDark ? theme.colors['border-dark'] : theme.colors.border;
  const primaryColor = isDark ? theme.colors['primary-dark'] : theme.colors.primary;
  const errorColor = isDark ? theme.colors['error-dark'] : theme.colors.error;

  const selectedTourSpot = tourSpotOptions.find((opt) => opt.value === stop.tourSpotId);
  const selectedActivity = activitySpotOptions.find((opt) => opt.value === stop.activitySpotId);
  const selectedTransport = transportOptions.find((opt) => opt.value === stop.transportOption);
  const selectedHotel = hotelOptions.find((opt) => opt.value === stop.hotelOption);

  const handleDelete = () => {
    Alert.alert(
      'Delete Stop',
      'Are you sure you want to remove this stop from the itinerary?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <View
      style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
      className="mb-3 p-4 rounded-xl border"
    >
      {/* Header with stop number and actions */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: primaryColor }}
            className="w-8 h-8 rounded-full items-center justify-center"
          >
            <Text className="text-white font-bold text-sm">{stopNumber}</Text>
          </View>
          <Text style={{ color: textColor }} className="font-semibold text-base">
            Stop {stopNumber}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {canMoveUp && onMoveUp && (
            <TouchableOpacity onPress={onMoveUp} className="p-1">
              <Ionicons name="chevron-up" size={20} color={primaryColor} />
            </TouchableOpacity>
          )}
          {canMoveDown && onMoveDown && (
            <TouchableOpacity onPress={onMoveDown} className="p-1">
              <Ionicons name="chevron-down" size={20} color={primaryColor} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDelete} className="p-1">
            <Ionicons name="trash-outline" size={20} color={errorColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tour Spot (Required) */}
      <View className="mb-3">
        <Text style={{ color: mutedColor }} className="text-xs font-semibold mb-1.5">
          TOUR SPOT *
        </Text>
        <TouchableOpacity
          onPress={() => setTourSpotModalVisible(true)}
          style={{
            backgroundColor: isDark ? theme.colors['background-dark'] : '#fff',
            borderColor: !stop.tourSpotId ? errorColor : borderColor,
          }}
          className="px-4 py-3 rounded-lg border flex-row items-center justify-between"
        >
          <Text
            style={{ color: selectedTourSpot ? textColor : mutedColor }}
            className="flex-1"
            numberOfLines={1}
          >
            {selectedTourSpot?.label || 'Select a tour spot'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={mutedColor} />
        </TouchableOpacity>
        {!stop.tourSpotId && (
          <Text style={{ color: errorColor }} className="text-xs mt-1">
            Tour spot is required
          </Text>
        )}
      </View>

      {/* Short Description (Required) */}
      <View className="mb-3">
        <Text style={{ color: mutedColor }} className="text-xs font-semibold mb-1.5">
          DESCRIPTION *
        </Text>
        <TextInput
          style={{
            backgroundColor: isDark ? theme.colors['background-dark'] : '#fff',
            borderColor: stop.shortDescription.trim().length < 2 ? errorColor : borderColor,
            color: textColor,
          }}
          className="px-4 py-3 rounded-lg border min-h-[80px]"
          placeholder="Brief description of this stop..."
          placeholderTextColor={mutedColor}
          multiline
          numberOfLines={3}
          value={stop.shortDescription}
          onChangeText={(text) => onChange({ ...stop, shortDescription: text })}
          textAlignVertical="top"
        />
        {stop.shortDescription.trim().length < 2 && (
          <Text style={{ color: errorColor }} className="text-xs mt-1">
            Description must be at least 2 characters
          </Text>
        )}
      </View>

      {/* Activity Spot (Optional) */}
      <View className="mb-3">
        <Text style={{ color: mutedColor }} className="text-xs font-semibold mb-1.5">
          ACTIVITY (OPTIONAL)
        </Text>
        <TouchableOpacity
          onPress={() => setActivityModalVisible(true)}
          style={{
            backgroundColor: isDark ? theme.colors['background-dark'] : '#fff',
            borderColor: borderColor,
          }}
          className="px-4 py-3 rounded-lg border flex-row items-center justify-between"
        >
          <Text
            style={{ color: selectedActivity ? textColor : mutedColor }}
            className="flex-1"
            numberOfLines={1}
          >
            {selectedActivity?.label || 'Select activities'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={mutedColor} />
        </TouchableOpacity>
      </View>

      {/* Transport (Optional) */}
      <View className="mb-3">
        <Text style={{ color: mutedColor }} className="text-xs font-semibold mb-1.5">
          TRANSPORT (OPTIONAL)
        </Text>
        <TouchableOpacity
          onPress={() => setTransportModalVisible(true)}
          style={{
            backgroundColor: isDark ? theme.colors['background-dark'] : '#fff',
            borderColor: borderColor,
          }}
          className="px-4 py-3 rounded-lg border flex-row items-center justify-between"
        >
          <Text
            style={{ color: selectedTransport ? textColor : mutedColor }}
            className="flex-1"
            numberOfLines={1}
          >
            {selectedTransport ? toTitle(selectedTransport.value) : 'Select transport'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={mutedColor} />
        </TouchableOpacity>
      </View>

      {/* Hotel (Only for last stop of day) */}
      {isLastOfDay && (
        <View className="mb-3 pt-3 border-t" style={{ borderColor: borderColor }}>
          <Text style={{ color: mutedColor }} className="text-xs font-semibold mb-1.5">
            OVERNIGHT STAY (OPTIONAL)
          </Text>
          <TouchableOpacity
            onPress={() => setHotelModalVisible(true)}
            style={{
              backgroundColor: isDark ? theme.colors['background-dark'] : '#fff',
              borderColor: borderColor,
            }}
            className="px-4 py-3 rounded-lg border flex-row items-center justify-between"
          >
            <Text
              style={{ color: selectedHotel ? textColor : mutedColor }}
              className="flex-1"
              numberOfLines={1}
            >
              {selectedHotel ? toTitle(selectedHotel.value) : 'Select hotel type'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={mutedColor} />
          </TouchableOpacity>
        </View>
      )}

      {/* Notes (Optional) */}
      <View className="mt-3">
        <Text style={{ color: mutedColor }} className="text-xs font-semibold mb-1.5">
          NOTES (OPTIONAL)
        </Text>
        <TextInput
          style={{
            backgroundColor: isDark ? theme.colors['background-dark'] : '#fff',
            borderColor: borderColor,
            color: textColor,
          }}
          className="px-4 py-3 rounded-lg border min-h-[60px]"
          placeholder="Extra notes for this stop..."
          placeholderTextColor={mutedColor}
          multiline
          numberOfLines={2}
          value={stop.notes}
          onChangeText={(text) => onChange({ ...stop, notes: text })}
          textAlignVertical="top"
        />
      </View>

      {/* Tour Spot Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={tourSpotModalVisible}
        onRequestClose={() => setTourSpotModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="flex-1 justify-end">
            <View style={{ backgroundColor: surfaceColor }} className="rounded-t-2xl max-h-96">
              <View className="p-4 border-b" style={{ borderColor: borderColor }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: textColor }} className="text-lg font-bold">
                    Select Tour Spot
                  </Text>
                  <TouchableOpacity onPress={() => setTourSpotModalVisible(false)}>
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView className="p-4">
                {tourSpotOptions.map((option) => {
                  if (!option.value) return null;
                  const isSelected = option.value === stop.tourSpotId;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        onChange({
                          ...stop,
                          tourSpotId: option.value,
                          activityCost: option.cost || 0,
                        });
                        setTourSpotModalVisible(false);
                      }}
                      style={{
                        backgroundColor: isSelected ? primaryColor + '20' : 'transparent',
                      }}
                      className="py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between"
                    >
                      <View className="flex-1">
                        <Text
                          style={{
                            color: isSelected ? primaryColor : textColor,
                            fontWeight: isSelected ? '600' : '400',
                          }}
                        >
                          {option.label}
                        </Text>
                        {option.cost !== undefined && option.cost > 0 && (
                          <Text style={{ color: mutedColor }} className="text-xs mt-0.5">
                            {formatTaka(option.cost)}
                          </Text>
                        )}
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Similar modals for Activity, Transport, and Hotel - keeping them concise */}
      {/* Activity Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={activityModalVisible}
        onRequestClose={() => setActivityModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="flex-1 justify-end">
            <View style={{ backgroundColor: surfaceColor }} className="rounded-t-2xl max-h-96">
              <View className="p-4 border-b" style={{ borderColor: borderColor }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: textColor }} className="text-lg font-bold">
                    Select Activity
                  </Text>
                  <TouchableOpacity onPress={() => setActivityModalVisible(false)}>
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView className="p-4">
                <TouchableOpacity
                  onPress={() => {
                    onChange({ ...stop, activitySpotId: '' });
                    setActivityModalVisible(false);
                  }}
                  className="py-3 px-4 rounded-lg mb-2"
                >
                  <Text style={{ color: mutedColor }}>No activity</Text>
                </TouchableOpacity>
                {activitySpotOptions.map((option) => {
                  if (!option.value) return null;
                  const isSelected = option.value === stop.activitySpotId;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        onChange({ ...stop, activitySpotId: option.value });
                        setActivityModalVisible(false);
                      }}
                      style={{
                        backgroundColor: isSelected ? primaryColor + '20' : 'transparent',
                      }}
                      className="py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between"
                    >
                      <Text
                        style={{
                          color: isSelected ? primaryColor : textColor,
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Transport Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={transportModalVisible}
        onRequestClose={() => setTransportModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="flex-1 justify-end">
            <View style={{ backgroundColor: surfaceColor }} className="rounded-t-2xl max-h-96">
              <View className="p-4 border-b" style={{ borderColor: borderColor }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: textColor }} className="text-lg font-bold">
                    Select Transport
                  </Text>
                  <TouchableOpacity onPress={() => setTransportModalVisible(false)}>
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView className="p-4">
                <TouchableOpacity
                  onPress={() => {
                    onChange({ ...stop, transportOption: '' });
                    setTransportModalVisible(false);
                  }}
                  className="py-3 px-4 rounded-lg mb-2"
                >
                  <Text style={{ color: mutedColor }}>No transport</Text>
                </TouchableOpacity>
                {transportOptions.map((option) => {
                  if (!option.value) return null;
                  const isSelected = option.value === stop.transportOption;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        onChange({ ...stop, transportOption: option.value as TransportServiceType });
                        setTransportModalVisible(false);
                      }}
                      style={{
                        backgroundColor: isSelected ? primaryColor + '20' : 'transparent',
                      }}
                      className="py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between"
                    >
                      <Text
                        style={{
                          color: isSelected ? primaryColor : textColor,
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {toTitle(option.value)}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hotel Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={hotelModalVisible}
        onRequestClose={() => setHotelModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="flex-1 justify-end">
            <View style={{ backgroundColor: surfaceColor }} className="rounded-t-2xl max-h-96">
              <View className="p-4 border-b" style={{ borderColor: borderColor }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: textColor }} className="text-lg font-bold">
                    Select Hotel Type
                  </Text>
                  <TouchableOpacity onPress={() => setHotelModalVisible(false)}>
                    <Ionicons name="close" size={24} color={textColor} />
                  </TouchableOpacity>
                </View>
              </View>
              <ScrollView className="p-4">
                <TouchableOpacity
                  onPress={() => {
                    onChange({ ...stop, hotelOption: '', hotelId: '', hotelCost: 0 });
                    setHotelModalVisible(false);
                  }}
                  className="py-3 px-4 rounded-lg mb-2"
                >
                  <Text style={{ color: mutedColor }}>No hotel</Text>
                </TouchableOpacity>
                {hotelOptions.map((option) => {
                  if (!option.value) return null;
                  const isSelected = option.value === stop.hotelOption;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        onChange({ ...stop, hotelOption: option.value as HotelType, hotelId: '', hotelCost: 0 });
                        setHotelModalVisible(false);
                      }}
                      style={{
                        backgroundColor: isSelected ? primaryColor + '20' : 'transparent',
                      }}
                      className="py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between"
                    >
                      <Text
                        style={{
                          color: isSelected ? primaryColor : textColor,
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {toTitle(option.value)}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
