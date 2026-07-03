export type PaymentStatus = 'UNPAID' | 'PAID';

export type ServiceType =
  | 'HOTEL_BOOKING'
  | 'PACKAGE_BOOKING'
  | 'WALLET_TOP_UP'
  | 'TRIP_PACKAGE';

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface InitializePaymentParams {
  serviceType: ServiceType;
  serviceTypeId: string;
  phone?: string;
  email?: string;
  userName?: string;
  paymentAmount?: number;
}

export interface PaymentInitResponse {
  transactionId: string;
  paymentId: string;
  gatewayPageURL: string;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  serviceType: ServiceType;
  serviceTypeId: string;
  createdAt: string;
  updatedAt: string;
}
