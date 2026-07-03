import { getApiInstance } from './axiosClient';
import type { InitializePaymentParams, PaymentInitResponse, PaymentTransaction } from '@/types/payments';

export async function initializePayment(params: InitializePaymentParams): Promise<PaymentInitResponse> {
  const api = getApiInstance();
  const res = await api.post('/api/payments/initialize', params);
  return res.data.data;
}

export async function getTransaction(transactionId: string): Promise<PaymentTransaction> {
  const api = getApiInstance();
  const res = await api.get(`/api/payments/transaction/${transactionId}`);
  return res.data.data;
}

export async function getMyTransactions(): Promise<PaymentTransaction[]> {
  const api = getApiInstance();
  const res = await api.get('/api/payments/transactions');
  return res.data.data ?? [];
}
