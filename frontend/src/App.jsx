import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas Públicas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Planos from './pages/Planos';
import DashboardPreviewPage from './pages/DashboardPreviewPage';

// Páginas Privadas (A Aplicação)
import Dashboard from './pages/Dashboard';
import Entregas from './pages/Entregas';
import Veiculos from './pages/Veiculos';
import Mapa from './pages/Mapa';
import Otimizacao from './pages/Otimizacao';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/planos" element={<Planos />} />
          <Route path="/preview" element={<DashboardPreviewPage />} />

          {/* Rotas Privadas Agrupadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/entregas" element={<Entregas />} />
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/otimizacao" element={<Otimizacao />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;