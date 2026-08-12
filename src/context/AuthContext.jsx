import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    if (res.data.success) {
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.detail || 'Login failed');
  };

  const register = async (data) => {
    const res = await api.post('/auth/register/', data);
    return res.data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const res = await api.get('/auth/profile/');
        setUser(res.data);
      }
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};