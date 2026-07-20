import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi, sessionApi } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [progress, setProgress] = useState(null);
  const [activeSession, setActiveSessionState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
      setProgress(null);
      setActiveSessionState(null);
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const refreshProgress = async () => {
    if (!token) return;
    try {
      const data = await userApi.getMe();
      setProgress(data);
      setUser({
        id: data.userId,
        email: data.email,
        displayName: data.displayName,
      });
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  const fetchActiveSession = async () => {
    if (!token) return;
    try {
      const session = await sessionApi.getActive();
      if (session) {
        setActiveSessionState(session);
      } else {
        setActiveSessionState(null);
      }
    } catch (err) {
      console.error('Error fetching active session:', err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        await refreshProgress();
        await fetchActiveSession();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({
      id: res.userId,
      email: res.email,
      displayName: res.displayName,
    }));
    setToken(res.token);
    setUser({
      id: res.userId,
      email: res.email,
      displayName: res.displayName,
    });
  };

  const register = async (email, password, displayName) => {
    const res = await authApi.register(email, password, displayName);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify({
      id: res.userId,
      email: res.email,
      displayName: res.displayName,
    }));
    setToken(res.token);
    setUser({
      id: res.userId,
      email: res.email,
      displayName: res.displayName,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setProgress(null);
    setActiveSessionState(null);
  };

  const updateActiveSession = (session) => {
    setActiveSessionState(session);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      progress,
      activeSession,
      loading,
      login,
      register,
      logout,
      refreshProgress,
      setActiveSession: updateActiveSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
