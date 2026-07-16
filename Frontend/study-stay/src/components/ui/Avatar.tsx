import React, { useState } from 'react';
import { resolveImageUrl } from '../../utils/imageUrl';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  sizeClassName?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, sizeClassName = 'h-10 w-10', className = '' }) => {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(src);
  const initials = name && name.trim() ? name.trim().charAt(0).toUpperCase() : 'U';

  if (!resolved || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-primary/10 font-bold text-primary shrink-0 ${sizeClassName} ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={name || 'صورة المستخدم'}
      onError={() => setFailed(true)}
      className={`rounded-full object-cover shrink-0 ${sizeClassName} ${className}`}
    />
  );
};

export default Avatar;
