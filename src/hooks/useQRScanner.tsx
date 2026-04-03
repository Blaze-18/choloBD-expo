import { useCallback, useState } from 'react';
import { getApiInstance } from '../services/api/axiosClient';
import type { QRScanResponse, QRBookingDetail } from '../types/qr';

export function useQRScanner() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanQRCode = useCallback(async (qrToken: string): Promise<QRBookingDetail | null> => {
    try {
      setLoading(true);
      setError(null);
      const api = getApiInstance();

      // eslint-disable-next-line no-console
      console.log('[useQRScanner] Scanning QR code...');

      const res = await api.post('/api/bookings/hotel-rooms/qr-scan', { qrToken });
      const data = res.data as QRScanResponse;

      // eslint-disable-next-line no-console
      console.log('[useQRScanner] API Response:', JSON.stringify(data, null, 2));
      // eslint-disable-next-line no-console
      console.log('[useQRScanner] QR code validated successfully', {
        bookingId: data.data?.booking?.id,
        guestName: data.data?.booking?.user?.userName,
        status: data.data?.booking?.status,
      });

      return data.data?.booking ?? null;
    } catch (e: any) {
      const status = e?.response?.status;
      let errorMsg = e?.response?.data?.message ?? e?.message ?? 'Failed to scan QR code';

      // Map backend error messages to user-friendly messages
      if (status === 401) {
        if (errorMsg.includes('Invalid QR token')) {
          errorMsg = 'QR code is invalid or expired. Ask guest for a fresh code.';
        } else if (errorMsg.includes('does not belong to this hotel')) {
          errorMsg = 'You are not authorized to check in guests at this hotel.';
        } else if (errorMsg.includes('not assigned any hotel')) {
          errorMsg = 'Your user account is not assigned to a hotel. Contact your manager.';
        }
      } else if (status === 410) {
        errorMsg = 'QR code has expired. Ask guest for a fresh code.';
      } else if (status === 400) {
        if (errorMsg.includes('cancelled')) {
          errorMsg = 'This booking has been cancelled and cannot be checked in.';
        } else if (errorMsg.includes('QR token is required')) {
          errorMsg = 'Please scan a valid QR code.';
        }
      } else if (status === 404) {
        errorMsg = 'Booking not found in system.';
      } else if (status === 403) {
        errorMsg = 'Employee does not have a hotel assigned';
      } else if (status && status >= 500) {
        errorMsg = 'Unable to validate QR code. Check your internet connection and try again.';
      }

      // eslint-disable-next-line no-console
      console.error('[useQRScanner] Error', status, errorMsg);
      setError(errorMsg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    scanQRCode,
    clearError,
  };
}

export default useQRScanner;
