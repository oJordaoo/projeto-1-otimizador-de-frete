import React, { useState } from 'react';
import { FaUser, FaUsers, FaCreditCard, FaBuilding, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Configuracoes.css';

// --- Sub-componentes para cada aba ---

const PerfilContent = () => (
  <div className="settings-content-card">
    <h3>Meu Perfil</h3>
    <p>Atualize suas informações pessoais e de segurança.</p>
    <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group"><label>Nome</label><input type="text" defaultValue="Carlos Silva" /></div>
      <div className="form-group"><label>Email</label><input type="email" defaultValue="carlos.silva@empresa.com" /></div>
      <button type="submit" className="btn-primary" onClick={() => toast.success('Perfil atualizado!')}>Salvar Alterações</button>
      <h4 className="form-section-title">Alterar Senha</h4>
      <div className="form-group"><label>Senha Atual</label><input type="password" placeholder="••••••••" /></div>
      <div className="form-group"><label>Nova Senha</label><input type="password" /></div>
      <button type="submit" className="btn-primary" onClick={() => toast.success('Senha alterada com sucesso!')}>Alterar Senha</button>
    </form>
  </div>
);

const EquipeContent = () => (
  <div className="settings-content-card">
    <h3>Organização e Equipe</h3>
    <p>Gerencie os membros da sua equipe e as informações da empresa.</p>
    <table className="team-table">
      <thead><tr><th>Nome</th><th>Email</th><th>Função</th></tr></thead>
      <tbody>
        <tr><td>Carlos Silva</td><td>carlos.silva@empresa.com</td><td><span className="role-badge admin">Admin</span></td></tr>
        <tr><td>Ana Pereira</td><td>ana.pereira@empresa.com</td><td><span className="role-badge member">Membro</span></td></tr>
      </tbody>
    </table>
    <button className="btn-secondary" style={{marginTop: '20px'}} onClick={() => toast.success('Funcionalidade de convite em breve!')}>Convidar Membro</button>
  </div>
);

const FaturamentoContent = () => (
  <div className="settings-content-card">
    <h3>Faturamento e Assinatura</h3>
    <p>Visualize seu plano, gerencie pagamentos e acesse suas faturas.</p>
    
    <div className="billing-grid">
      <div className="billing-card current-plan">
        <h4>Seu Plano Atual</h4>
        <div className="plan-name">PRO</div>
        <div className="plan-price">R$ 499,00 <span>/mês</span></div>
        <p>Sua assinatura será renovada em <strong>01 de Outubro de 2025</strong>.</p>
        <button className="btn-secondary">Mudar de Plano</button>
      </div>
      <div className="billing-card payment-method">
        <h4>Forma de Pagamento</h4>
        <div className="card-info">
          <img src="https://i.imgur.com/gRUq211.png" alt="Visa" width="40" />
          <span>Cartão de Crédito final **** 1234</span>
        </div>
        <p>Para alterar seu método de pagamento, adicione um novo.</p>
        <button className="btn-secondary">Adicionar novo método</button>
      </div>
    </div>

    <h4 className="form-section-title">Histórico de Faturas</h4>
    <table className="team-table invoice-table">
      <thead><tr><th>Data</th><th>ID da Fatura</th><th>Valor</th><th>Status</th><th>Ação</th></tr></thead>
      <tbody>
        <tr><td>01/09/2025</td><td>inv_12345</td><td>R$ 499,00</td><td><span className="status-badge-pro status-pago">PAGO</span></td><td><button className="action-btn" title="Baixar fatura"><FaDownload /></button></td></tr>
        <tr><td>01/08/2025</td><td>inv_12344</td><td>R$ 499,00</td><td><span className="status-badge-pro status-pago">PAGO</span></td><td><button className="action-btn" title="Baixar fatura"><FaDownload /></button></td></tr>
        <tr><td>01/07/2025</td><td>inv_12343</td><td>R$ 499,00</td><td><span className="status-badge-pro status-pago">PAGO</span></td><td><button className="action-btn" title="Baixar fatura"><FaDownload /></button></td></tr>
      </tbody>
    </table>
  </div>
);


function Configuracoes() {
  const [activeTab, setActiveTab] = useState('faturamento'); // Inicia na aba de faturamento

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil': return <PerfilContent />;
      case 'equipe': return <EquipeContent />;
      case 'faturamento': return <FaturamentoContent />;
      default: return <PerfilContent />;
    }
  };

  return (
    <div className="page-container settings-page theme-light">
      <div className="page-header">
        <h1>Configurações</h1>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          <button className={activeTab === 'perfil' ? 'active' : ''} onClick={() => setActiveTab('perfil')}><FaUser /> Meu Perfil</button>
          <button className={activeTab === 'equipe' ? 'active' : ''} onClick={() => setActiveTab('equipe')}><FaUsers /> Equipe</button>
          <button className={activeTab === 'faturamento' ? 'active' : ''} onClick={() => setActiveTab('faturamento')}><FaCreditCard /> Faturamento</button>
        </nav>
        <div className="settings-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;