import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaBox, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import './EntregaDetalhes.css'; // Criaremos este arquivo a seguir

function EntregaDetalhes() {
  const { entregaId } = useParams();
  const [entrega, setEntrega] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntrega = async () => {
      try {
        const response = await axiosInstance.get(`/logistics/deliveries/${entregaId}/`);
        setEntrega(response.data);
      } catch (error) {
        toast.error('Não foi possível carregar os detalhes da entrega.');
      } finally {
        setLoading(false);
      }
    };
    fetchEntrega();
  }, [entregaId]);

  if (loading) {
    return <div className="page-container theme-light" style={{padding: '20px'}}>Carregando detalhes...</div>;
  }

  if (!entrega) {
    return <div className="page-container theme-light" style={{padding: '20px'}}>Entrega não encontrada.</div>;
  }
  
  // Coordenadas fake para a rota, já que não temos no backend ainda
  const positionOrigem = [-25.4284, -49.2733];
  const positionDestino = [-23.5505, -46.6333];

  return (
    <div className="page-container entrega-detalhes-page theme-light">
      <div className="detalhes-header">
        <Link to="/app/entregas" className="back-link"><FaArrowLeft /> Voltar para Entregas</Link>
        <h1>Detalhes da Entrega #{entrega.id.substring(0, 6).toUpperCase()}</h1>
        <span className={`status-badge-pro status-${entrega.status.toLowerCase()}`}>{entrega.status.replace('_', ' ')}</span>
      </div>
      
      <div className="detalhes-grid">
        <div className="detalhes-map-card">
          <MapContainer center={positionOrigem} zoom={5} className="details-map-container">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            <Marker position={positionOrigem}><Popup>Origem: {entrega.cidade_origem}</Popup></Marker>
            <Marker position={positionDestino}><Popup>Destino: {entrega.cidade_destino}</Popup></Marker>
            <Polyline positions={[positionOrigem, positionDestino]} color="var(--vexa-primary)" />
          </MapContainer>
        </div>
        
        <div className="info-grid">
          <div className="info-card">
            <h4><FaMapMarkerAlt /> Origem</h4>
            <p>{entrega.endereco_origem}</p>
            <p>{`${entrega.cidade_origem}, ${entrega.estado_origem} - CEP: ${entrega.cep_origem}`}</p>
          </div>
          <div className="info-card">
            <h4><FaMapMarkerAlt /> Destino</h4>
            <p>{entrega.endereco_destino}</p>
            <p>{`${entrega.cidade_destino}, ${entrega.estado_destino} - CEP: ${entrega.cep_destino}`}</p>
          </div>
          <div className="info-card">
            <h4><FaBox /> Carga</h4>
            <p><strong>Peso:</strong> {parseFloat(entrega.peso_kg)} kg</p>
            <p><strong>Volume:</strong> {parseFloat(entrega.volume_m3)} m³</p>
          </div>
          <div className="info-card">
            <h4><FaTruck /> Veículo</h4>
            <p>{entrega.veiculo_alocado || "Ainda não alocado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntregaDetalhes;