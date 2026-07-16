import api from '../../services/api';

export interface Conversation {
  id: number;
  student_id: number;
  owner_id: number;
  property_id: number | null;
  other_user_id: number;
  other_user_name: string;
  other_user_role: string;
  property_title?: string;
  property_city?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  property_id: number | null;
  conversation_id: number | null;
  message: string;
  is_read: number;
  created_at: string;
}

export const getConversations = async () => {
  const response = await api.get<Conversation[]>('/chats');
  return response.data;
};

export const getConversationById = async (conversationId: number) => {
  const response = await api.get<Conversation>(`/chats/${conversationId}`);
  return response.data;
};

export const createConversation = async (payload: {
  student_id: number;
  owner_id: number;
  property_id?: number | null;
}) => {
  const response = await api.post('/chats/conversations', payload);
  return response.data;
};

export const getMessages = async (conversationId: number) => {
  const response = await api.get<Message[]>(`/chats/messages/${conversationId}`);
  return response.data;
};

export const sendMessage = async (payload: {
  conversation_id?: number | null;
  receiver_id?: number;
  message: string;
}) => {
  const response = await api.post('/chats', payload);
  return response.data;
};

export const markConversationRead = async (conversationId: number) => {
  const response = await api.post(`/chats/messages/read/${conversationId}`);
  return response.data;
};
