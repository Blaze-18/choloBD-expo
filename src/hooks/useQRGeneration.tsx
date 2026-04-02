import { useCallback, useState } from 'react';
import { getApiInstance } from '../services/api/axiosClient';
import type { QRGenerateResponse } from '../types/qr';

export function useQRGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRToken = useCallback(async (bookingId: string): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      const api = getApiInstance();
      
      // eslint-disable-next-line no-console
      console.log('[useQRGeneration] Generating QR token for booking:', bookingId);
      
      const res = await api.post(`/api/bookings/hotel-rooms/${bookingId}/qr-generate`, {});
      const data = res.data as QRGenerateResponse;
      
      // eslint-disable-next-line no-console
      console.log('[useQRGeneration] QR token generated successfully', {
        expiresAt: data.data?.expiresAt,
        tokenLength: data.data?.qrToken?.length,
      });
      
      return data.data?.qrToken ?? null;
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message ?? e?.message ?? 'Failed to generate QR code';
      // eslint-disable-next-line no-console
      console.error('[useQRGeneration] Error', e?.response?.status, errorMsg);
      setError(errorMsg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    generateQRToken,
  };
}

export default useQRGeneration;
