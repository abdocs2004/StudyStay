import api from '../../services/api';

export type PaymentMethod = 'instapay' | 'vodafone_cash' | 'orange_cash' | 'etisalat_cash';

export interface PaymentRequestPayload {
  target_user_id: number;
  property_id?: number;
  post_id?: number;
  payment_method: PaymentMethod;
  base_rent?: number;
  transaction_reference?: string;
  sender_phone: string;
  proof: File;
}

export interface MyPaymentRequest {
  id: number;
  target_user_id: number;
  target_name: string;
  payment_method: PaymentMethod;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface PaymentConfig {
  commissionRate: number;
  methods: Record<string, { label: string; number: string }>;
}

export const getPaymentConfig = async () => (await api.get<PaymentConfig>('/payments/config')).data;

export const getUnlockStatus = async (targetUserId: number) => {
  const response = await api.get<{ unlocked: boolean }>('/payments/unlock-status', {
    params: { targetUserId },
  });
  return response.data.unlocked;
};

export const getMyPaymentRequests = async () => {
  const response = await api.get<MyPaymentRequest[]>('/payments/mine');
  return response.data;
};

export const createPaymentRequest = async (payload: PaymentRequestPayload) => {
  const formData = new FormData();
  formData.append('target_user_id', String(payload.target_user_id));
  if (payload.property_id) formData.append('property_id', String(payload.property_id));
  if (payload.post_id) formData.append('post_id', String(payload.post_id));
  formData.append('payment_method', payload.payment_method);
  if (payload.base_rent) formData.append('base_rent', String(payload.base_rent));
  if (payload.transaction_reference) formData.append('transaction_reference', payload.transaction_reference);
  formData.append('sender_phone', payload.sender_phone);
  formData.append('payment_proof', payload.proof);

  // No manual Content-Type — let the browser generate the multipart boundary.
  const response = await api.post('/payments', formData);
  return response.data;
};
