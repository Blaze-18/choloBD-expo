import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import {
  createActivityBooking,
  updateActivityBooking,
  cancelActivityBooking,
  generateActivityBookingQr,
} from '@/services/api/activityBookings';
import {
  CreateActivityBookingData,
  UpdateActivityBookingData,
  GenerateActivityBookingQrResult,
} from '@/types/activityBookings';

/**
 * Hook for activity booking CRUD operations and QR generation
 */
export function useActivityBookingLogic() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<GenerateActivityBookingQrResult | null>(null);

  /**
   * Create a new activity booking
   */
  const handleCreate = async (bookingData: CreateActivityBookingData) => {
    try {
      setLoading(true);
      const result = await createActivityBooking(bookingData);
      Alert.alert('Success', 'Activity booking created successfully!');
      return result;
    } catch (err: any) {
      console.error('[useActivityBookingLogic] Create error:', err);
      Alert.alert('Error', err?.message || 'Failed to create activity booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing activity booking
   */
  const handleUpdate = async (bookingId: string, updateData: UpdateActivityBookingData) => {
    try {
      setLoading(true);
      const result = await updateActivityBooking(bookingId, updateData);
      Alert.alert('Success', 'Activity booking updated successfully!');
      return result;
    } catch (err: any) {
      console.error('[useActivityBookingLogic] Update error:', err);
      Alert.alert('Error', err?.message || 'Failed to update activity booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel an activity booking
   */
  const handleCancel = async (bookingId: string, reason?: string) => {
    try {
      setLoading(true);
      await cancelActivityBooking(bookingId, reason);
      Alert.alert('Success', 'Activity booking cancelled successfully!');
      router.back();
    } catch (err: any) {
      console.error('[useActivityBookingLogic] Cancel error:', err);
      Alert.alert('Error', err?.message || 'Failed to cancel activity booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate QR code for activity booking
   */
  const handleGenerateQr = async (bookingId: string) => {
    try {
      setLoading(true);
      const result = await generateActivityBookingQr(bookingId);
      setQrData(result);
      return result;
    } catch (err: any) {
      console.error('[useActivityBookingLogic] Generate QR error:', err);
      Alert.alert('Error', err?.message || 'Failed to generate QR code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    qrData,
    handleCreate,
    handleUpdate,
    handleCancel,
    handleGenerateQr,
  };
}
