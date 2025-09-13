import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { FaTruck, FaFilter, FaTimes } from 'react-icons/fa';
import { FaVanShuttle } from 'react-icons/fa6';
import './Mapa.css';

// --- ÍCONES CUSTOMIZADOS PARA OS VEÍCULOS ---
const truckIconSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 10.5H19V9C19 8.44772 18.5523 8 18 8H15C14.4477 8 14 8.44772 14 9V11H8.5V9C8.5 8.44772 8.05228 8 7.5 8H4.5C3.94772 8 3.5 8.44772 3.5 9V15H4.5C4.5 14.1716 5.17157 13.5 6 13.5C6.82843 13.5 7.5 14.1716 7.5 15H17.5C17.5 14.1716 18.1716 13.5 19 13.5C19.8284 13.5 20.5 14.1716 20.5 15H22V10.5ZM6 15.5C5.44772 15.5 5 15.9477 5 16.5C5 17.0523 5.44772 17.5 6 17.5C6.55228 17.5 7 17.0523 7 16.5C7 15.9477 6.55228 15.5 6 15.5ZM19 15.5C18.4477 15.5 18 15.9477 18 16.5C18 17.0523 18.4477 17.5 19 17.5C19.5523 17.5 20 17.0523 20 16.5C20 15.9477 19.5523 15.5 19 15.5Z" fill="white"/></svg>`;
const vanIconSvg = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 16H2.5C1.94772 16 1.5 15.5523 1.5 15V10C1.5 9.44772 1.94772 9 2.5 9H21.5C22.0523 9 22.5 9.44772 22.5 10V15C22.5 15.5523 22.0523 16 21.5 16ZM5 18.5C4.17157 18.5 3.5 17.8284 3.5 17C3.5 16.1716 4.17157 15.5 5 15.5C5.82843 15.5 6.5 16.1716 6.5 17C6.5 17.8284 5.82843 18.5 5 18.5ZM19 18.5C18.1716 18.5 17.5 17.8284 17.5 17C17.5 16.1716 18.1716 15.5 19 15.5C19.8284 15.5 20.5 16.1716 20.5 17C20.5 17.8284 19.8284 18.5 19 18.5Z" fill="white"/></svg>`;

const createVehicleIcon = (iconSvg, status) => {
  const colorClass = `status-${status.toLowerCase().replace(' ', '-')}`;
  return L.divIcon({
    html: `<div class="vehicle-icon-wrapper ${colorClass}">${iconSvg}</div>`,
    className: 'vehicle-marker-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// --- DADOS FAKES PARA O MAPA ---
const rotasFake = [
    { id: 1, tipo: 'caminhao', placa: 'RDR-2025', motorista: 'Ana Souza', status: 'Em Rota', path: [[-25.40, -49.30], [-25.35, -49.25], [-25.42, -49.20]] },
    { id: 2, tipo: 'van', placa: 'VAN-007', motorista: 'Bruno Costa', status: 'Parado', path: [[-25.48, -49.22], [-25.45, -49.28]] },
    { id: 3, tipo: 'caminhao', placa: 'LOG-1234', motorista: 'Carlos Lima', status: 'Atrasado', path: [[-25.30, -49.28], [-25.35, -49.32], [-25.40, -49.25], [-25.45, -49.19]] },
];

function Mapa() {
  const [activeVehicle, setActiveVehicle] = useState(null);
  const mapRef = useRef();

  const handleVehicleClick = (veiculo) => {
    setActiveVehicle(veiculo);
    if (mapRef.current) {
      mapRef.current.flyTo(veiculo.path[0], 14);
    }
  };

  return (
    <div className="map-page-container">
      <aside className="map-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-header">
            <h3>Frota Ativa</h3>
            <button className="filter-btn"><FaFilter /> Filtrar</button>
          </div>
          <ul className="vehicle-list">
            {rotasFake.map(veiculo => (
              <li 
                key={veiculo.id} 
                className={`vehicle-item ${activeVehicle?.id === veiculo.id ? 'active' : ''}`}
                onClick={() => handleVehicleClick(veiculo)}
              >
                <div className="vehicle-item-icon">
                  {veiculo.tipo === 'caminhao' ? <FaTruck /> : <FaVanShuttle />}
                </div>
                <div className="vehicle-item-info">
                  <span className="vehicle-plate">{veiculo.placa}</span>
                  <span className={`vehicle-status status-${veiculo.status.toLowerCase().replace(' ', '-')}`}>
                    {veiculo.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {activeVehicle && (
          <div className="sidebar-section vehicle-details">
             <div className="sidebar-header">
                <h3>Detalhes do Veículo</h3>
                <button onClick={() => setActiveVehicle(null)} className="close-details-btn"><FaTimes /></button>
            </div>
            <p><strong>Placa:</strong> {activeVehicle.placa}</p>
            <p><strong>Motorista:</strong> {activeVehicle.motorista}</p>
            <p><strong>Status:</strong> {activeVehicle.status}</p>
            <p><strong>Próxima Parada:</strong> {activeVehicle.path[1].join(', ')}</p>
          </div>
        )}
      </aside>
      <main className="map-main-content">
        <MapContainer 
          center={[-25.43, -49.25]} 
          zoom={12} 
          className="live-map-container"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />
          {rotasFake.map(rota => (
            <React.Fragment key={`route-${rota.id}`}>
              <Polyline 
                pathOptions={{ 
                  color: 'var(--logired-primary)', 
                  weight: 3, 
                  opacity: 0.7, 
                  dashArray: '8, 8' 
                }} 
                positions={rota.path} 
              />
              <Marker
                position={rota.path[0]}
                icon={createVehicleIcon(
                  rota.tipo === 'caminhao' ? truckIconSvg : vanIconSvg,
                  rota.status
                )}
              >
                <Popup>
                  <strong>{rota.placa}</strong><br />
                  {rota.motorista} - {rota.status}
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

export default Mapa;