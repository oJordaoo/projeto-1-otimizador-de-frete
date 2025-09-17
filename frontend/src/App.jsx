import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Páginas Públicas
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Planos from './pages/Planos.jsx';
import DashboardPreviewPage from './pages/DashboardPreviewPage.jsx';

// Páginas Privadas
import Dashboard from './pages/Dashboard.jsx';
import Entregas from './pages/Entregas.jsx';
import EntregaDetalhes from './pages/EntregaDetalhes.jsx'; // <-- NOVO
import Veiculos from './pages/Veiculos.jsx';
import Mapa from './pages/Mapa.jsx';
import Otimizacao from './pages/Otimizacao.jsx';
import Relatorios from './pages/Relatorios.jsx';
import Configuracoes from './pages/Configuracoes.jsx';

// Componentes de Layout
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 5000,
            style: {
              background: '#FFFFFF',
              color: '#111827',
              border: '1px solid #E5E7EB',
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
          
          {/* Rotas Privadas */}
          <Route 
            path="/app" 
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="entregas" element={<Entregas />} />
            <Route path="entregas/:entregaId" element={<EntregaDetalhes />} /> {/* <-- NOVO */}
            <Route path="veiculos" element={<Veiculos />} />
            <Route path="mapa" element={<Mapa />} />
            <Route path="otimizacao" element={<Otimizacao />} />
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;