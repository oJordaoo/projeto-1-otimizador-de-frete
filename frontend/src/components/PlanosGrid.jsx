import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Planos.css'; // Podemos reutilizar o mesmo CSS

const PlanosGrid = () => {
  return (
    <div className="planos-container">
      <div className="planos-header">
        <h1>Planos Flexíveis para sua Necessidade</h1>
        <p>Comece a organizar, otimizar e economizar hoje mesmo.</p>
      </div>
      <div className="planos-grid">
        {/* Plano Essencial */}
        <div className="plano-card">
          <div className="plano-card-header">
            <h3>Essencial</h3>
            <p className="plano-price">R$ 199<span className="plano-period">/mês</span></p>
          </div>
          <div className="plano-card-body">
            <p className="plano-description">Para quem busca controle e organização centralizada.</p>
            <ul className="plano-features">
              <li>✓ Gestão de Entregas</li>
              <li>✓ Repositório Digital de Documentos</li>
              <li>✓ Dashboard com KPIs Essenciais</li>
              <li>✓ Cadastro de 2 Transportadoras</li>
              <li>✓ Suporte via E-mail</li>
            </ul>
          </div>
          <div className="plano-card-footer">
            <Link to="/register" className="btn-plano">Começar Agora</Link>
          </div>
        </div>

        {/* Plano Pro */}
        <div className="plano-card popular">
          <div className="popular-tag">Mais Popular</div>
          <div className="plano-card-header">
            <h3>Pro</h3>
            <p className="plano-price">R$ 499<span className="plano-period">/mês</span></p>
          </div>
          <div className="plano-card-body">
            <p className="plano-description">Para otimizar rotas e reduzir custos de forma inteligente.</p>
            <ul className="plano-features">
              <li><strong>Tudo do Essencial, mais:</strong></li>
              <li>✓ Módulo de Roteirização Inteligente</li>
              <li>✓ Cotação com Transportadoras Ilimitadas</li>
              <li>✓ Relatórios de Performance Avançados</li>
              <li>✓ Até 10 Usuários</li>
              <li>✓ Suporte Prioritário</li>
            </ul>
          </div>
          <div className="plano-card-footer">
            <Link to="/register" className="btn-plano btn-popular">Começar Agora</Link>
          </div>
        </div>

        {/* Plano Enterprise */}
        <div className="plano-card">
          <div className="plano-card-header">
            <h3>Enterprise</h3>
            <p className="plano-price">Customizado</p>
          </div>
          <div className="plano-card-body">
            <p className="plano-description">Para grandes operações que precisam de automação total.</p>
            <ul className="plano-features">
              <li><strong>Tudo do Pro, mais:</strong></li>
              <li>✓ Auditoria de Fretes Automatizada</li>
              <li>✓ Rastreamento em Tempo Real</li>
              <li>✓ Permissões Customizadas por Usuário</li>
              <li>✓ Acesso via API</li>
              <li>✓ Gerente de Conta Dedicado</li>
            </ul>
          </div>
          <div className="plano-card-footer">
            <Link to="/contact" className="btn-plano">Fale Conosco</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosGrid;