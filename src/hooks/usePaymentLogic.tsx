import { useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { initializePayment, getTransaction } from '@/services/api/payments';
import type { InitializePaymentParams, TransactionStatus } from '@/types/payments';

export type PaymentResult = {
  success: boolean;
  transactionId?: string;
  status?: TransactionStatus;
  error?: string;
};

export function usePaymentLogic() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPayment = useCallback(async (
    params: InitializePaymentParams
  ): Promise<PaymentResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (__DEV__) console.log('[usePaymentLogic] Initializing payment', params);

      const data = await initializePayment(params);
      const { transactionId, gatewayPageURL } = data;

      await WebBrowser.openBrowserAsync(gatewayPageURL, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      // Browser dismissed — verify transaction result
      if (__DEV__) console.log('[usePaymentLogic] Browser closed, verifying transaction', transactionId);

      const txn = await getTransaction(transactionId);
      const status = (txn?.status ?? 'PENDING') as TransactionStatus;

      if (__DEV__) console.log('[usePaymentLogic] Transaction status:', status);

      return { success: status === 'COMPLETED', transactionId, status };
    } catch (e: any) {
      if (__DEV__) console.error('[usePaymentLogic] startPayment error', e?.response?.data || e.message);
      const msg = e?.response?.data?.message || 'Payment could not be started. Please try again.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, startPayment };
}
