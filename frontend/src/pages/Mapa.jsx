import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaTruck, FaRoute, FaExclamationTriangle, FaRegClock, FaFilter } from 'react-icons/fa';
import { FaVanShuttle } from 'react-icons/fa6'; // CORRIGIDO: Importação de FaVanShuttle

import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// --- DADOS FAKES ---
const rotasFake = [
  { id: 1, tipo: 'caminhao', placa: 'RDR-2025', motorista: 'Ana Souza', status: 'Em Rota', progresso: 75, path: [[-25.40, -49.30], [-25.35, -49.25], [-25.42, -49.20]], carga: 'Eletrônicos', proximaParada: 'Centro de Distribuição' },
  { id: 2, tipo: 'van', placa: 'VAN-007', motorista: 'Bruno Costa', status: 'Parado', progresso: 20, path: [[-25.48, -49.22], [-25.45, -49.28]], carga: 'Alimentos Perecíveis', proximaParada: 'Supermercado A' },
  { id: 3, tipo: 'caminhao', placa: 'LOG-1234', motorista: 'Carlos Lima', status: 'Atrasado', progresso: 50, path: [[-25.30, -49.28], [-25.35, -49.32], [-25.40, -49.25], [-25.45, -49.19]], carga: 'Material de Construção', proximaParada: 'Obra B' },
  { id: 4, tipo: 'van', placa: 'FRT-456', motorista: 'Daniela Alves', status: 'Em Rota', progresso: 90, path: [[-25.50, -49.35], [-25.52, -49.30]], carga: 'Pacotes E-commerce', proximaParada: 'Residência C' },
];

// --- COMPONENTES DO NOVO LAYOUT ---

const KpiCard = ({ title, value, icon }) => (
  <div className="map-kpi-card">
    <div className="title">{icon} {title}</div>
    <div className="value">{value}</div>
  </div>
);

const VehicleCard = ({ vehicle, onClick, isActive }) => {
  const statusClassName = `status-${vehicle.status.toLowerCase().replace(' ', '-')}`;
  return (
    <li className={`vehicle-card ${isActive ? 'active' : ''}`} onClick={() => onClick(vehicle)}>
      <div className="card-main-info">
        <div className="card-vehicle-icon">
          {vehicle.tipo === 'caminhao' ? <FaTruck /> : <FaVanShuttle />}
        </div>
        <div className="card-vehicle-details">
          <div className="plate">{vehicle.placa}</div>
          <div className="driver">{vehicle.motorista}</div>
        </div>
        <div className={`status-badge ${statusClassName}`}>
          <span className="dot"></span>
          <span>{vehicle.status}</span>
        </div>
      </div>
      <div className="card-progress-section">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${vehicle.progresso}%` }}></div>
        </div>
      </div>
    </li>
  );
};

const VehicleDetails = ({ vehicle }) => (
  <div className="vehicle-details-card">
    <h3 className="card-title">Detalhes do Veículo</h3>
    <div className="details-info-grid">
      <div className="info-item"><div className="label">Placa</div><div className="value">{vehicle.placa}</div></div>
      <div className="info-item"><div className="label">Status</div><div className="value">{vehicle.status}</div></div>
      <div className="info-item"><div className="label">Motorista</div><div className="value">{vehicle.motorista}</div></div>
      <div className="info-item"><div className="label">Progresso</div><div className="value">{vehicle.progresso}%</div></div>
    </div>
    <div className="info-item" style={{ marginBottom: '1rem' }}>
      <div className="label">Próxima Parada</div>
      <div className="value">{vehicle.proximaParada}</div>
    </div>
    <button className="btn btn-secondary" style={{width: '100%'}}>Ver Rota Completa</button>
  </div>
);

// Marcadores de Início e Fim da Rota
const createRouteMarker = (type) => L.divIcon({
  className: `route-marker ${type}`,
  iconSize: [12, 12]
});

const createVehicleMarkerIcon = (vehicle, isActive) => {
  const iconType = vehicle.tipo === 'caminhao' ? 'truck' : 'van';
  const statusClass = `status-${vehicle.status.toLowerCase().replace(' ', '-')}`;
  const truckSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-8.5l1.96 2.5H17V9.5h3.5zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>';
  const vanSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>';
  return L.divIcon({ html: `<div class="vehicle-map-icon ${statusClass}">${iconType === 'truck' ? truckSvg : vanSvg}</div>`, className: '', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36] });
};

function FlyToVehicle({ vehicle }) {
  const map = useMap();
  if (vehicle) { map.flyTo(vehicle.path[0], 15, { animate: true, duration: 1 }); }
  return null;
}

// --- COMPONENTE PRINCIPAL DA PÁGINA ---

function Mapa() {
  const [activeVehicle, setActiveVehicle] = useState(rotasFake[0]);

  const kpiValues = useMemo(() => ({
    emRota: rotasFake.filter(v => v.status === 'Em Rota').length,
    parados: rotasFake.filter(v => v.status === 'Parado').length,
    atrasados: rotasFake.filter(v => v.status === 'Atrasado').length,
    total: rotasFake.length,
  }), [rotasFake]);

  return (
    <div className="map-dashboard-grid">
      <div className="map-kpi-row">
        <KpiCard title="Veículos em Rota" value={kpiValues.emRota} icon={<FaRoute />} />
        <KpiCard title="Veículos Parados" value={kpiValues.parados} icon={<FaRegClock />} />
        <KpiCard title="Veículos Atrasados" value={kpiValues.atrasados} icon={<FaExclamationTriangle />} />
        <KpiCard title="Total na Frota Ativa" value={kpiValues.total} icon={<FaTruck />} />
      </div>

      <div className="map-main-card">
        <MapContainer center={activeVehicle.path[0]} zoom={14} className="live-map-container" zoomControl={false}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {rotasFake.map(rota => (
            <React.Fragment key={`route-${rota.id}`}>
              {/* Linha da Rota */}
              <Polyline positions={rota.path} color={rota.status === 'Atrasado' ? 'var(--status-atrasado)' : 'var(--vexa-primary)'} weight={4} />

              {/* Marcadores de Início e Fim */}
              <Marker position={rota.path[0]} icon={createRouteMarker('start')} />
              <Marker position={rota.path[rota.path.length - 1]} icon={createRouteMarker('end')} />

              {/* Ícone do Veículo */}
              <Marker 
                position={rota.path[0]} 
                icon={createVehicleIcon(rota)}
                eventHandlers={{ click: () => setActiveVehicle(rota) }}
              >
                <Popup>
                  <b>{rota.placa}</b><br />
                  Motorista: {rota.motorista}<br />
                  Status: {rota.status}
                </Popup>
              </Marker>
            </React.Fragment>
          ))}

          <FlyToVehicle vehicle={activeVehicle} />
        </MapContainer>
      </div>

      <div className="map-side-panel">
        <div className="fleet-list-card">
          <h3 className="card-title">Frota Ativa</h3>
          <ul className="vehicle-list">
            {rotasFake.map(v => (
              <VehicleCard 
                key={v.id} 
                vehicle={v} 
                onClick={setActiveVehicle} 
                isActive={v.id === activeVehicle?.id} />
            ))}
          </ul>
        </div>
        {activeVehicle && <VehicleDetails vehicle={activeVehicle} />}
      </div>
    </div>
  );
}

export default Mapa;