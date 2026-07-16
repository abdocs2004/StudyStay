import React from 'react';
import type { ProfileData } from '../profile.service';

interface ProfileFormProps {
  profile: ProfileData | null;
  formState: {
    name: string;
    phone: string;
    university: string;
    bio: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onFileChange: (file: File | null) => void;
  uploadLoading: boolean;
  saving: boolean;
  message: string;
  error: string;
  showUniversity: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  formState,
  onInputChange,
  onSubmit,
  onFileChange,
  uploadLoading,
  saving,
  message,
  error,
  showUniversity,
}) => {
  return (
    <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 space-y-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-surface-container flex items-center justify-center text-3xl font-black text-slate-500">
          {profile?.name?.charAt(0) ?? 'U'}
        </div>
        <div>
          <h2 className="font-headline text-2xl font-bold text-slate-900">تعديل الملف الشخصي</h2>
          <p className="text-sm text-on-surface-variant">قم بتحديث بياناتك الأساسية وصورة الملف الشخصي.</p>
        </div>
      </div>

      {message && <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700 text-sm border border-emerald-100">{message}</div>}
      {error && <div className="rounded-2xl bg-rose-50 p-4 text-rose-700 text-sm border border-rose-100">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        <input
          value={formState.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="الاسم الكامل"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        <input
          value={formState.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          placeholder="رقم الهاتف"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        {showUniversity && (
          <input
            value={formState.university}
            onChange={(e) => onInputChange('university', e.target.value)}
            placeholder="الجامعة"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        )}
        <textarea
          value={formState.bio}
          onChange={(e) => onInputChange('bio', e.target.value)}
          placeholder="نبذة قصيرة عنك"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px]"
        />
        <label className="block text-sm text-slate-700">
          صورة الملف الشخصي
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            className="mt-2 w-full"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="rounded-3xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-60 hover:opacity-95 transition-colors"
      >
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>

      {uploadLoading && <p className="text-sm text-on-surface-variant">جاري رفع الصورة...</p>}
    </div>
  );
};

export default ProfileForm;
