import { useState } from 'react';
import { STORAGE_KEYS } from '../constants/app.constants';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_STATUS) === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATUS);
  };

  return { isLoggedIn, handleLogin, handleLogout };
};
