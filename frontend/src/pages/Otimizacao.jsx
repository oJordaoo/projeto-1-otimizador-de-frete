import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// A CORREÇÃO ESTÁ NESTAS DUAS LINHAS ABAIXO
import { FaTruck, FaCheckSquare, FaSquare } from 'react-icons/fa';
import { FaVanShuttle } from 'react-icons/fa6';
import L from 'leaflet';
import './Otimizacao.css';

// --- DADOS FAKES PARA A SIMULAÇÃO ---
const entregasPendentesFake = [
  { id: 'e1', endereco: 'R. das Flores, 123', peso: 50, volume: 0.5, pos: [-25.42, -49.27] },
  { id: 'e2', endereco: 'Av. Brasil, 789', peso: 120, volume: 1.2, pos: [-25.45, -49.29] },
  { id: 'e3', endereco: 'Al. dos Anjos, 456', peso: 25, volume: 0.2, pos: [-25.43, -49.24] },
  { id: 'e4', endereco: 'R. XV de Novembro, 1000', peso: 80, volume: 0.8, pos: [-25.41, -49.26] },
  { id: 'e5', endereco: 'Av. das Torres, 2020', peso: 200, volume: 2.0, pos: [-25.47, -49.21] },
];
const frotaDisponivelFake = [
  { id: 'v1', tipo: 'caminhao', placa: 'ABC-1234', capacidade_kg: 1000 },
  { id: 'v2', tipo: 'van', placa: 'VAN-007', capacidade_kg: 500 },
];
const resultadoOtimizacaoFake = {
  resumo: { rotas: 2, distancia_total: 127, tempo_estimado: "4h 35min", economia: "18%" },
  rotas: [
    { veiculo_id: 'v1', placa: 'ABC-1234', entregas: ['e4', 'e1'], path: [[-25.41, -49.26], [-25.42, -49.27]], cor: '#D32F2F' },
    { veiculo_id: 'v2', placa: 'VAN-007', entregas: ['e3', 'e2', 'e5'], path: [[-25.43, -49.24], [-25.45, -49.29], [-25.47, -49.21]], cor: '#2196F3' }
  ]
};

const createNumberedIcon = (number) => {
    return L.divIcon({
        html: `<div class="numbered-marker">${number}</div>`,
        className: 'numbered-marker-container',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

function Otimizacao() {
  const [selectedEntregas, setSelectedEntregas] = useState(new Set());
  const [selectedVeiculos, setSelectedVeiculos] = useState(new Set());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);

  const handleToggleEntrega = (id) => {
    const newSelection = new Set(selectedEntregas);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedEntregas(newSelection);
  };
  
  const handleToggleVeiculo = (id) => {
    const newSelection = new Set(selectedVeiculos);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedVeiculos(newSelection);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setResult(null);
    setTimeout(() => {
      setResult(resultadoOtimizacaoFake);
      setIsOptimizing(false);
    }, 2000);
  };

  return (
    <div className="optimizer-page">
      <div className="optimizer-column">
        <div className="column-header">
          <h3>1. Selecione as Entregas Pendentes</h3>
          <span>({selectedEntregas.size} selecionadas)</span>
        </div>
        <ul className="selection-list">
          {entregasPendentesFake.map(entrega => (
            <li key={entrega.id} onClick={() => handleToggleEntrega(entrega.id)}>
              <div className="checkbox">{selectedEntregas.has(entrega.id) ? <FaCheckSquare /> : <FaSquare />}</div>
              <div className="item-info">
                <span className="item-title">{entrega.endereco}</span>
                <span className="item-subtitle">{entrega.peso} kg / {entrega.volume} m³</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="optimizer-column">
        <div className="column-header">
          <h3>2. Selecione a Frota</h3>
          <span>({selectedVeiculos.size} selecionados)</span>
        </div>
        <ul className="selection-list">
          {frotaDisponivelFake.map(veiculo => (
            <li key={veiculo.id} onClick={() => handleToggleVeiculo(veiculo.id)}>
              <div className="checkbox">{selectedVeiculos.has(veiculo.id) ? <FaCheckSquare /> : <FaSquare />}</div>
              <div className="item-info">
                <span className="item-title">{veiculo.placa}</span>
                <span className="item-subtitle">{veiculo.capacidade_kg} kg</span>
              </div>
              {veiculo.tipo === 'caminhao' ? <FaTruck className="vehicle-type-icon"/> : <FaVanShuttle className="vehicle-type-icon"/>}
            </li>
          ))}
        </ul>
        <div className="column-header">
            <h3>3. Defina o Objetivo</h3>
        </div>
        <div className="optimization-goal">
            <label><input type="radio" name="goal" defaultChecked/> Menor Distância</label>
            <label><input type="radio" name="goal"/> Menor Tempo</label>
        </div>
        <button className="optimize-button" onClick={handleOptimize} disabled={isOptimizing}>
          {isOptimizing ? 'Otimizando...' : 'Otimizar Rotas'}
        </button>
      </div>

      <div className="optimizer-column result-column">
        <div className="column-header">
          <h3>4. Resultado da Otimização</h3>
        </div>
        {isOptimizing && <div className="loading-spinner">Calculando a melhor rota...</div>}
        {result && (
          <div className="result-content">
            <div className="result-summary">
                <div className="summary-item"><span>{result.resumo.rotas}</span> Rotas Geradas</div>
                <div className="summary-item"><span>{result.resumo.distancia_total} km</span> Distância Total</div>
                <div className="summary-item"><span>{result.resumo.economia}</span> Economia Estimada</div>
            </div>
            <div className="result-map">
                <MapContainer center={[-25.43, -49.25]} zoom={12} scrollWheelZoom={false} className="optimizer-map-container">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"/>
                    {result.rotas.map(rota => (
                        <Polyline key={rota.veiculo_id} pathOptions={{color: rota.cor, weight: 4}} positions={rota.path} />
                    ))}
                     {result.rotas.flatMap(rota => 
                        rota.path.map((pos, index) => (
                            <Marker key={`${rota.veiculo_id}-${index}`} position={pos} icon={createNumberedIcon(index + 1)}>
                                <Popup>Rota: {rota.placa}<br/>Parada #{index + 1}</Popup>
                            </Marker>
                        ))
                     )}
                </MapContainer>
            </div>
            <ul className="route-details-list">
                {result.rotas.map(rota => (
                    <li key={rota.veiculo_id} style={{ borderLeftColor: rota.cor }}>
                        <strong>Veículo: {rota.placa}</strong>
                        <span>Sequência: {rota.entregas.join(' → ')}</span>
                    </li>
                ))}
            </ul>
            <button className="dispatch-button">Salvar e Despachar Rotas</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Otimizacao;