import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Páginas Públicas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Planos from './pages/Planos';
import DashboardPreviewPage from './pages/DashboardPreviewPage';

// Páginas Privadas
import Dashboard from './pages/Dashboard';
import Entregas from './pages/Entregas';
import Veiculos from './pages/Veiculos'; // <--- NOME CORRETO DO ARQUIVO
import Mapa from './pages/Mapa';
import Otimizacao from './pages/Otimizacao';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';

// Componentes de Layout
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 5000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            },
          }}
        />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/preview" element={<DashboardPreviewPage />} />
          
          {/* Agrupador para todas as rotas privadas */}
          <Route 
            path="/app/*" 
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="entregas" element={<Entregas />} />
                    <Route path="veiculos" element={<Veiculos />} /> {/* <-- NOME CORRETO DO COMPONENTE */}
                    <Route path="mapa" element={<Mapa />} />
                    <Route path="otimizacao" element={<Otimizacao />} />
                    <Route path="relatorios" element={<Relatorios />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                    <Route index element={<Navigate to="dashboard" />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;