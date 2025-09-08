import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import './Entregas.css';

function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntrega, setEditingEntrega] = useState(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await axiosInstance.get('entregas/');
        setEntregas(response.data);
      } catch (err) {
        setError('Falha ao buscar os dados das entregas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntregas();
  }, []);

  const handleOpenModal = (entrega = null) => {
    setEditingEntrega(entrega);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntrega(null);
  };

  const handleSaveEntrega = (formData) => {
    console.log('Salvando entrega:', formData);
    alert('Funcionalidade de salvar a ser conectada ao backend!');
    handleCloseModal();
  };
  
  const handleDeleteEntrega = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta entrega?')) {
      console.log('Excluindo entrega:', id);
      alert('Funcionalidade de excluir a ser conectada ao backend!');
    }
  };


  if (loading) return <div>Carregando entregas...</div>;
  if (error) return <div style={{ color: 'var(--logired-primary)' }}>{error}</div>;

  return (
    <div className="entregas-page">
      <div className="page-header">
        <h1>Gestão de Entregas</h1>
        <button className="add-button" onClick={() => handleOpenModal()}>
          <FaPlus />
          Adicionar Entrega
        </button>
      </div>

      <div className="content-card">
        <div className="table-controls">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Pesquisar por ID, placa, cliente..." />
          </div>
        </div>

        <div className="table-container">
          <table className="entregas-table">
            <thead>
              <tr>
                <th>ID da Entrega</th>
                <th>Status</th>
                <th>Veículo Alocado</th>
                <th>Destino</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map(entrega => (
                <tr key={entrega.id}>
                  <td>{entrega.id.substring(0, 8)}...</td>
                  <td><span className={`status-badge status-${entrega.status.toLowerCase()}`}>{entrega.status}</span></td>
                  <td>{entrega.veiculo_alocado || 'N/A'}</td>
                  <td>{`${entrega.endereco_destino}, ${entrega.cidade_destino}`}</td>
                  <td className="actions-cell">
                    <button className="action-btn view-btn" title="Ver Detalhes"><FaEye /></button>
                    <button className="action-btn edit-btn" onClick={() => handleOpenModal(entrega)} title="Editar"><FaEdit /></button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteEntrega(entrega.id)} title="Excluir"><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EntregaModal
          entrega={editingEntrega}
          onClose={handleCloseModal}
          onSave={handleSaveEntrega}
        />
      )}
    </div>
  );
}

// --- Componente do Modal ---
function EntregaModal({ entrega, onClose, onSave }) {
  const [formData, setFormData] = useState({
    cep_destino: entrega?.cep_destino || '',
    endereco_destino: entrega?.endereco_destino || '',
    cidade_destino: entrega?.cidade_destino || '',
    estado_destino: entrega?.estado_destino || '',
    peso_kg: entrega?.peso_kg || '',
    volume_m3: entrega?.volume_m3 || '',
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
        <h2>{entrega ? 'Editar Entrega' : 'Adicionar Nova Entrega'}</h2>
        <form onSubmit={handleSubmit}>
          <h4>Destino</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>CEP</label>
              <input name="cep_destino" value={formData.cep_destino} onChange={handleChange} placeholder="80000-000" />
            </div>
            <div className="form-group">
              <label>Endereço (Rua e Número)</label>
              <input name="endereco_destino" value={formData.endereco_destino} onChange={handleChange} placeholder="Av. Exemplo, 123" />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input name="cidade_destino" value={formData.cidade_destino} onChange={handleChange} placeholder="Curitiba" />
            </div>
            <div className="form-group">
              <label>Estado (UF)</label>
              <input name="estado_destino" value={formData.estado_destino} onChange={handleChange} placeholder="PR" maxLength="2" />
            </div>
          </div>
          <h4>Carga</h4>
           <div className="form-grid">
            <div className="form-group">
              <label>Peso (kg)</label>
              <input name="peso_kg" type="number" value={formData.peso_kg} onChange={handleChange} placeholder="123.00" />
            </div>
            <div className="form-group">
              <label>Volume (m³)</label>
              <input name="volume_m3" type="number" value={formData.volume_m3} onChange={handleChange} placeholder="1.5" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Entregas;