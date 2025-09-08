import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // Cria uma variável booleana simples para verificar a autenticação
  const isAuthenticated = !!accessToken;

  const loginAction = async (data) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: data.username,
        password: data.password,
      });

      if (response.data) {
        setAccessToken(response.data.access);
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        navigate('/dashboard');
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

  // O valor fornecido pelo Contexto agora inclui 'isAuthenticated'
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