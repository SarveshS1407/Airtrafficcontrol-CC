import React, { useState } from 'react';
import { UserProfile } from '../../store/useAuthStore';

interface UserAvatarProps {
  user?: UserProfile | null;
  name?: string;
  email?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      // e.g. "Commander Alex Vance" -> "AV" or "Alex Vance" -> "AV"
      const first = parts[0][0];
      const last = parts[parts.length - 1][0];
      return `${first}${last}`.toUpperCase();
    } else if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
  }

  if (email && email.trim()) {
    const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    if (prefix.length >= 2) {
      return prefix.slice(0, 2).toUpperCase();
    } else if (prefix.length === 1) {
      return prefix.toUpperCase();
    }
  }

  return 'ATC';
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-bold',
  lg: 'w-12 h-12 text-base font-bold',
  xl: 'w-16 h-16 text-xl font-black',
};

const STATUS_SIZES = {
  xs: 'w-1.5 h-1.5 -bottom-0.5 -right-0.5',
  sm: 'w-2 h-2 bottom-0 right-0',
  md: 'w-2.5 h-2.5 bottom-0 right-0',
  lg: 'w-3 h-3 bottom-0.5 right-0.5',
  xl: 'w-3.5 h-3.5 bottom-1 right-1',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  name,
  email,
  avatarUrl,
  size = 'md',
  showStatus = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const effectiveName = name || user?.name || '';
  const effectiveEmail = email || user?.email || '';
  const effectiveAvatar = avatarUrl || user?.avatarUrl;
  const initials = getInitials(effectiveName, effectiveEmail);

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      <div
        className={`${SIZE_CLASSES[size]} rounded-xl flex items-center justify-center font-mono overflow-hidden transition-all border border-[#D6E0E7] dark:border-[#2D4B63] bg-[#20394D] dark:bg-[#172D40] text-[#FCFAF5] dark:text-[#E3ECF3] shadow-2xs`}
      >
        {effectiveAvatar && !imageError ? (
          <img
            src={effectiveAvatar}
            alt={effectiveName || 'User profile'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="tracking-tight leading-none text-center">
            {initials}
          </span>
        )}
      </div>

      {showStatus && (
        <span
          className={`absolute ${STATUS_SIZES[size]} rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#101E2B]`}
          title="Active Transponder Session (Online)"
          aria-label="Online status"
        />
      )}
    </div>
  );
};
