import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { UserUsage } from '../types';
import { IMAGE_LIMIT, STORAGE_KEYS } from '../constants/app.constants';

export const useImageUsage = (isSubscribed: boolean) => {
  const [usage, setUsage] = useState<UserUsage>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USAGE);
    const today = format(new Date(), 'yyyy-MM-dd');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.lastResetDate !== today) {
        return { lastResetDate: today, imageCount: 0 };
      }
      return parsed;
    }
    return { lastResetDate: today, imageCount: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USAGE, JSON.stringify(usage));
  }, [usage]);

  const checkImageLimit = useCallback(() => {
    if (isSubscribed) return true;
    const today = format(new Date(), 'yyyy-MM-dd');
    if (usage.lastResetDate !== today) {
      setUsage({ lastResetDate: today, imageCount: 0 });
      return true;
    }
    return usage.imageCount < IMAGE_LIMIT;
  }, [usage, isSubscribed]);

  const incrementImageUsage = useCallback(() => {
    if (isSubscribed) return;
    setUsage(prev => ({ ...prev, imageCount: prev.imageCount + 1 }));
  }, [isSubscribed]);

  return { usage, checkImageLimit, incrementImageUsage };
};
