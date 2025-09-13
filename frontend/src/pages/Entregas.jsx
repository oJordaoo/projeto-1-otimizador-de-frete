import React, { useState, useEffect, useMemo } from 'react';
import axiosInstance from '../api/axiosInstance';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaEye, FaFilter } from 'react-icons/fa';
import './Entregas.css';

// DADOS FAKES RICOS PARA A PÁGINA
const fakeEntregasData = Array.from({ length: 50 }).map((_, i) => ({
  id: `f38682b${i}`,
  status: ['PENDENTE', 'EM_ROTA', 'ENTREGUE', 'FALHOU'][i % 4],
  veiculo_alocado: i % 3 === 0 ? `ABC-123${i}` : null,
  endereco_destino: `Rua das Flores, ${i + 1}`,
  cidade_destino: 'Curitiba',
  cliente: `Cliente ${String.fromCharCode(65 + (i % 26))}`,
  previsao_entrega: `2025-09-${12 + (i % 5)}T14:30:00Z`
}));


function Entregas() {
  const [entregas, setEntregas] = useState(fakeEntregasData); // Usando dados fake por enquanto
  const [loading, setLoading] = useState(false); // Simulação, não há carregamento real
  const [error, setError] = useState(null);
  const [selectedEntregas, setSelectedEntregas] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectOne = (id) => {
    const newSelection = new Set(selectedEntregas);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedEntregas(newSelection);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEntregas(new Set(entregas.map(item => item.id)));
    } else {
      setSelectedEntregas(new Set());
    }
  };

  const kpis = useMemo(() => ({
    total: entregas.length,
    pendentes: entregas.filter(e => e.status === 'PENDENTE').length,
    emRota: entregas.filter(e => e.status === 'EM_ROTA').length,
    entregue: entregas.filter(e => e.status === 'ENTREGUE').length,
  }), [entregas]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestão de Entregas</h1>
      </div>
      
      <div className="kpi-row-entregas">
        <div className="kpi-card-entregas"><span>{kpis.total}</span> Total</div>
        <div className="kpi-card-entregas"><span>{kpis.pendentes}</span> Pendentes</div>
        <div className="kpi-card-entregas"><span>{kpis.emRota}</span> Em Rota</div>
        <div className="kpi-card-entregas"><span>{kpis.entregue}</span> Concluídas</div>
      </div>

      <div className="content-card">
        <div className="table-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Pesquisar por ID, cliente, placa..." />
          </div>
          <button className="filter-button"><FaFilter /> Filtros</button>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <FaPlus />
            Adicionar Entrega
          </button>
        </div>

        {selectedEntregas.size > 0 && (
          <div className="bulk-actions-bar">
            <span>{selectedEntregas.size} selecionadas</span>
            <button className="bulk-action-btn">Alocar Veículo</button>
            <button className="bulk-action-btn">Alterar Status</button>
          </div>
        )}

        <div className="table-container">
          <table className="data-table-pro">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} /></th>
                <th>Status</th>
                <th>ID da Entrega</th>
                <th>Cliente</th>
                <th>Destino</th>
                <th>Veículo</th>
                <th>Previsão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map(entrega => (
                <tr key={entrega.id} className={selectedEntregas.has(entrega.id) ? 'selected' : ''}>
                  <td><input type="checkbox" checked={selectedEntregas.has(entrega.id)} onChange={() => handleSelectOne(entrega.id)} /></td>
                  <td><span className={`status-badge status-${entrega.status.toLowerCase()}`}>{entrega.status}</span></td>
                  <td>#{entrega.id.substring(0, 6)}...</td>
                  <td>{entrega.cliente}</td>
                  <td>{`${entrega.endereco_destino}, ${entrega.cidade_destino}`}</td>
                  <td>{entrega.veiculo_alocado || '---'}</td>
                  <td>{new Date(entrega.previsao_entrega).toLocaleDateString('pt-BR')}</td>
                  <td className="actions-cell">
                    <button className="action-btn" title="Ver Detalhes"><FaEye /></button>
                    <button className="action-btn" title="Editar"><FaEdit /></button>
                    <button className="action-btn delete-btn" title="Excluir"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* O Modal de criação/edição seria chamado aqui */}
    </div>
  );
}

export default Entregas;