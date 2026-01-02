import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { UserProfile } from '../types';
import { DEFAULT_USER_PROFILE, STORAGE_KEYS } from '../constants/app.constants';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isSubscribed: parsed.isSubscribed || false
      };
    }
    return {
      ...DEFAULT_USER_PROFILE,
      joinedDate: format(new Date(), 'MMMM yyyy')
    };
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${userProfile.fontSize}px`;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  return { userProfile, setUserProfile };
};
