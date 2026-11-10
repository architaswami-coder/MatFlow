// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { loginUser } from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      // Adjust keys based on your backend login response (e.g., response.data.token)
      const authToken = response.data.token;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed. Please check credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);