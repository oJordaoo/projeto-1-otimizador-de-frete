import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Entregas from './pages/Entregas';
import Veiculos from './pages/Veiculos';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entregas" element={<Entregas />} />
          <Route path="/veiculos" element={<Veiculos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;