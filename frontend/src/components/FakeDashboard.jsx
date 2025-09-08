import React, { useMemo, useState, useEffect, useRef } from 'react';
import { FaSearch, FaUserCircle, FaChevronLeft } from 'react-icons/fa';
import { 
  ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet'; // Importa a biblioteca Leaflet

import './FakeDashboard.css';

// --- NOVOS SVGs CUSTOMIZADOS PARA OS VEÍCULOS (Mais claros e distintos) ---
// Ícone de Caminhão de Entrega (mais parecido com a imagem de referência)
const truckIconSvg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 10.5C22 9.67157 21.3284 9 20.5 9H19C18.1716 9 17.5 9.67157 17.5 10.5V11H14C13.1716 11 12.5 11.6716 12.5 12.5V13H8.5C7.67157 13 7 13.6716 7 14.5V15H4.5C3.67157 15 3 15.6716 3 16.5V19C3 19.8284 3.67157 20.5 4.5 20.5H5.5C5.77614 20.5 6 20.2761 6 20V19C6 18.1716 6.67157 17.5 7.5 17.5H8.5C9.32843 17.5 10 18.1716 10 19V20C10 20.2761 10.2239 20.5 10.5 20.5H16.5C16.7761 20.5 17 20.2761 17 20V19C17 18.1716 17.6716 17.5 18.5 17.5H19.5C20.3284 17.5 21 18.1716 21 19V20C21 20.2761 21.2239 20.5 21.5 20.5H22.5C23.3284 20.5 24 19.8284 24 19V11.5C24 10.9477 23.5523 10.5 23 10.5H22ZM7.5 15.5H5.5V14.5C5.5 14.2239 5.72386 14 6 14H7.5C7.77614 14 8 14.2239 8 14.5V15.5C8 15.5 7.77614 15.5 7.5 15.5ZM19.5 15.5H18.5C18.2239 15.5 18 15.2761 18 15V14.5C18 14.2239 18.2239 14 18.5 14H19.5C19.7761 14 20 14.2239 20 14.5V15C20 15.2761 19.7761 15.5 19.5 15.5ZM19 12.5V12C19 11.7239 19.2239 11.5 19.5 11.5H20.5C20.7761 11.5 21 11.7239 21 12V12.5C21 12.7761 20.7761 13 20.5 13H19.5C19.2239 13 19 12.7761 19 12.5Z" fill="white"/></svg>`;
// Ícone de Van de Entrega (mais parecido com a imagem de referência)
const vanIconSvg = `<svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 16C21.7761 16 22 15.7761 22 15.5V14C22 13.4477 21.5523 13 21 13H20.5C20.2239 13 20 12.7761 20 12.5V11H17C16.4477 11 16 10.5523 16 10V9C16 8.44772 15.5523 8 15 8H8C7.44772 8 7 8.44772 7 9V10C7 10.5523 6.55228 11 6 11H3.5C2.94772 11 2.5 11.4477 2.5 12V12.5C2.5 12.7761 2.27614 13 2 13H1.5C0.947715 13 0.5 13.4477 0.5 14V15.5C0.5 15.7761 0.723858 16 1 16H2.5C2.77614 16 3 16.2239 3 16.5V17.5C3 18.3284 3.67157 19 4.5 19H5.5C5.77614 19 6 18.7761 6 18.5V17.5C6 16.6716 6.67157 16 7.5 16H8.5C9.32843 16 10 16.6716 10 17.5V18.5C10 18.7761 10.2239 19 10.5 19H17.5C17.7761 19 18 18.7761 18 18.5V17.5C18 16.6716 18.6716 16 19.5 16H20.5C20.7761 16 21 16.2239 21 16.5V18.5C21 18.7761 21.2239 19 21.5 19H22.5C23.3284 19 24 18.3284 24 17.5V16.5C24 16.2239 23.7761 16 23.5 16H21.5ZM5.5 15.5H4.5C4.22386 15.5 4 15.2761 4 15V14.5C4 14.2239 4.22386 14 4.5 14H5.5C5.77614 14 6 14.2239 6 14.5V15C6 15.2761 5.77614 15.5 5.5 15.5ZM19.5 15.5H18.5C18.2239 15.5 18 15.2761 18 15V14.5C18 14.2239 18.2239 14 18.5 14H19.5C19.7761 14 20 14.2239 20 14.5V15C20 15.2761 19.7761 15.5 19.5 15.5Z" fill="white"/></svg>`;

const createVehicleIcon = (iconSvg) => {
  return L.divIcon({
    html: `<div class="vehicle-icon-wrapper">${iconSvg}</div>`,
    className: 'vehicle-marker-icon',
    iconSize: [36, 36], // Tamanho do círculo de fundo
    iconAnchor: [18, 18], // Centraliza na base do ícone para SVGs de veículos
  });
};

const truckIcon = createVehicleIcon(truckIconSvg);
const vanIcon = createVehicleIcon(vanIconSvg);

// --- DADOS FAKES MAIS RICOS E COM COORDENADAS AJUSTADAS ---
// Coordenadas baseadas em Curitiba, mas espalhadas para evitar sobreposição
const rotasFake = [
    { 
      id: 1, tipo: 'caminhao', placa: 'RDR-2025', motorista: 'Ana Souza', proximaEntrega: 'ID #1024', status: 'Em Rota', 
      path: [[-25.40, -49.30], [-25.35, -49.25], [-25.42, -49.20]], // Rota Oeste para Leste
      predictedArrival: '15/05/2024 14:30', initialOffset: 0.1 // Começa 10% do caminho
    },
    { 
      id: 2, tipo: 'van', placa: 'VAN-007', motorista: 'Bruno Costa', proximaEntrega: 'ID #1025', status: 'Parado (Almoço)', 
      path: [[-25.48, -49.22], [-25.45, -49.28]], // Rota Sudoeste para Noroeste
      predictedArrival: '15/05/2024 16:00', initialOffset: 0.5 // Começa 50% do caminho
    },
    { 
      id: 3, tipo: 'caminhao', placa: 'LOG-1234', motorista: 'Carlos Lima', proximaEntrega: 'ID #1026', status: 'Atrasado', 
      path: [[-25.30, -49.28], [-25.35, -49.32], [-25.40, -49.25], [-25.45, -49.19]], // Rota Norte para Sudeste
      predictedArrival: '15/05/2024 17:45', initialOffset: 0.8 // Começa 80% do caminho
    },
];

const kpiData = { pedidosEntregues: 1245, entregaNoPrazo: 95, custoMedio: 28.50 };
const entregasPorStatusData = [ { name: 'Entregue', valor: 1245, fill: '#4CAF50' }, { name: 'Em Rota', valor: 120, fill: '#2196F3' }, { name: 'Pendente', valor: 85, fill: '#FFC107' }, { name: 'Falhou', valor: 12, fill: 'var(--logired-primary)' }, ];
const entregaNoPrazoData = [ { name: 'Jan', Taxa: 92 }, { name: 'Fev', Taxa: 94 }, { name: 'Mar', Taxa: 91 }, { name: 'Abr', Taxa: 95 }, ];


const FakeDashboard = ({ isInteractive = true }) => {
  const [activeView, setActiveView] = useState('overview');
  const centroDoMapa = [-25.43, -49.25]; // Centro do mapa em Curitiba

  const mapRef = useRef(); // Referência para o mapa Leaflet
  
  // Efeito para ajustar a animação dos markers após o mapa carregar
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    rotasFake.forEach(rota => {
      // Cria um ID de animação único para cada rota
      const animationId = `move-along-path-${rota.id}`;

      // Encontra o marker correspondente (pode ser necessário refatorar para um componente Marker customizado)
      // Por simplicidade, vamos tentar encontrar o ícone diretamente
      const markerElement = document.querySelector(`.vehicle-marker-icon[data-route-id="${rota.id}"]`);

      if (markerElement) {
        // Gera o path SVG para o offset-path
        const latLngs = rota.path.map(p => L.latLng(p[0], p[1]));
        const projectedPoints = latLngs.map(ll => map.latLngToLayerPoint(ll));
        const svgPath = L.PolylineUtil.pointsToPath(projectedPoints, false);
        
        // Aplica os estilos de animação
        markerElement.style.animation = `${animationId} 10s linear infinite`;
        markerElement.style.offsetPath = `path('${svgPath}')`;
        markerElement.style.offsetDistance = `${rota.initialOffset * 100}%`;
      }
    });

    // Adiciona keyframes dinamicamente para cada rota
    const styleSheet = document.styleSheets[0]; // Pega a primeira folha de estilos
    rotasFake.forEach(rota => {
      const animationId = `move-along-path-${rota.id}`;
      // Remove keyframes existentes antes de adicionar para evitar duplicatas em re-renderizações
      for(let i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].name === animationId) {
          styleSheet.deleteRule(i);
          break;
        }
      }
      styleSheet.insertRule(`@keyframes ${animationId} { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }`, styleSheet.cssRules.length);
    });

  }, [mapRef.current, rotasFake]); // Dependências para re-executar o efeito


  const renderDetailView = () => {
    switch (activeView) {
      case 'entregas':
        return (
          <div className="detail-view">
            <button onClick={() => setActiveView('overview')} className="back-button"><FaChevronLeft /> Voltar</button>
            <h4>Detalhes de Pedidos por Status</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={entregasPorStatusData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: -10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} stroke="var(--text-secondary)" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                <Bar dataKey="valor" barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'prazo':
        return (
          <div className="detail-view">
            <button onClick={() => setActiveView('overview')} className="back-button"><FaChevronLeft /> Voltar</button>
            <h4>Performance de Entrega no Prazo (%)</h4>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={entregaNoPrazoData} margin={{ top: 10, right: 20, left: -15, bottom: -10 }}>
                    <defs>
                        <linearGradient id="colorPrazo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                    <YAxis unit="%" domain={[85, 100]} fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                    <Area type="monotone" dataKey="Taxa" stroke="#4CAF50" fillOpacity={1} fill="url(#colorPrazo)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      default:
        return (
          <>
            <div className={`card kpi-card ${isInteractive ? '' : 'non-interactive'}`} onClick={isInteractive ? () => setActiveView('entregas') : null}><p className="kpi-label">Pedidos entregues</p><p className="kpi-value">{kpiData.pedidosEntregues.toLocaleString('pt-BR')}</p><p className="kpi-change">+45 este mês</p></div>
            <div className={`card kpi-card ${isInteractive ? '' : 'non-interactive'}`} onClick={isInteractive ? () => setActiveView('prazo') : null}><p className="kpi-label">Entrega no prazo</p><p className="kpi-value">{kpiData.entregaNoPrazo}%</p><p className="kpi-change">+5%</p></div>
            <div className="card kpi-card disabled"><p className="kpi-label">Custo médio / entrega</p><p className="kpi-value">R$ {kpiData.custoMedio.toFixed(2).replace('.', ',')}</p><p className="kpi-change">-R$ 1,20</p></div>
          </>
        );
    }
  };


  return (
    <div className={`fake-dashboard-container ${isInteractive ? '' : 'non-interactive'}`}>
      <header className="fake-dashboard-header">
        <div className="fake-dashboard-logo"><div className="logo-square"></div>LOGÍSTICA</div>
        <div className="fake-dashboard-actions"><FaSearch /><FaUserCircle /></div>
      </header>
      <main className="fake-dashboard-grid">
        <div className="card map-card">
          <MapContainer center={centroDoMapa} zoom={12} scrollWheelZoom={isInteractive} dragging={isInteractive} zoomControl={false} attributionControl={false} className="interactive-map-container" ref={mapRef}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png" />
            {rotasFake.map(rota => (
              <React.Fragment key={rota.id}>
                {/* Ponto de Partida (Verde) */}
                <CircleMarker center={rota.path[0]} radius={5} pathOptions={{ color: '#4CAF50', fillColor: 'white', fillOpacity: 1, weight: 2 }} >
                  {isInteractive && <Popup><strong>Ponto de Partida</strong><br/>Rota: {rota.placa}</Popup>}
                </CircleMarker>
                {/* Ponto de Chegada (Vermelho) */}
                <CircleMarker center={rota.path[rota.path.length - 1]} radius={5} pathOptions={{ color: 'var(--logired-primary)', fillColor: 'white', fillOpacity: 1, weight: 2 }} >
                  {isInteractive && <Popup>
                    <strong>Previsão de Chegada:</strong><br/>
                    {rota.predictedArrival}
                  </Popup>}
                </CircleMarker>
                {/* Rota (Linha tracejada branca) */}
                <Polyline pathOptions={{ color: 'white', weight: 3, opacity: 0.6, dashArray: '8, 12' }} positions={rota.path} />
                
                {/* Ícone do Veículo Animado */}
                <Marker 
                  position={rota.path[0]} // Posição inicial do marker, o CSS/JS vai animar
                  icon={rota.tipo === 'caminhao' ? truckIcon : vanIcon}
                  // Adiciona um atributo de dado para identificar o marker no useEffect
                  data-route-id={rota.id}
                >
                  {isInteractive && <Popup>
                    <strong>{rota.placa}</strong><br/>
                    Motorista: {rota.motorista}<br/>
                    Status: {rota.status}<br/>
                    Próxima Entrega: {rota.proximaEntrega}
                  </Popup>}
                </Marker>
              </React.Fragment>
            ))}
          </MapContainer>
        </div>
        <div className="kpi-grid">
          {renderDetailView()}
        </div>
      </main>
    </div>
  );
};

export default FakeDashboard;