export interface PropertyFeatureDef {
  key: string;
  label: string;
  icon: string;
}

export const PROPERTY_FEATURES: PropertyFeatureDef[] = [
  { key: 'wifi', label: 'واي فاي', icon: 'wifi' },
  { key: 'ac', label: 'تكييف', icon: 'ac_unit' },
  { key: 'parking', label: 'موقف سيارات', icon: 'local_parking' },
  { key: 'kitchen', label: 'مطبخ', icon: 'kitchen' },
  { key: 'elevator', label: 'أسانسير', icon: 'elevator' },
  { key: 'laundry', label: 'غسيل ملابس', icon: 'local_laundry_service' },
  { key: 'security', label: 'أمن وحراسة', icon: 'security' },
  { key: 'tv', label: 'تلفزيون', icon: 'tv' },
  { key: 'internet', label: 'إنترنت', icon: 'language' },
  { key: 'balcony', label: 'بلكونة', icon: 'balcony' },
  { key: 'garden', label: 'حديقة', icon: 'yard' },
  { key: 'gas', label: 'غاز طبيعي', icon: 'local_fire_department' },
  { key: 'water', label: 'مياه', icon: 'water_drop' },
  { key: 'electricity', label: 'كهرباء', icon: 'bolt' },
  { key: 'furnished', label: 'مفروشة', icon: 'chair' },
  { key: 'private_bathroom', label: 'حمام خاص', icon: 'bathtub' },
  { key: 'shared_bathroom', label: 'حمام مشترك', icon: 'wc' },
];

export const getFeatureDef = (key: string) => PROPERTY_FEATURES.find((f) => f.key === key);
