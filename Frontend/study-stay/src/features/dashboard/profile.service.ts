import api from '../../services/api';

export interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'owner' | 'admin';
  phone?: string;
  university?: string | null;
  bio?: string | null;
  profile_image?: string | null;
  created_at: string;
}

export interface StudentPost {
  id: number;
  property_id: number | null;
  property_title?: string;
  property_city?: string;
  university: string;
  city: string;
  preferred_area: string;
  budget: number;
  rooms: number;
  bathrooms: number;
  area: number;
  description: string;
  status: string;
  created_at: string;
}

export interface ChatThread {
  other_user_id: number;
  other_user_name: string;
  other_user_role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export const getProfile = async () => {
  const response = await api.get<ProfileData>('/profile');
  return response.data;
};

export const updateProfile = async (payload: {
  name: string;
  phone: string;
  university?: string | null;
  bio?: string | null;
}) => {
  const response = await api.put<ProfileData>('/profile', payload);
  return response.data;
};

export const uploadProfileImage = async (image: File) => {
  const formData = new FormData();
  formData.append('profile_image', image);
  // Do NOT set Content-Type manually here — the browser must generate the
  // multipart boundary itself. A hard-coded 'multipart/form-data' header
  // (no boundary) makes multer on the backend fail to parse the body,
  // which was silently breaking profile image uploads.
  const response = await api.post<ProfileData>('/profile/image', formData);
  return response.data;
};

export const getStudentPosts = async () => {
  const response = await api.get<StudentPost[]>('/posts/student/me');
  return response.data;
};

export const getFavoriteProperties = async () => {
  const response = await api.get('/favorites/properties');
  return response.data;
};

export const getOwnerProperties = async () => {
  const response = await api.get('/properties/owner/me');
  return response.data;
};

export const getFavoritePosts = async () => {
  const response = await api.get('/favorites/posts');
  return response.data;
};

export const getChatThreads = async () => {
  const response = await api.get<ChatThread[]>('/chats/threads');
  return response.data;
};
