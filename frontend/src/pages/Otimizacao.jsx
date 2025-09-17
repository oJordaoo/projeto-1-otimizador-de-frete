import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FaBoxOpen, FaTruck, FaCog, FaCheckCircle, FaTimesCircle, FaClock, FaRoute, FaArrowLeft, FaGasPump, FaStopwatch, FaDollarSign } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import './Otimizacao.css';

// --- ÍCONES CUSTOMIZADOS ---
const createNumberedMarkerIcon = (number) => {
    const iconHtml = `<div class="numbered-marker-icon"><span>${number}</span></div>`;
    return L.divIcon({ html: iconHtml, className: 'numbered-marker', iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -42] });
};

// --- DADOS FAKES (MAIS RICOS PARA O RESULTADO) ---
const fakeDeliveries = [
  { id: 'd1', address: 'R. da Glória, 123', volume: 2, lat: -25.43, lng: -49.27, selected: true },
  { id: 'd2', address: 'Av. Cândido de Abreu, 456', volume: 1, lat: -25.42, lng: -49.26, selected: true },
  { id: 'd3', address: 'Al. Dr. Muricy, 789', volume: 5, lat: -25.435, lng: -49.275, selected: true },
  { id: 'd4', address: 'R. XV de Novembro, 101', volume: 3, lat: -25.428, lng: -49.272, selected: true },
  { id: 'd5', address: 'Av. Batel, 202', volume: 4, lat: -25.445, lng: -49.29, selected: false },
];
const fakeFleet = [
  { id: 'v1', name: 'VAN-001', capacity: 10, lat: -25.45, lng: -49.31, selected: true },
  { id: 'v2', name: 'CAM-003', capacity: 30, lat: -25.41, lng: -49.30, selected: true },
  { id: 'v3', name: 'VAN-002', capacity: 10, lat: -25.46, lng: -49.28, selected: false },
];

const fakeOptimizationResult = {
  summary: { cost: 480.50, distance: 85, timeSaved: 2.5, costReduction: 15 },
  routes: [
    { 
      vehicleId: 'v1', vehicleName: 'VAN-001', stopCount: 2, distance: 35, duration: 1.5,
      stops: [fakeDeliveries[1], fakeDeliveries[0]],
      path: [[-25.41, -49.30], [-25.42, -49.26], [-25.43, -49.27]],
      color: 'var(--vexa-accent)'
    },
    { 
      vehicleId: 'v2', vehicleName: 'CAM-003', stopCount: 2, distance: 50, duration: 2.2,
      stops: [fakeDeliveries[2], fakeDeliveries[3]],
      path: [[-25.45, -49.31], [-25.435, -49.275], [-25.428, -49.272]],
      color: '#3498DB'
    }
  ]
};

const LoadingOverlay = () => <div className="optimization-overlay"><div className="spinner"></div><p>Otimizando rotas...</p></div>;

// Componente para controlar o mapa (zoom e centralização)
const MapController = ({ center, zoom, bounds }) => {
    const map = useMap();
    useEffect(() => {
        if (bounds) {
            map.flyToBounds(bounds, { padding: [50, 50] });
        } else if (center) {
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        }
    }, [center, zoom, bounds, map]);
    return null;
};

