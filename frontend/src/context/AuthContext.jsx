import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:5000/api' 
    : '/api');

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists and fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!adminToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setAdminUser(data);
        } else {
          // Token expired or invalid
          logoutAdmin();
        }
      } catch (error) {
        console.error('Failed to authenticate token:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [adminToken]);

  const loginAdmin = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      setAdminToken(data.token);
      setAdminUser({ _id: data._id, username: data.username, role: data.role });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdminUser(null);
  };

  const value = {
    adminToken,
    adminUser,
    loading,
    isAuthenticated: !!adminToken,
    loginAdmin,
    logoutAdmin,
    apiUrl: API_URL
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
