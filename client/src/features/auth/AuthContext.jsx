import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../../lib/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('yatrabook_token');
      const savedUser = localStorage.getItem('yatrabook_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid
          const res = await authAPI.getMe();
          setUser(res.data);
          localStorage.setItem('yatrabook_user', JSON.stringify(res.data));
        } catch (err) {
          // Token invalid — clear
          localStorage.removeItem('yatrabook_token');
          localStorage.removeItem('yatrabook_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      const { user: userData, token } = res.data;
      localStorage.setItem('yatrabook_token', token);
      localStorage.setItem('yatrabook_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password, phone) => {
    setError(null);
    try {
      const res = await authAPI.register({ name, email, password, phone });
      const { user: userData, token } = res.data;
      localStorage.setItem('yatrabook_token', token);
      localStorage.setItem('yatrabook_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('yatrabook_token');
    localStorage.removeItem('yatrabook_user');
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('yatrabook_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
