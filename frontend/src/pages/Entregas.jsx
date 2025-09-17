import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaEye, FaFilter, FaArrowUp, FaArrowDown, FaLongArrowAltRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import './Entregas.css';

// --- Componente do Modal (Definido ANTES) ---
function EntregaModal({ entrega, onClose, onSave }) {
  const [formData, setFormData] = useState({
    endereco_origem: entrega?.endereco_origem || '', cidade_origem: entrega?.cidade_origem || '', estado_origem: entrega?.estado_origem || '', cep_origem: entrega?.cep_origem || '',
    endereco_destino: entrega?.endereco_destino || '', cidade_destino: entrega?.cidade_destino || '', estado_destino: entrega?.estado_destino || '', cep_destino: entrega?.cep_destino || '',
    peso_kg: entrega?.peso_kg || '', volume_m3: entrega?.volume_m3 || '',
  });

  const handleCepChange = async (e, type) => {
    const cep = e.target.value.replace(/\D/g, '');
    const formattedCep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    setFormData(prev => ({ ...prev, [`cep_${type}`]: formattedCep }));
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          setFormData(prev => ({ ...prev,
            [`endereco_${type}`]: response.data.logradouro,
            [`cidade_${type}`]: response.data.localidade,
            [`estado_${type}`]: response.data.uf,
          }));
        }
      } catch (error) { toast.error('Erro ao buscar CEP.'); }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...entrega, ...formData }); };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{entrega ? 'Editar Entrega' : 'Adicionar Nova Entrega'}</h2>
          <button onClick={onClose} className="close-modal-btn">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <h4 className="form-section-title">Origem</h4>
            <div className="form-group"><label>CEP de Partida</label><input type="text" name="cep_origem" value={formData.cep_origem} onChange={(e) => handleCepChange(e, 'origem')} maxLength="9" required /></div>
            <div className="form-group"><label>Endereço de Partida</label><input type="text" name="endereco_origem" value={formData.endereco_origem} onChange={handleChange} required /></div>
            <div className="form-grid">
              <div className="form-group"><label>Cidade</label><input type="text" name="cidade_origem" value={formData.cidade_origem} onChange={handleChange} required /></div>
              <div className="form-group"><label>Estado</label><input type="text" name="estado_origem" value={formData.estado_origem} onChange={handleChange} maxLength="2" required /></div>
            </div>

            <h4 className="form-section-title">Destino</h4>
            <div className="form-group"><label>CEP de Destino</label><input type="text" name="cep_destino" value={formData.cep_destino} onChange={(e) => handleCepChange(e, 'destino')} maxLength="9" required /></div>
            <div className="form-group"><label>Endereço de Destino</label><input type="text" name="endereco_destino" value={formData.endereco_destino} onChange={handleChange} required /></div>
            <div className="form-grid">
              <div className="form-group"><label>Cidade</label><input type="text" name="cidade_destino" value={formData.cidade_destino} onChange={handleChange} required /></div>
              <div className="form-group"><label>Estado</label><input type="text" name="estado_destino" value={formData.estado_destino} onChange={handleChange} maxLength="2" required /></div>
            </div>
            
            <h4 className="form-section-title">Carga</h4>
            <div className="form-grid">
              <div className="form-group"><label>Peso (kg)</label><input type="number" name="peso_kg" value={formData.peso_kg} onChange={handleChange} required /></div>
              <div className="form-group"><label>Volume (m³)</label><input type="number" name="volume_m3" value={formData.volume_m3} onChange={handleChange} required /></div>
            </div>
          </div>
          <div className="modal-footer"><button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button><button type="submit" className="btn-primary">Salvar Entrega</button></div>
        </form>
      </div>
    </div>
  );
}

// --- Componente Principal da Página ---
function Entregas() {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'criado_em', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntrega, setEditingEntrega] = useState(null);
  const itemsPerPage = 10;

  const fetchData = async () => { /* ... (código mantido como antes) ... */ };
  useEffect(() => { fetchData(); }, []);
  const filteredData = useMemo(() => { /* ... (código mantido como antes) ... */ }, [allData, searchQuery, sortConfig]);
  const paginatedData = useMemo(() => { /* ... (código mantido como antes) ... */ }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const requestSort = (key) => { /* ... (código mantido como antes) ... */ };
  const kpiData = useMemo(() => { /* ... (código mantido como antes) ... */ }, [allData]);
  const handleOpenModal = (entrega) => { setEditingEntrega(entrega); setIsModalOpen(true); };
  const handleSave = async (entregaData) => { /* ... (código mantido como antes) ... */ };
  const handleDelete = async (entregaId) => { /* ... (código mantido como antes) ... */ };

  return (
    <div className="page-container data-page-container theme-light">
      <div className="data-page-toolbar">
          <div className="toolbar-left"><h2>Gerenciamento de Entregas</h2></div>
          <div className="toolbar-right">
              <div className="search-wrapper"><FaSearch /><input type="text" placeholder="Buscar por ID ou cidade..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
              <button className="btn-secondary"><FaFilter /> Filtros</button>
              <button className="btn-primary" onClick={() => handleOpenModal(null)}><FaPlus/> Adicionar Entrega</button>
          </div>
      </div>
      <div className="kpi-grid">
          <div className="kpi-card"><span>{kpiData.total}</span><p>Total de Entregas</p></div>
          <div className="kpi-card"><span>{kpiData.pendente}</span><p>Pendentes</p></div>
          <div className="kpi-card"><span>{kpiData.emRota}</span><p>Em Rota</p></div>
          <div className="kpi-card"><span>{kpiData.entregue}</span><p>Concluídas</p></div>
      </div>
      <div className="data-table-card">
        <div className="table-wrapper">
          {loading ? <p className="loading-text">Carregando entregas...</p> : (
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th onClick={() => requestSort('status')}>Status</th>
                  <th onClick={() => requestSort('id')}>ID</th>
                  <th>Trajeto</th>
                  <th onClick={() => requestSort('veiculo_alocado')}>Veículo</th>
                  <th onClick={() => requestSort('criado_em')}>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(entrega => (
                  <tr key={entrega.id}>
                    <td><input type="checkbox" /></td>
                    <td><span className={`status-badge status-${entrega.status.toLowerCase()}`}>{entrega.status.replace('_', ' ')}</span></td>
                    <td>#{entrega.id.substring(0, 6).toUpperCase()}</td>
                    <td className="cell-trajeto">
                      <span>{`${entrega.cidade_origem}, ${entrega.estado_origem}`}</span>
                      <FaLongArrowAltRight />
                      <span>{`${entrega.cidade_destino}, ${entrega.estado_destino}`}</span>
                    </td>
                    <td>{entrega.veiculo_alocado || '---'}</td>
                    <td>{new Date(entrega.criado_em).toLocaleDateString('pt-BR')}</td>
                    <td className="cell-actions">
                      <button className="action-btn" title="Ver Detalhes" onClick={() => navigate(`/app/entregas/${entrega.id}`)}><FaEye /></button>
                      <button className="action-btn" title="Editar" onClick={() => handleOpenModal(entrega)}><FaEdit /></button>
                      <button className="action-btn delete" title="Excluir" onClick={() => handleDelete(entrega.id)}><FaTrashAlt /></button>
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
      {isModalOpen && ( <EntregaModal entrega={editingEntrega} onClose={() => setIsModalOpen(false)} onSave={handleSave} /> )}
    </div>
  );
}

export default Entregas;