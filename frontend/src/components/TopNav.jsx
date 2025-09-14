import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, FaTruck, FaCar, FaMapMarkedAlt, 
  FaCalculator, FaChartPie, FaCog, FaUserCircle, FaSignOutAlt,
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const tickerData = [
    { type: 'success', text: "Entrega #1021 Concluída", icon: <FaCheckCircle />, details: "Destino: Centro Cívico. Veículo: VAN-001." },
    { type: 'info', text: "Entrega #1022 Em Rota", icon: <FaTruck />, details: "Veículo: CAM-003. Próxima parada: 14:30." },
    { type: 'warning', text: "Entrega #1023 Atraso Potencial", icon: <FaExclamationTriangle />, details: "Veículo: VAN-002. Trânsito intenso na região." },
    { type: 'alert', text: "Entrega #1024 Cancelada", icon: <FaExclamationTriangle />, details: "Cancelada pelo cliente às 11:00." },
    { type: 'info', text: "Entrega #1025 Nova Rota", icon: <FaInfoCircle />, details: "Veículo: CAM-001. Rota otimizada." },
];

function TopNav() {
  const { logoutAction } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <nav className="top-nav">
      <div className="top-nav-logo">VEXA</div>
      <div className="top-nav-links">
        <NavLink to="/app/dashboard"><FaTachometerAlt /><span>Dashboard</span></NavLink>
        <NavLink to="/app/entregas"><FaTruck /><span>Entregas</span></NavLink>
        <NavLink to="/app/veiculos"><FaCar /><span>Frota</span></NavLink>
        <NavLink to="/app/mapa"><FaMapMarkedAlt /><span>Mapa</span></NavLink>
        <NavLink to="/app/otimizacao"><FaCalculator /><span>Otimizador</span></NavLink>
        <NavLink to="/app/relatorios"><FaChartPie /><span>Relatórios</span></NavLink>
      </div>

      <div className="header-ticker-interactive">
        <div className="ticker-track">
          {[...tickerData, ...tickerData].map((item, index) => (
            <div key={index} className={`ticker-item-interactive ${item.type}`}>
              <span className="ticker-icon">{item.icon}</span>
              <span className="ticker-text-short">{item.text}</span>
              <div className="ticker-tooltip">
                <p><strong>Detalhes:</strong></p>
                <p>{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="top-nav-actions">
        <div className="user-menu-container" ref={menuRef}>
          <button className="user-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaUserCircle className="user-icon" />
            <span>Usuário</span>
          </button>
          {isMenuOpen && (
            <div className="user-dropdown">
              <Link to="/app/configuracoes" className="dropdown-item" onClick={() => setIsMenuOpen(false)}><FaCog /><span>Configurações</span></Link>
              <button onClick={() => { logoutAction(); setIsMenuOpen(false); }} className="dropdown-item"><FaSignOutAlt /><span>Sair</span></button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNav;