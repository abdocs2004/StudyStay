import api from '../../services/api';

export interface PropertyFilterParams {
  search?: string;
  university?: string;
  city?: string;
  min_rent?: string | number;
  max_rent?: string | number;
  rooms?: string | number;
  bathrooms?: string | number;
  min_area?: string | number;
  max_area?: string | number;
  availability?: string;
  type?: string;
  sort?: string;
}

export interface Property {
  id: number;
  owner_id: number;
  title: string;
  description: string;
  city: string;
  address: string;
  nearby_university: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  halls: number;
  size: number;
  type: string;
  occupancy: string;
  image?: string;
  main_image?: string;
  latitude?: number;
  longitude?: number;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  images?: string[];
  approval_status?: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  views?: number;
  features?: string[];
}

export interface PropertyImageRow {
  id: number;
  image_url: string;
  public_id: string;
}

export const getProperties = async (params: PropertyFilterParams) => {
  const response = await api.get<Property[]>('/properties', { params });
  return response.data;
};

export const getPropertyById = async (propertyId: string | number) => {
  const response = await api.get<Property>(`/properties/${propertyId}`);
  return response.data;
};

export const getOwnerProperties = async () => {
  const response = await api.get<Property[]>('/properties/owner/me');
  return response.data;
};

export const getFavoriteProperties = async () => {
  const response = await api.get<Property[]>('/favorites/properties');
  return response.data;
};

export const addFavoriteProperty = async (propertyId: string | number) => {
  const response = await api.post(`/favorites/property/${propertyId}`);
  return response.data;
};

export const removeFavoriteProperty = async (propertyId: string | number) => {
  const response = await api.delete(`/favorites/property/${propertyId}`);
  return response.data;
};

export const createProperty = async (propertyData: Record<string, unknown>) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

export const updateProperty = async (propertyId: string | number, propertyData: Record<string, unknown>) => {
  const response = await api.put(`/properties/${propertyId}`, propertyData);
  return response.data;
};

export const deleteProperty = async (propertyId: string | number) => {
  const response = await api.delete(`/properties/${propertyId}`);
  return response.data;
};

export const uploadPropertyImages = async (propertyId: string | number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  // No manual Content-Type — let the browser set the multipart boundary.
  const response = await api.post<{ message: string; images: PropertyImageRow[] }>(
    `/properties/${propertyId}/images`,
    formData
  );
  return response.data;
};

export const deletePropertyImage = async (propertyId: string | number, imageId: number) => {
  const response = await api.delete<{ message: string; images: PropertyImageRow[] }>(
    `/properties/${propertyId}/images/${imageId}`
  );
  return response.data;
};
