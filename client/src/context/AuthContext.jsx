import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestAvatar, setGuestAvatar] = useState('');
  const [authType, setAuthType] = useState(''); // 'user' | 'guest' | ''
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(userData);
        setAuthType('user');
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // No Firebase user, check for guest
        const storedGuest = JSON.parse(localStorage.getItem('guest'));
        if (storedGuest && storedGuest.name) {
          setIsGuest(true);
          setGuestName(storedGuest.name);
          setGuestAvatar(storedGuest.avatar || '');
          setAuthType('guest');
        } else {
          // No user at all
          setUser(null);
          setAuthType('');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
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

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local state
      setUser(null);
      setAuthType('');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userAvatar');
      logoutGuest(); // Also clears guest if any
      
      // Additional security: Clear any session storage
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        loading, // Expose loading state
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
