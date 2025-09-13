import React, { createContext, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  const isAuthenticated = !!accessToken;

  const loginAction = async (data) => {
    try {
      const response = await axiosInstance.post('/token/', {
        username: data.username,
        password: data.password,
      });
      if (response.data) {
        setAccessToken(response.data.access);
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        navigate('/app/dashboard');
        return;
      }
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.detail || 'Usuário ou senha inválidos.');
    }
  };

  const logoutAction = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const value = {
    accessToken,
    isAuthenticated,
    loginAction,
    logoutAction,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};