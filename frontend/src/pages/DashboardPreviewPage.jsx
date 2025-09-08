import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa'; // Importa o ícone de flecha
import FakeDashboard from '../components/FakeDashboard';
import './DashboardPreviewPage.css';

const DashboardPreviewPage = () => {
  return (
    <div className="preview-page-container">
      <header className="preview-header">
        {/* O logo agora é um link para a página inicial */}
        <Link to="/" className="preview-logo-link">
          <FaChevronLeft className="back-arrow-icon" />
          <span>Voltar à Home</span>
        </Link>
        <div className="preview-actions">
          <Link to="/login" className="preview-btn-secondary">Já tenho conta</Link>
          <Link to="/register" className="preview-btn-primary">Criar Conta Grátis</Link>
        </div>
      </header>
      <main className="preview-dashboard-content">
        <FakeDashboard />
      </main>
    </div>
  );
};

export default DashboardPreviewPage;