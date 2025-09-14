import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Esta linha carrega os estilos globais
import './components/common.css'; // NOSSOS ESTILOS DE BOTÃO PADRONIZADOS
import 'leaflet/dist/leaflet.css'; // Esta linha carrega os estilos do mapa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
