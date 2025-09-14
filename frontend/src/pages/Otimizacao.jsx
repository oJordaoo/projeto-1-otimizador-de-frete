import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { FaBoxOpen, FaTruck, FaCog, FaCheckCircle } from 'react-icons/fa';

import 'leaflet/dist/leaflet.css';
import './Otimizacao.css';

// --- DADOS FAKES PARA A SIMULAÇÃO ---
const fakeDeliveries = [
  { id: 'd1', address: 'R. da Glória, 123', volume: 2, lat: -25.43, lng: -49.27 },
  { id: 'd2', address: 'Av. Cândido de Abreu, 456', volume: 1, lat: -25.42, lng: -49.26 },
  { id: 'd3', address: 'Al. Dr. Muricy, 789', volume: 5, lat: -25.435, lng: -49.275 },
  { id: 'd4', address: 'R. XV de Novembro, 101', volume: 3, lat: -25.428, lng: -49.272 },
  { id: 'd5', address: 'Av. Batel, 202', volume: 4, lat: -25.445, lng: -49.29 },
];

const fakeFleet = [
  { id: 'v1', name: 'VAN-001', capacity: 10 },
  { id: 'v2', name: 'VAN-002', capacity: 10 },
  { id: 'v3', name: 'CAM-001', capacity: 25 },
];

// --- COMPONENTES ---

const SelectionList = ({ title, icon, items, selectedItems, onToggle }) => (
  <div className="config-step">
    <h2>{icon} {title}</h2>
    <div className="selection-list">
      {items.map(item => (
        <div key={item.id} className="selection-item" onClick={() => onToggle(item.id)}>
          <input 
            type="checkbox" 
            checked={selectedItems.includes(item.id)} 
            readOnly 
          />
          <div className="item-details">
            <p>{item.address || item.name}</p>
            <span>{item.volume ? `Volume: ${item.volume}m³` : `Capacidade: ${item.capacity}m³`}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LoadingOverlay = () => (
  <div className="optimization-overlay">
    <div className="loading-animation">
      <h3>Otimizando Rotas...</h3>
      <p style={{color: 'var(--text-secondary)'}}>Aguarde, estamos encontrando o melhor caminho para sua frota.</p>
    </div>
  </div>
);

const ResultsOverlay = ({ stats, onReset }) => (
  <div className="optimization-overlay">
    <div className="results-summary">
      <h2 className="results-header">
        <FaCheckCircle />
        <span>Otimização Concluída!</span>
      </h2>
      <p className="results-subheader">Encontramos as melhores rotas para suas entregas e frota selecionada.</p>
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="label">Custo Total</div>
          <div className="value">R$ {stats.cost} <span>(-{stats.costSavings}%)</span></div>
        </div>
        <div className="kpi-card">
          <div className="label">Distância Total</div>
          <div className="value">{stats.distance} km</div>
        </div>
        <div className="kpi-card">
          <div className="label">Veículos Utilizados</div>
          <div className="value">{stats.vehiclesUsed}</div>
        </div>
      </div>
      <div className="results-actions">
        <button className="results-btn" onClick={onReset}>Planejar Nova Otimização</button>
      </div>
    </div>
  </div>
);

// --- PÁGINA PRINCIPAL ---

function Otimizacao() {
  const [selectedDeliveries, setSelectedDeliveries] = useState([]);
  const [selectedFleet, setSelectedFleet] = useState([]);
  const [optimizationStatus, setOptimizationStatus] = useState('idle'); // idle, loading, success

  const handleToggleDelivery = (id) => {
    setSelectedDeliveries(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleFleet = (id) => {
    setSelectedFleet(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const runOptimization = () => {
    setOptimizationStatus('loading');
    // Simula uma chamada de API que demora 3 segundos
    setTimeout(() => {
      setOptimizationStatus('success');
    }, 3000);
  };

  const resetOptimization = () => {
    setOptimizationStatus('idle');
    setSelectedDeliveries([]);
    setSelectedFleet([]);
  };

  // Dados fakes para os resultados
  const fakeResults = {
    cost: '480,00', costSavings: 22, distance: 127, vehiclesUsed: 2
  };

  return (
    <div className="optimizer-page-container">
      {/* Painel de Controle à Esquerda */}
      <aside className="control-panel">
        <header className="panel-header">
          <h1>Planejador de Missão</h1>
        </header>
        <div className="panel-content">
          <SelectionList 
            title="Selecionar Entregas"
            icon={<FaBoxOpen />}
            items={fakeDeliveries}
            selectedItems={selectedDeliveries}
            onToggle={handleToggleDelivery}
          />
          <SelectionList 
            title="Selecionar Frota Disponível"
            icon={<FaTruck />}
            items={fakeFleet}
            selectedItems={selectedFleet}
            onToggle={handleToggleFleet}
          />
          <div className="config-step">
            <h2><FaCog /> Parâmetros</h2>
            {/* Aqui entrariam os inputs para os parâmetros de otimização */}
            <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>Em breve: configuração de prioridades, janelas de tempo e mais.</p>
          </div>
        </div>
        <footer className="panel-footer">
          <button className="btn btn-primary" onClick={runOptimization} disabled={selectedDeliveries.length === 0 || selectedFleet.length === 0}>
            Otimizar Agora!
          </button>
        </footer>
      </aside>

      {/* Área do Mapa à Direita */}
      <main className="map-area">
        <MapContainer 
          center={[-25.43, -49.27]} 
          zoom={13} 
          className="live-map-container"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {/* Visualização das entregas selecionadas */}
          {fakeDeliveries.map(d => selectedDeliveries.includes(d.id) && (
            <Marker key={d.id} position={[d.lat, d.lng]}>
              <Popup>{d.address}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {optimizationStatus === 'loading' && <LoadingOverlay />}
        {optimizationStatus === 'success' && <ResultsOverlay stats={fakeResults} onReset={resetOptimization} />}
      </main>
    </div>
  );
}

export default Otimizacao;