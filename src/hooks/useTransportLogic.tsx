import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import {
  createTransport,
  updateTransport,
  updateTransportAdmin,
  deleteTransport,
} from '@/services/api/transports';
import {
  CreateTransportData,
  UpdateTransportData,
  UpdateTransportAdminData,
} from '@/types/transports';

/**
 * Hook for transport CRUD operations
 */
export function useTransportLogic() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Create a new transport
   */
  const handleCreate = async (data: CreateTransportData) => {
    try {
      setLoading(true);
      const result = await createTransport(data);
      Alert.alert('Success', 'Transport created successfully!');
      return result;
    } catch (err: any) {
      console.error('[useTransportLogic] Create error:', err);
      Alert.alert('Error', err?.message || 'Failed to create transport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update transport (service admin - own transport)
   */
  const handleUpdate = async (transportId: string, data: UpdateTransportData) => {
    try {
      setLoading(true);
      const result = await updateTransport(transportId, data);
      Alert.alert('Success', 'Transport updated successfully!');
      return result;
    } catch (err: any) {
      console.error('[useTransportLogic] Update error:', err);
      Alert.alert('Error', err?.message || 'Failed to update transport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update transport (admin - any transport)
   */
  const handleAdminUpdate = async (transportId: string, data: UpdateTransportAdminData) => {
    try {
      setLoading(true);
      const result = await updateTransportAdmin(transportId, data);
      Alert.alert('Success', 'Transport updated successfully!');
      return result;
    } catch (err: any) {
      console.error('[useTransportLogic] Admin update error:', err);
      Alert.alert('Error', err?.message || 'Failed to update transport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a transport
   */
  const handleDelete = async (transportId: string) => {
    try {
      setLoading(true);
      await deleteTransport(transportId);
      Alert.alert('Success', 'Transport deleted successfully!');
      router.back();
    } catch (err: any) {
      console.error('[useTransportLogic] Delete error:', err);
      Alert.alert('Error', err?.message || 'Failed to delete transport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreate,
    handleUpdate,
    handleAdminUpdate,
    handleDelete,
  };
}
