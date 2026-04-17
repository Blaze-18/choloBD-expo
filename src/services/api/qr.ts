import { getApiInstance } from './axiosClient';
import type { QRGenerateResponse, QRScanResponse } from '../../types/qr';

export async function generateQRToken(bookingId: string): Promise<QRGenerateResponse> {
  const api = getApiInstance();
  const res = await api.post(`/api/bookings/hotel-rooms/${bookingId}/qr-generate`, {});
  return res.data as QRGenerateResponse;
}

export async function scanQRCode(qrToken: string): Promise<QRScanResponse> {
  const api = getApiInstance();
  const res = await api.post('/api/bookings/hotel-rooms/qr-scan', { qrToken });
  return res.data as QRScanResponse;
}
