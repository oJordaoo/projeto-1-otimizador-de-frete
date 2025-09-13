import React, { useState } from 'react';
import { FaUser, FaUsers, FaCreditCard, FaBuilding } from 'react-icons/fa';
import './Configuracoes.css';

function Configuracoes() {
  const [activeTab, setActiveTab] = useState('perfil'); // 'perfil', 'equipe', 'faturamento'

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className="settings-content">
            <h3>Meu Perfil</h3>
            <p>Atualize suas informações pessoais e senha.</p>
            <form className="settings-form">
              <div className="form-group"><label>Nome</label><input type="text" defaultValue="Gabriel Ortiz Jordão" /></div>
              <div className="form-group"><label>Email</label><input type="email" defaultValue="gabriel.jordao@logired.com" /></div>
              <button type="submit" className="btn-primary">Salvar Alterações</button>
              <h4 className="form-section-title">Alterar Senha</h4>
              <div className="form-group"><label>Senha Atual</label><input type="password" /></div>
              <div className="form-group"><label>Nova Senha</label><input type="password" /></div>
              <button type="submit" className="btn-primary">Alterar Senha</button>
            </form>
          </div>
        );
      case 'equipe':
        return (
          <div className="settings-content">
            <h3>Gerenciar Equipe</h3>
            <p>Convide e gerencie os membros da sua equipe.</p>
            {/* Aqui entraria uma tabela de usuários */}
            <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px'}}>Em breve...</p>
          </div>
        );
      case 'faturamento':
        return (
          <div className="settings-content">
            <h3>Faturamento e Assinatura</h3>
            <p>Visualize seu plano atual e histórico de pagamentos.</p>
            {/* Aqui entraria os detalhes do plano */}
            <p style={{textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px'}}>Em breve...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Configurações</h1>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          <button className={activeTab === 'perfil' ? 'active' : ''} onClick={() => setActiveTab('perfil')}>
            <FaUser /> Meu Perfil
          </button>
          <button className={activeTab === 'equipe' ? 'active' : ''} onClick={() => setActiveTab('equipe')}>
            <FaUsers /> Equipe
          </button>
          <button className={activeTab === 'faturamento' ? 'active' : ''} onClick={() => setActiveTab('faturamento')}>
            <FaCreditCard /> Faturamento
          </button>
        </nav>
        <div className="settings-content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;