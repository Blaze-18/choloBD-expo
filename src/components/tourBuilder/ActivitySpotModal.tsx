import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_KEYS } from '../../constants/translationKeys';

interface Spot {
  id: string;
  name: string;
  location?: string;
}

interface ActivitySpotModalProps {
  visible: boolean;
  onClose: () => void;
  spots: Spot[];
  selectedSpotId?: string;
  onSelectSpot: (spotId?: string) => void;
  loading: boolean;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  primaryColor: string;
}

export function ActivitySpotModal({
  visible,
  onClose,
  spots,
  selectedSpotId,
  onSelectSpot,
  loading,
  surfaceColor,
  textColor,
  mutedColor,
  borderColor,
  primaryColor,
}: ActivitySpotModalProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filteredSpots = spots.filter((spot) =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
        activeOpacity={1}
      >
        <View className="justify-end flex-1">
          <View
            style={{ backgroundColor: surfaceColor }}
            className="p-4 rounded-t-2xl max-h-80"
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text style={{ color: textColor }} className="text-lg font-semibold">
                {t(TRANSLATION_KEYS.TOUR_BUILDER.SELECT_ACTIVITY_SPOT)}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            {loading ? (
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
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t(TRANSLATION_KEYS.TOUR_BUILDER.SEARCH_ACTIVITY_SPOTS)}
                  placeholderTextColor={mutedColor}
                />

                <TouchableOpacity
                  onPress={() => {
                    onSelectSpot(undefined);
                    onClose();
                  }}
                  className="px-4 py-3 mb-2 border rounded-lg mt-3"
                  style={{ borderColor }}
                >
                  <Text style={{ color: mutedColor }}>
                    <Ionicons name="ban" size={16} /> {t(TRANSLATION_KEYS.TOUR_BUILDER.NONE)}
                  </Text>
                </TouchableOpacity>

                <ScrollView className="mt-2">
                  {filteredSpots.map((spot) => (
                    <TouchableOpacity
                      key={spot.id}
                      onPress={() => {
                        onSelectSpot(spot.id);
                        onClose();
                      }}
                      className={`py-3 px-4 rounded-lg mb-2 flex-row items-center justify-between ${
                        selectedSpotId === spot.id ? 'opacity-100' : 'opacity-70'
                      }`}
                      style={{
                        backgroundColor:
                          selectedSpotId === spot.id ? primaryColor + '20' : 'transparent',
                      }}
                    >
                      <View className="flex-1">
                        <Text
                          style={{
                            color: selectedSpotId === spot.id ? primaryColor : textColor,
                            fontWeight: selectedSpotId === spot.id ? '600' : '400',
                          }}
                        >
                          {spot.name}
                        </Text>
                        {spot.location && (
                          <Text style={{ color: mutedColor }} className="mt-1 text-xs">
                            {spot.location}
                          </Text>
                        )}
                      </View>
                      {selectedSpotId === spot.id && (
                        <Ionicons name="checkmark-circle" size={20} color={primaryColor} />
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
  );
}
