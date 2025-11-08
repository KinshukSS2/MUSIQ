import React, { createContext, useState, useEffect } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestAvatar, setGuestAvatar] = useState('');
  const [authType, setAuthType] = useState(''); // 'user' | 'guest' | ''

  useEffect(() => {
    // Load Firebase user if exists
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setAuthType('user');
    }

    // Load guest data if exists
    const storedGuest = JSON.parse(localStorage.getItem('guest'));
    if (storedGuest && storedGuest.name) {
      setIsGuest(true);
      setGuestName(storedGuest.name);
      setGuestAvatar(storedGuest.avatar || '');
      setAuthType('guest');
    }
  }, []);

  const loginAsGuest = (name, avatar) => {
    setIsGuest(true);
    setGuestName(name);
    setGuestAvatar(avatar);
    setAuthType('guest');
    localStorage.setItem('guest', JSON.stringify({ name, avatar }));
  };

  const logoutGuest = () => {
    setIsGuest(false);
    setGuestName('');
    setGuestAvatar('');
    setAuthType('');
    localStorage.removeItem('guest');
  };

  const loginAsUser = (userData) => {
    setUser(userData);
    setAuthType('user');
    setIsGuest(false);
    setGuestName('');
    setGuestAvatar('');
  };

  const logout = () => {
    setUser(null);
    setAuthType('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userAvatar');
    logoutGuest(); // Also clears guest if any
    
    // Additional security: Clear any session storage
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loginAsUser,
        isGuest,
        guestName,
        guestAvatar,
        authType,
        loginAsGuest,
        logoutGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
