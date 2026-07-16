import React from 'react';
import type { ProfileData } from '../profile.service';
import { resolveImageUrl } from '../../../utils/imageUrl';

interface ProfileCardProps {
  profile: ProfileData;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : 'U';
  const imageSrc = resolveImageUrl(profile.profile_image);

  return (
    <div className="rounded-[1.75rem] bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(20,27,43,0.06)]">
      <div className="flex items-center gap-4">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={profile.name}
            className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl font-black text-primary">
            {initials}
          </div>
        )}

        <div>
          <h2 className="font-headline text-2xl font-bold text-slate-900">{profile.name}</h2>
          <p className="text-sm text-on-surface-variant">{profile.email}</p>
          <p className="text-sm text-on-surface-variant">{profile.phone || 'رقم هاتف غير محدد'}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-slate-600">
        {profile.role === 'student' && (
          <p>الجامعة: {profile.university || 'غير محددة'}</p>
        )}
        <p>العضوية منذ: {new Date(profile.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="text-slate-700">{profile.bio || 'لم يتم إضافة نبذة بعد.'}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
