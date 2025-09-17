import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaTruck, FaFilter, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FaVanShuttle } from 'react-icons/fa6';
import axiosInstance from '../api/axiosInstance';
import './Veiculos.css';

// --- Componente do Modal (Definido ANTES do componente principal) ---
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
    onSave({ ...veiculo, ...formData });
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{veiculo ? 'Editar Veículo' : 'Adicionar Veículo'}</h2>
          <button onClick={onClose} className="close-modal-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group"><label>Placa</label><input type="text" name="placa" value={formData.placa} onChange={handleChange} required /></div>
          <div className="form-grid">
            <div className="form-group"><label>Capacidade (kg)</label><input type="number" name="capacidade_kg" value={formData.capacidade_kg} onChange={handleChange} required /></div>
            <div className="form-group"><label>Capacidade (m³)</label><input type="number" name="capacidade_m3" value={formData.capacidade_m3} onChange={handleChange} required /></div>
          </div>
          <div className="modal-footer"><button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="btn-primary">Salvar</button></div>
        </form>
      </div>
    </div>
  );
}

// --- Componente Principal da Página ---
function Veiculos() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'placa', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const itemsPerPage = 10;

  const fetchData = async () => {
    if (!loading) setLoading(true);
    try {
      const response = await axiosInstance.get('/fleet/vehicles/');
      setAllData(response.data);
    } catch (error) {
      toast.error('Erro ao carregar a frota.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => {
    let data = [...allData];
    if (searchQuery) {
        data = data.filter(item =>
            item.placa.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });
    return data;
  }, [allData, searchQuery, sortConfig]);

  const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
      setSortConfig({ key, direction });
  };
  
  const kpiData = useMemo(() => ({
    total: allData.length,
    disponivel: allData.filter(v => v.status === 'Disponível').length || allData.length,
    emRota: allData.filter(v => v.status === 'Em Rota').length || 0,
    manutencao: allData.filter(v => v.status === 'Manutenção').length || 0,
  }), [allData]);

  const handleOpenModal = (veiculo) => { setEditingVeiculo(veiculo); setIsModalOpen(true); };
  
  const handleSave = async (veiculoData) => {
    const isEditing = !!(editingVeiculo && editingVeiculo.id);
    const toastId = toast.loading(isEditing ? 'Atualizando veículo...' : 'Adicionando veículo...');
    const endpoint = isEditing ? `/fleet/vehicles/${editingVeiculo.id}/` : '/fleet/vehicles/';
    const method = isEditing ? 'put' : 'post';

    try {
      await axiosInstance[method](endpoint, veiculoData);
      toast.success(`Veículo ${isEditing ? 'atualizado' : 'adicionado'}!`, { id: toastId });
      fetchData();
    } catch (error) {
      const errorMsg = error.response?.data?.placa?.[0] || 'Ocorreu um erro.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsModalOpen(false);
      setEditingVeiculo(null);
    }
  };
  
  const handleDelete = async (veiculoId) => {
    if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
      const toastId = toast.loading('Excluindo veículo...');
      try {
        await axiosInstance.delete(`/fleet/vehicles/${veiculoId}/`);
        toast.success("Veículo excluído!", { id: toastId });
        fetchData();
      } catch (error) {
        toast.error("Erro ao excluir.", { id: toastId });
      }
    }
  };

  return (
    <div className="page-container data-page-container theme-light">
      <div className="data-page-toolbar">
          <div className="toolbar-left"><h2>Gerenciamento de Frota</h2></div>
          <div className="toolbar-right">
              <div className="search-wrapper"><FaSearch /><input type="text" placeholder="Buscar por placa..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
              <button className="btn-secondary"><FaFilter /> Filtros</button>
              <button className="btn-primary" onClick={() => handleOpenModal(null)}><FaPlus/> Adicionar Veículo</button>
          </div>
      </div>

      <div className="kpi-grid">
          <div className="kpi-card"><span>{kpiData.total}</span><p>Veículos Totais</p></div>
          <div className="kpi-card"><span>{kpiData.disponivel}</span><p>Disponíveis</p></div>
          <div className="kpi-card"><span>{kpiData.emRota}</span><p>Em Rota</p></div>
          <div className="kpi-card"><span>{kpiData.manutencao}</span><p>Em Manutenção</p></div>
      </div>
      
      <div className="data-table-card">
        <div className="table-wrapper">
          {loading ? <p className="loading-text">Carregando frota...</p> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th onClick={() => requestSort('placa')}>Veículo {sortConfig.key === 'placa' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                  <th onClick={() => requestSort('capacidade_kg')}>Capacidade {sortConfig.key === 'capacidade_kg' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(veiculo => (
                  <tr key={veiculo.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="cell-vehicle-info">
                        <div className="vehicle-icon">{parseFloat(veiculo.capacidade_m3) > 20 ? <FaTruck /> : <FaVanShuttle />}</div>
                        <span>{veiculo.placa}</span>
                      </div>
                    </td>
                    <td>{parseFloat(veiculo.capacidade_kg)} kg / {parseFloat(veiculo.capacidade_m3)} m³</td>
                    <td className="cell-actions">
                      <button className="action-btn" onClick={() => handleOpenModal(veiculo)} title="Editar"><FaEdit /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(veiculo.id)} title="Excluir"><FaTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && (
          <div className="table-pagination">
              <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Próxima</button>
          </div>
        )}
      </div>
      {isModalOpen && ( <VeiculoModal veiculo={editingVeiculo} onClose={() => setIsModalOpen(false)} onSave={handleSave} /> )}
    </div>
  );
}

export default Veiculos;