function Otimizacao() {
  const [deliveries, setDeliveries] = useState(fakeDeliveries);
  const [fleet, setFleet] = useState(fakeFleet);
  const [optimizationStatus, setOptimizationStatus] = useState('idle'); // idle, loading, results
  const [results, setResults] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [mapView, setMapView] = useState({ center: [-25.44, -49.29], zoom: 12, bounds: null });

  const [params, setParams] = useState({
    priority: 'cost', startTime: '08:00', endTime: '18:00',
    avoidTolls: true, allowMultipleTrips: false,
  });

  const handleParamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setParams(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const selectedDeliveries = useMemo(() => deliveries.filter(d => d.selected), [deliveries]);
  const selectedFleet = useMemo(() => fleet.filter(v => v.selected), [fleet]);

  const runOptimization = () => {
    setOptimizationStatus('loading');
    setTimeout(() => {
      setResults(fakeOptimizationResult);
      setOptimizationStatus('results');
      // Ao obter resultados, define os limites do mapa para abranger todas as rotas
      const allPoints = fakeOptimizationResult.routes.flatMap(r => r.path);
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        setMapView(prev => ({...prev, bounds }));
      }
    }, 2500);
  };

  const resetToPlanning = () => {
    setOptimizationStatus('idle');
    setResults(null);
    setSelectedRouteId(null);
    setMapView({ center: [-25.44, -49.29], zoom: 12, bounds: null });
  };
  
  const handleToggleSelection = (type, id) => {
    const updater = (prevItems) => prevItems.map(item => item.id === id ? { ...item, selected: !item.selected } : item);
    if (type === 'delivery') setDeliveries(updater);
    if (type === 'fleet') setFleet(updater);
  };
  
  const handleRouteSelect = (route) => {
    setSelectedRouteId(route.vehicleId);
    const bounds = L.latLngBounds(route.path);
    setMapView(prev => ({...prev, bounds }));
  };

  const PlanningPanel = () => (
    <>
      <div className="panel-header"><h1>Planejador de Missão</h1><p>Selecione as entregas e a frota para otimizar.</p></div>
      <div className="panel-body">
        <div className="panel-section"><h2 className="section-title"><FaBoxOpen /> Entregas Disponíveis ({selectedDeliveries.length})</h2><ul className="selection-list">{deliveries.map(d => (<li key={d.id} onClick={() => handleToggleSelection('delivery', d.id)} className={d.selected ? 'selected' : ''}><span>{d.address} ({d.volume}m³)</span>{d.selected ? <FaCheckCircle className="check-icon" /> : <FaTimesCircle className="times-icon" />}</li>))}</ul></div>
        <div className="panel-section"><h2 className="section-title"><FaTruck /> Frota Disponível ({selectedFleet.length})</h2><ul className="selection-list">{fleet.map(v => (<li key={v.id} onClick={() => handleToggleSelection('fleet', v.id)} className={v.selected ? 'selected' : ''}><span>{v.name} (Cap: {v.capacity}m³)</span>{v.selected ? <FaCheckCircle className="check-icon" /> : <FaTimesCircle className="times-icon" />}</li>))}</ul></div>
        <div className="panel-section">
          <h2 className="section-title"><FaCog /> Parâmetros da Otimização</h2>
          <div className="parameter-group"><label>Priorizar</label><select name="priority" value={params.priority} onChange={handleParamChange}><option value="cost">Menor Custo</option><option value="time">Menor Tempo</option></select></div>
          <div className="parameter-group"><label>Janela de tempo de entrega</label><div className="time-window-inputs"><div className="custom-time-input"><FaClock/><input type="time" name="startTime" value={params.startTime} onChange={handleParamChange}/></div><span>até</span><div className="custom-time-input"><FaClock/><input type="time" name="endTime" value={params.endTime} onChange={handleParamChange}/></div></div></div>
          <div className="parameter-group"><label>Restrições</label><div className="checkbox-group"><label><input type="checkbox" name="avoidTolls" checked={params.avoidTolls} onChange={handleParamChange} /> Evitar pedágios</label><label><input type="checkbox" name="allowMultipleTrips" checked={params.allowMultipleTrips} onChange={handleParamChange} /> Permitir múltiplas viagens</label></div></div>
        </div>
      </div>
      <footer className="panel-footer"><button className="btn-primary" onClick={runOptimization} disabled={selectedDeliveries.length === 0 || selectedFleet.length === 0}>Otimizar Agora!</button></footer>
    </>
  );

  const ResultsPanel = () => (
    <>
      <div className="panel-header results-header">
        <button className="back-btn" onClick={resetToPlanning}><FaArrowLeft /> Voltar ao Planejamento</button>
        <h1>Resultados da Otimização</h1>
      </div>
      <div className="panel-body results-body">
        <div className="results-kpi-grid">
          <div className="results-kpi-card">
            <div className="kpi-icon money"><FaDollarSign/></div>
            <div className="kpi-content">
              <span>R$ {results.summary.cost.toFixed(2)}</span>
              <p>Custo Total Estimado</p>
            </div>
          </div>
          <div className="results-kpi-card">
            <div className="kpi-icon distance"><FaRoute/></div>
            <div className="kpi-content">
              <span>{results.summary.distance} km</span>
              <p>Distância Total Otimizada</p>
            </div>
          </div>
          <div className="results-kpi-card">
            <div className="kpi-icon time"><FaStopwatch/></div>
            <div className="kpi-content">
              <span>{results.summary.timeSaved} h</span>
              <p>Tempo de Rota Economizado</p>
            </div>
          </div>
        </div>
        <h2 className="section-title">Rotas Planejadas</h2>
        {results.routes.map((route, index) => (
          <div key={index} className={`route-card ${selectedRouteId === route.vehicleId ? 'active' : ''}`} onClick={() => handleRouteSelect(route)}>
            <div className="route-card-header">
              <FaTruck style={{color: route.color}} />
              <h3>{route.vehicleName}</h3>
              <div className="route-summary">{route.stopCount} paradas • {route.distance} km • {route.duration}h</div>
            </div>
            <ol className="stop-list">
              {route.stops.map((stop, stopIndex) => ( <li key={stop.id}><span>{stopIndex + 1}</span>{stop.address}</li> ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="optimizer-page-container">
      <aside className="control-panel">
        {optimizationStatus === 'results' ? <ResultsPanel /> : <PlanningPanel />}
      </aside>
      <main className="map-area">
        <MapContainer center={mapView.center} zoom={mapView.zoom} className="live-map-container" zoomControl={false}>
          <MapController {...mapView} />
          <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
          {optimizationStatus !== 'results' ? 
            selectedDeliveries.map(d => <Marker key={d.id} position={[d.lat, d.lng]}><Popup>{d.address}</Popup></Marker>) :
            results.routes.map(route => (
              <React.Fragment key={route.vehicleId}>
                <Polyline positions={route.path} color={route.color} weight={selectedRouteId === route.vehicleId ? 8 : 5} opacity={selectedRouteId === route.vehicleId ? 1 : 0.7} />
                {route.stops.map((stop, index) => <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={createNumberedMarkerIcon(index + 1)}><Popup>{stop.address}</Popup></Marker>)}
              </React.Fragment>
            ))
          }
        </MapContainer>
        {optimizationStatus === 'loading' && <LoadingOverlay />}
      </main>
    </div>
  );
}

export default Otimizacao;