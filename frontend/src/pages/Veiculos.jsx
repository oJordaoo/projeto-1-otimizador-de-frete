import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaTruck, FaFilter } from 'react-icons/fa';
import { FaVanShuttle } from 'react-icons/fa6';
import './Veiculos.css';

// --- DADOS FAKES DE ALTA QUALIDADE PARA A PÁGINA DE FROTA ---
const veiculosFakeData = Array.from({ length: 15 }).map((_, i) => {
    const isTruck = i % 3 !== 0;
    return {
        id: `v${i+1}`,
        placa: `${['ABC','FRT','VEX'][i%3]}-${1000+i}`,
        tipo: isTruck ? 'Caminhão' : 'Van',
        capacidade_kg: `${isTruck ? 5000 + (i*100) : 1200 + (i*50)}.00`,
        capacidade_m3: `${isTruck ? 30 + i : 8 + i}.00`,
        motorista: `Motorista ${String.fromCharCode(65 + i)}`,
        status: ['Disponível', 'Em Rota', 'Manutenção'][i % 3],
        criado_em: new Date(2025, 8, i+1).toISOString(),
    }
});

// --- Componente do Modal ---
function VeiculoModal({ veiculo, onClose, onSave }) {
  const [formData, setFormData] = useState({
    placa: veiculo?.placa || '',
    capacidade_kg: veiculo?.capacidade_kg || '',
    capacidade_m3: veiculo?.capacidade_m3 || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{veiculo ? 'Editar Veículo' : 'Adicionar Novo Veículo'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Placa</label>
            <input name="placa" value={formData.placa} onChange={handleChange} required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Capacidade (kg)</label>
              <input name="capacidade_kg" type="number" value={formData.capacidade_kg} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Volume (m³)</label>
              <input name="capacidade_m3" type="number" value={formData.capacidade_m3} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Componente Principal da Página ---
function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVeiculos(veiculosFakeData);
      setLoading(false);
    }, 500); // Simula 0.5 segundo de carregamento
  }, []);

  const handleSave = (formData) => {
    const toastId = toast.loading('Salvando...');
    setTimeout(() => {
        if(editingVeiculo) {
            setVeiculos(prev => prev.map(v => v.id === editingVeiculo.id ? {...v, ...formData} : v));
            toast.success('Veículo atualizado!', { id: toastId });
        } else {
            const newVeiculo = { id: `v_new_${Date.now()}`, ...formData, criado_em: new Date().toISOString(), motorista: 'Não Atribuído', status: 'Disponível', tipo: parseFloat(formData.capacidade_kg) > 2000 ? 'Caminhão' : 'Van' };
            setVeiculos(prev => [newVeiculo, ...prev]);
            toast.success('Veículo adicionado!', { id: toastId });
        }
        setIsModalOpen(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza?')) {
        const toastId = toast.loading('Excluindo...');
        setTimeout(() => {
            setVeiculos(prev => prev.filter(v => v.id !== id));
            toast.success('Veículo excluído!', { id: toastId });
        }, 1000);
    }
  };

  const handleOpenModal = (veiculo = null) => {
    setEditingVeiculo(veiculo);
    setIsModalOpen(true);
  };
  
  const filteredVeiculos = useMemo(() => {
    if (!Array.isArray(veiculos)) return [];
    return veiculos.filter(v => 
      (v.placa && v.placa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.motorista && v.motorista.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [veiculos, searchTerm]);

  const kpis = useMemo(() => ({
    total: veiculos.length,
    disponiveis: veiculos.filter(v => v.status === 'Disponível').length,
    emRota: veiculos.filter(v => v.status === 'Em Rota').length,
    manutencao: veiculos.filter(v => v.status === 'Manutenção').length,
  }), [veiculos]);


  if (loading) return <div>Carregando frota...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestão de Frota</h1>
      </div>
      
      <div className="kpi-row-veiculos">
        <div className="kpi-card-veiculos"><span>{kpis.total}</span> Total de Veículos</div>
        <div className="kpi-card-veiculos"><span>{kpis.disponiveis}</span> Disponíveis</div>
        <div className="kpi-card-veiculos"><span>{kpis.emRota}</span> Em Rota</div>
        <div className="kpi-card-veiculos"><span>{kpis.manutencao}</span> Em Manutenção</div>
      </div>

      <div className="content-card">
        <div className="table-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Pesquisar por placa ou motorista..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-button"><FaFilter /> Filtros</button>
          <button className="add-button" onClick={() => handleOpenModal()}>
            <FaPlus />
            Adicionar Veículo
          </button>
        </div>

        <div className="table-container">
          <table className="data-table-pro">
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>Veículo (Placa)</th>
                <th>Motorista</th>
                <th>Capacidade</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVeiculos.map(veiculo => (
                <tr key={veiculo.id}>
                  <td><input type="checkbox" /></td>
                  <td>
                    <div className="vehicle-cell">
                      <div className="vehicle-icon-wrapper">
                        {veiculo.tipo === 'Caminhão' ? <FaTruck /> : <FaVanShuttle />}
                      </div>
                      <span className="vehicle-plate">{veiculo.placa}</span>
                    </div>
                  </td>
                  <td>{veiculo.motorista}</td>
                  <td>{veiculo.capacidade_kg} kg / {veiculo.capacidade_m3} m³</td>
                  <td><span className={`status-badge status-${veiculo.status.toLowerCase()}`}>{veiculo.status}</span></td>
                  <td className="actions-cell">
                    <button className="action-btn" onClick={() => handleOpenModal(veiculo)} title="Editar"><FaEdit /></button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(veiculo.id)} title="Excluir"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <VeiculoModal 
          veiculo={editingVeiculo}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Veiculos;