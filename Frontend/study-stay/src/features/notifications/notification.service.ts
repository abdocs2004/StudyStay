import api from '../../services/api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  is_read: boolean | number;
  created_at: string;
}

export const getNotifications = async () => {
  const response = await api.get<Notification[]>('/notifications');
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get<{ unread_count: number }>('/notifications/unread-count');
  return response.data.unread_count;
};

export const markNotificationRead = async (notificationId: number) => {
  const response = await api.post(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.post('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (notificationId: number) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};
