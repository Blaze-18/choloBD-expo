import { useState } from 'react';
import { Alert } from 'react-native';
import {
  createHotelRoomType,
  updateHotelRoomType,
  deleteHotelRoomTypeImages,
  updateHotelRoom,
  CreateHotelRoomTypeData,
  UpdateHotelRoomTypeData,
  UpdateHotelRoomData,
} from '@/services/api/hotelRooms';

export function useHotelRoomManagement() {
  const [loading, setLoading] = useState(false);

  const handleCreateRoomType = async (data: CreateHotelRoomTypeData) => {
    try {
      setLoading(true);
      const result = await createHotelRoomType(data);
      Alert.alert('Success', 'Room type created successfully');
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create room type';
      Alert.alert('Error', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoomType = async (roomTypeId: string, data: UpdateHotelRoomTypeData) => {
    try {
      setLoading(true);
      const result = await updateHotelRoomType(roomTypeId, data);
      Alert.alert('Success', 'Room type updated successfully');
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update room type';
      Alert.alert('Error', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomTypeImages = async (roomTypeId: string, imageIds: string[]) => {
    try {
      setLoading(true);
      const result = await deleteHotelRoomTypeImages(roomTypeId, imageIds);
      Alert.alert('Success', 'Images deleted successfully');
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete images';
      Alert.alert('Error', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoomStatus = async (roomId: string, data: UpdateHotelRoomData) => {
    try {
      setLoading(true);
      const result = await updateHotelRoom(roomId, data);
      Alert.alert('Success', 'Room status updated successfully');
      return result;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update room status';
      Alert.alert('Error', message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreateRoomType,
    handleUpdateRoomType,
    handleDeleteRoomTypeImages,
    handleUpdateRoomStatus,
  };
}
