import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaChevronLeft } from 'react-icons/fa';
import {
  ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import './FakeDashboard.css';

// --- SVGs CUSTOMIZADOS PARA OS VEÍCULOS ---
const truckIconSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 10.5H19V9C19 8.44772 18.5523 8 18 8H15C14.4477 8 14 8.44772 14 9V11H8.5V9C8.5 8.44772 8.05228 8 7.5 8H4.5C3.94772 8 3.5 8.44772 3.5 9V15H4.5C4.5 14.1716 5.17157 13.5 6 13.5C6.82843 13.5 7.5 14.1716 7.5 15H17.5C17.5 14.1716 18.1716 13.5 19 13.5C19.8284 13.5 20.5 14.1716 20.5 15H22V10.5ZM6 15.5C5.44772 15.5 5 15.9477 5 16.5C5 17.0523 5.44772 17.5 6 17.5C6.55228 17.5 7 17.0523 7 16.5C7 15.9477 6.55228 15.5 6 15.5ZM19 15.5C18.4477 15.5 18 15.9477 18 16.5C18 17.0523 18.4477 17.5 19 17.5C19.5523 17.5 20 17.0523 20 16.5C20 15.9477 19.5523 15.5 19 15.5Z" fill="white"/></svg>`;
const vanIconSvg = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 16H2.5C1.94772 16 1.5 15.5523 1.5 15V10C1.5 9.44772 1.94772 9 2.5 9H21.5C22.0523 9 22.5 9.44772 22.5 10V15C22.5 15.5523 22.0523 16 21.5 16ZM5 18.5C4.17157 18.5 3.5 17.8284 3.5 17C3.5 16.1716 4.17157 15.5 5 15.5C5.82843 15.5 6.5 16.1716 6.5 17C6.5 17.8284 5.82843 18.5 5 18.5ZM19 18.5C18.1716 18.5 17.5 17.8284 17.5 17C17.5 16.1716 18.1716 15.5 19 15.5C19.8284 15.5 20.5 16.1716 20.5 17C20.5 17.8284 19.8284 18.5 19 18.5Z" fill="white"/></svg>`;

const createVehicleIcon = (iconSvg, status) => {
    return L.divIcon({
        html: `<div class="vehicle-icon-wrapper status-${status.toLowerCase().replace(' ', '-')}">${iconSvg}</div>`,
        className: 'vehicle-marker-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const rotasFake = [
    { id: 1, tipo: 'caminhao', placa: 'RDR-2025', motorista: 'Ana Souza', proximaEntrega: 'ID #1024', status: 'Em Rota', path: [[-25.42, -49.27], [-25.38, -49.22], [-25.44, -49.18]], predictedArrival: '15/05/2024 14:30', initialOffset: 0.1 },
    { id: 2, tipo: 'van', placa: 'VAN-007', motorista: 'Bruno Costa', proximaEntrega: 'ID #1025', status: 'Parado', path: [[-25.48, -49.30], [-25.45, -49.25]], predictedArrival: '15/05/2024 16:00', initialOffset: 0.5 },
    { id: 3, tipo: 'caminhao', placa: 'LOG-1234', motorista: 'Carlos Lima', proximaEntrega: 'ID #1026', status: 'Atrasado', path: [[-25.39, -49.32], [-25.43, -49.28], [-25.46, -49.24], [-25.49, -49.21]], predictedArrival: '15/05/2024 17:45', initialOffset: 0.8 },
];
const kpiData = { pedidosEntregues: 1245, entregaNoPrazo: 95, custoMedio: 28.50 };
const entregasPorStatusData = [{ name: 'Entregue', valor: 1245, fill: '#4CAF50' }, { name: 'Em Rota', valor: 120, fill: '#2196F3' }, { name: 'Pendente', valor: 85, fill: '#FFC107' }, { name: 'Falhou', valor: 12, fill: 'var(--logired-primary)' }];
const entregaNoPrazoData = [{ name: 'Jan', Taxa: 92 }, { name: 'Fev', Taxa: 94 }, { name: 'Mar', Taxa: 91 }, { name: 'Abr', Taxa: 95 }];

// --- SUB-COMPONENTE CORRIGIDO PARA ANIMAÇÃO ---
const AnimatedMarker = ({ rota, map, isInteractive }) => {
    const markerRef = useRef(null);

    useEffect(() => {
        if (markerRef.current && map) {
            const markerElement = markerRef.current.getElement();
            const latLngs = rota.path.map(p => L.latLng(p[0], p[1]));
            const projectedPoints = latLngs.map(ll => map.latLngToLayerPoint(ll));
            const svgPathString = L.PolylineUtil.pointsToPath(projectedPoints, false);
            
            markerElement.style.offsetPath = `path('${svgPathString}')`;
            markerElement.style.animation = `move-along-path 12s linear infinite`;
            markerElement.style.animationDelay = `-${rota.initialOffset * 12}s`;
        }
    }, [map, rota]);

    const icon = createVehicleIcon(rota.tipo === 'caminhao' ? truckIconSvg : vanIconSvg, rota.status);
    
    return (
        <Marker ref={markerRef} position={rota.path[0]} icon={icon}>
            {isInteractive && (
                <Popup>
                    <strong>{rota.placa}</strong><br/>
                    Motorista: {rota.motorista}<br/>
                    Status: {rota.status}
                </Popup>
            )}
        </Marker>
    );
};

function FakeDashboard({ isInteractive = true }) {
  const [activeView, setActiveView] = useState('overview');
  const [map, setMap] = useState(null); // Estado para guardar a instância do mapa
  const centroDoMapa = [-25.43, -49.25];

  const renderDetailView = () => { /* ... o código desta função continua exatamente o mesmo ... */ };

  return (
    <div className={`fake-dashboard-container ${isInteractive ? '' : 'non-interactive'}`}>
      <header className="fake-dashboard-header">
        <div className="fake-dashboard-logo"><div className="logo-square"></div>LOGÍSTICA</div>
        <div className="fake-dashboard-actions"><FaSearch /><FaUserCircle /></div>
      </header>
      <main className="fake-dashboard-grid">
        <div className="card map-card">
          <MapContainer whenCreated={setMap} center={centroDoMapa} zoom={12} scrollWheelZoom={isInteractive} dragging={isInteractive} zoomControl={false} attributionControl={false} className="interactive-map-container">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
            {rotasFake.map(rota => (
              <React.Fragment key={rota.id}>
                <CircleMarker center={rota.path[0]} radius={5} pathOptions={{ color: '#4CAF50', fillColor: 'white', fillOpacity: 1, weight: 2 }} >
                  {isInteractive && <Popup><strong>Ponto de Partida</strong><br/>Rota: {rota.placa}</Popup>}
                </CircleMarker>
                <CircleMarker center={rota.path[rota.path.length - 1]} radius={5} pathOptions={{ color: 'var(--logired-primary)', fillColor: 'white', fillOpacity: 1, weight: 2 }} >
                  {isInteractive && <Popup><strong>Previsão de Chegada:</strong><br/>{rota.predictedArrival}</Popup>}
                </CircleMarker>
                <Polyline pathOptions={{ color: 'white', weight: 3, opacity: 0.6, dashArray: '8, 12' }} positions={rota.path} />
                {map && <AnimatedMarker rota={rota} map={map} isInteractive={isInteractive} />}
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
        <div className="kpi-grid">
          {activeView === 'overview' ? (
            <>
              <div className={`card kpi-card ${isInteractive ? '' : 'non-interactive'}`} onClick={isInteractive ? () => setActiveView('entregas') : undefined}><p className="kpi-label">Pedidos entregues</p><p className="kpi-value">{kpiData.pedidosEntregues.toLocaleString('pt-BR')}</p><p className="kpi-change">+45 este mês</p></div>
              <div className={`card kpi-card ${isInteractive ? '' : 'non-interactive'}`} onClick={isInteractive ? () => setActiveView('prazo') : undefined}><p className="kpi-label">Entrega no prazo</p><p className="kpi-value">{kpiData.entregaNoPrazo}%</p><p className="kpi-change">+5%</p></div>
              <div className="card kpi-card disabled"><p className="kpi-label">Custo médio / entrega</p><p className="kpi-value">R$ {kpiData.custoMedio.toFixed(2).replace('.', ',')}</p><p className="kpi-change">-R$ 1,20</p></div>
            </>
          ) : (
            <div className="detail-view">
                <button onClick={() => setActiveView('overview')} className="back-button"><FaChevronLeft /> Voltar</button>
                <h4>{activeView === 'entregas' ? 'Detalhes de Pedidos por Status' : 'Performance no Prazo (%)'}</h4>
                {activeView === 'entregas' ? (
                  <ResponsiveContainer width="100%" height="90%"><BarChart data={entregasPorStatusData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: -10 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={80} stroke="var(--text-secondary)" fontSize={12} axisLine={false} tickLine={false} /><Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }} /><Bar dataKey="valor" barSize={20} radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="90%"><AreaChart data={entregaNoPrazoData} margin={{ top: 10, right: 20, left: -15, bottom: -10 }}><defs><linearGradient id="colorPrazo" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/><stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} /><YAxis unit="%" domain={[85, 100]} fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} /><Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }} /><Area type="monotone" dataKey="Taxa" stroke="#4CAF50" fillOpacity={1} fill="url(#colorPrazo)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
                )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FakeDashboard;