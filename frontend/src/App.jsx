import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage'; // <-- A importação agora corresponde ao nome do arquivo
import Dashboard from './pages/Dashboard';
import Entregas from './pages/Entregas';
import Veiculos from './pages/Veiculos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota para a Landing Page */}
        <Route path="/" element={<HomePage />} /> 
        
        {/* Rotas da Área Logada - Usam o Layout (Sidebar/Header) */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/entregas" element={<Layout><Entregas /></Layout>} />
        <Route path="/veiculos" element={<Layout><Veiculos /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;