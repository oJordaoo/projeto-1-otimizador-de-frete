import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaTruck, FaFilter, FaCircle, FaSearch, FaRoute } from 'react-icons/fa';
import { FaVanShuttle } from 'react-icons/fa6';
import './Mapa.css';

// --- ÍCONES CUSTOMIZADOS ---
const createVehicleIcon = (status) => {
  const statusColor = { 'EM_ROTA': 'var(--vexa-accent)', 'DISPONIVEL': 'var(--status-disponivel-color)', 'MANUTENCAO': 'var(--status-manutencao-color)' };
  const iconHtml = `<div class="vehicle-marker-icon" style="background-color: ${statusColor[status] || '#ccc'};"><svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M22 10.5H19V9C19 8.44772 18.5523 8 18 8H15C14.4477 8 14 8.44772 14 9V11H8.5V9C8.5 8.44772 8.05228 8 7.5 8H4.5C3.94772 8 3.5 8.44772 3.5 9V15H4.5C4.5 14.1716 5.17157 13.5 6 13.5C6.82843 13.5 7.5 14.1716 7.5 15H15.5C15.5 14.1716 16.1716 13.5 17 13.5C17.8284 13.5 18.5 14.1716 18.5 15H22V10.5Z"/></svg></div>`;
  return L.divIcon({ html: iconHtml, className: 'vehicle-marker', iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -38] });
};

const createFlagIcon = (type) => {
  const iconColor = type === 'origin' ? 'var(--status-disponivel-color)' : 'var(--vexa-primary)';
  const iconClass = type === 'origin' ? 'fa-flag' : 'fa-flag-checkered';
  const iconHtml = `<div class="route-flag-icon"><i class="fa ${iconClass}" style="color: ${iconColor};"></i></div>`;
  return L.divIcon({ html: iconHtml, className: 'route-flag-marker', iconSize: [24, 24], iconAnchor: [4, 24]});
};

// --- COMPONENTE PARA ANIMAÇÃO DO MAPA ---
const MapAnimator = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, zoom, { animate: true, duration: 1.5 }); }, [center, zoom, map]);
  return null;
};

// --- DADOS FAKES ---
const fakeVehiclesData = [
    { id: 'v1', placa: 'VEX-001', tipo: 'Van', status: 'EM_ROTA', lat: -25.43, lng: -49.27, motorista: 'Carlos Silva', destino: 'Centro Cívico', rota: { origem: [-25.45, -49.31], destino: [-25.41, -49.25] } },
    { id: 'v2', placa: 'VEX-002', tipo: 'Caminhão', status: 'EM_ROTA', lat: -25.42, lng: -49.26, motorista: 'Ana Pereira', destino: 'Batel', rota: { origem: [-25.41, -49.30], destino: [-25.43, -49.23] } },
    { id: 'v3', placa: 'VEX-003', tipo: 'Van', status: 'DISPONIVEL', lat: -25.445, lng: -49.29, motorista: 'João Costa', destino: 'Garagem' },
    { id: 'v4', placa: 'VEX-004', tipo: 'Caminhão', status: 'EM_ROTA', lat: -25.428, lng: -49.272, motorista: 'Mariana Lima', destino: 'Cabral', rota: { origem: [-25.45, -49.28], destino: [-25.40, -49.26] } },
    { id: 'v5', placa: 'VEX-005', tipo: 'Caminhão', status: 'MANUTENCAO', lat: -25.435, lng: -49.275, motorista: 'Ricardo Souza', destino: 'Oficina' },
];

function Mapa() {
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [mapCenter, setMapCenter] = useState([-25.44, -49.29]);
  const [mapZoom, setMapZoom] = useState(13);

  const filteredVehicles = useMemo(() => {
    return fakeVehiclesData
      .filter(v => activeFilter === 'TODOS' || v.status === activeFilter)
      .filter(v => 
        v.placa.toLowerCase().includes(searchQuery.toLowerCase()) || 
        v.motorista.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [activeFilter, searchQuery]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setMapCenter([vehicle.lat, vehicle.lng]);
    setMapZoom(16);
  };

  return (
    <div className="page-container mapa-page-container">
      {/* O cabeçalho agora é apenas o título */}
      <div className="page-header">
        <h1>Mapa em Tempo Real</h1>
      </div>

      <div className="mapa-page-layout">
        <aside className="map-controls-panel">
          {/* Controles movidos para cá */}
          <div className="panel-controls-wrapper">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Buscar por placa ou motorista..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className="panel-filters">
              <button className={activeFilter === 'TODOS' ? 'active' : ''} onClick={() => setActiveFilter('TODOS')}>Todos</button>
              <button className={activeFilter === 'EM_ROTA' ? 'active' : ''} onClick={() => setActiveFilter('EM_ROTA')}>Em Rota</button>
              <button className={activeFilter === 'DISPONIVEL' ? 'active' : ''} onClick={() => setActiveFilter('DISPONIVEL')}>Disponível</button>
            </div>
          </div>
          
          <ul className="vehicle-list">
            {filteredVehicles.length > 0 ? filteredVehicles.map(v => (
              <li key={v.id} className={selectedVehicle?.id === v.id ? 'active' : ''} onClick={() => handleVehicleSelect(v)}>
                <div className="vehicle-list-icon">{v.tipo === 'Van' ? <FaVanShuttle /> : <FaTruck />}</div>
                <div className="vehicle-list-info">
                  <span className="placa">{v.placa}</span>
                  <span className="motorista">{v.motorista}</span>
                  <span className="destino"><FaRoute /> {v.destino}</span>
                </div>
                <FaCircle className={`status-indicator status-${v.status.toLowerCase()}`} />
              </li>
            )) : <p className='no-results-message'>Nenhum veículo encontrado.</p>}
          </ul>
        </aside>

        <main className="map-display-area">
          <MapContainer center={mapCenter} zoom={mapZoom} className="leaflet-map-container" zoomControl={false}>
            <MapAnimator center={mapCenter} zoom={mapZoom} />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            
            {filteredVehicles.map((vehicle) => (
              <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]} icon={createVehicleIcon(vehicle.status)}>
                <Tooltip direction="right" offset={[15, 0]} opacity={0.9} permanent className="vehicle-tooltip">{vehicle.placa}</Tooltip>
                <Popup>
                  <div className="popup-header">{vehicle.placa} ({vehicle.tipo})</div>
                  <div className="popup-body"><p><strong>Motorista:</strong> {vehicle.motorista}</p><p><strong>Status:</strong> <span className={`status-text-${vehicle.status.toLowerCase()}`}>{vehicle.status.replace('_', ' ')}</span></p></div>
                  <button className="btn-popup">Ver Detalhes</button>
                </Popup>
              </Marker>
            ))}
            
            {selectedVehicle && selectedVehicle.rota && (
              <>
                <Marker position={selectedVehicle.rota.origem} icon={createFlagIcon('origin')}><Popup>Origem</Popup></Marker>
                <Marker position={selectedVehicle.rota.destino} icon={createFlagIcon('destination')}><Popup>Destino</Popup></Marker>
                <Polyline positions={[selectedVehicle.rota.origem, [selectedVehicle.lat, selectedVehicle.lng]]} color="var(--vexa-accent)" weight={5} opacity={0.8} />
                <Polyline positions={[[selectedVehicle.lat, selectedVehicle.lng], selectedVehicle.rota.destino]} color="var(--vexa-accent)" weight={5} opacity={0.4} dashArray="10, 10" />
              </>
            )}
          </MapContainer>
        </main>
      </div>
    </div>
  );
}

export default Mapa;