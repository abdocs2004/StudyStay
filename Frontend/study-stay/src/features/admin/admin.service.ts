import api from '../../services/api';

export interface AdminStats {
  users: { total_users: number; students: number; owners: number; admins: number };
  properties: {
    total_properties: number;
    pending_properties: number;
    approved_properties: number;
    rejected_properties: number;
  };
  posts: { total_posts: number; pending_posts: number; approved_posts: number; rejected_posts: number };
  messages: { total_messages: number };
  payments: {
    total_payments: number;
    pending_payments: number;
    approved_payments: number;
    rejected_payments: number;
    revenue: number;
  };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'owner' | 'admin';
  phone?: string | null;
  university?: string | null;
  is_suspended: number | boolean;
  verification_status?: string | null;
  created_at: string;
}

export interface AdminProperty {
  id: number;
  title: string;
  city: string;
  rent: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  owner_name: string;
  owner_email: string;
  created_at: string;
}

export interface AdminPost {
  id: number;
  city: string;
  university: string;
  budget: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  student_name: string;
  student_email: string;
  created_at: string;
}

export interface AdminPayment {
  id: number;
  payer_id: number;
  target_user_id: number;
  payer_name: string;
  payer_email: string;
  target_name: string;
  target_email: string;
  property_title?: string | null;
  post_description?: string | null;
  payment_method: string;
  amount: number;
  transaction_reference?: string | null;
  payment_proof?: string | null;
  sender_phone?: string | null;
  base_rent?: number | null;
  commission_rate?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string | null;
  created_at: string;
}

export interface AdminConversation {
  id: number;
  student_id: number;
  owner_id: number;
  property_id: number | null;
  student_name: string;
  owner_name: string;
  property_title?: string | null;
  message_count: number;
  created_at: string;
}

export interface AdminMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  message: string;
  created_at: string;
}

export const getAdminStats = async () => (await api.get<AdminStats>('/admin/stats')).data;

export const getRecentActivity = async () =>
  (
    await api.get<{
      recentUsers: { id: number; name: string; role: string; created_at: string }[];
      recentProperties: { id: number; title: string; approval_status: string; created_at: string }[];
      recentPayments: { id: number; status: string; amount: number; payment_method: string; payer_name: string; created_at: string }[];
    }>('/admin/activity')
  ).data;

export const getUsers = async (params?: { search?: string; role?: string }) =>
  (await api.get<AdminUser[]>('/admin/users', { params })).data;
export const suspendUser = async (id: number) => (await api.post(`/admin/users/${id}/suspend`)).data;
export const activateUser = async (id: number) => (await api.post(`/admin/users/${id}/activate`)).data;
export const deleteUser = async (id: number) => (await api.delete(`/admin/users/${id}`)).data;
export const resetUserPassword = async (id: number) =>
  (await api.post<{ message: string; temporaryPassword: string }>(`/admin/users/${id}/reset-password`)).data;

export const getAdminProperties = async (status?: string) =>
  (await api.get<AdminProperty[]>('/admin/properties', { params: status ? { status } : {} })).data;
export const approveProperty = async (id: number) => (await api.post(`/admin/properties/${id}/approve`)).data;
export const rejectProperty = async (id: number, reason: string) =>
  (await api.post(`/admin/properties/${id}/reject`, { reason })).data;
export const adminDeleteProperty = async (id: number) => (await api.delete(`/admin/properties/${id}`)).data;

export const getAdminPosts = async (status?: string) =>
  (await api.get<AdminPost[]>('/admin/posts', { params: status ? { status } : {} })).data;
export const approvePost = async (id: number) => (await api.post(`/admin/posts/${id}/approve`)).data;
export const rejectPost = async (id: number, reason: string) =>
  (await api.post(`/admin/posts/${id}/reject`, { reason })).data;
export const adminDeletePost = async (id: number) => (await api.delete(`/admin/posts/${id}`)).data;

export const getAdminPayments = async (status?: string) =>
  (await api.get<AdminPayment[]>('/admin/payments', { params: status ? { status } : {} })).data;
export const approvePayment = async (id: number, notes?: string) =>
  (await api.post(`/admin/payments/${id}/approve`, { notes })).data;
export const rejectPayment = async (id: number, notes?: string) =>
  (await api.post(`/admin/payments/${id}/reject`, { notes })).data;

export const getAdminConversations = async () =>
  (await api.get<AdminConversation[]>('/admin/conversations')).data;
export const getAdminConversationMessages = async (conversationId: number) =>
  (await api.get<AdminMessage[]>(`/admin/conversations/${conversationId}/messages`)).data;
