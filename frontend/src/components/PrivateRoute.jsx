import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const PrivateRoute = () => {
  // Agora estamos pegando a variável correta do nosso contexto
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }
  
  // Se estiver autenticado, renderiza o Layout com a página solicitada
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;