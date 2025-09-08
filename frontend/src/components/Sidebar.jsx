import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaTachometerAlt, FaTruck, FaCar, FaMapMarkedAlt, 
  FaCalculator, FaChartPie, FaCog 
} from 'react-icons/fa';
import './Layout.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">LogiRed</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><NavLink to="/dashboard"><FaTachometerAlt /><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/entregas"><FaTruck /><span>Entregas</span></NavLink></li>
          <li><NavLink to="/veiculos"><FaCar /><span>Frota</span></NavLink></li>
          <li><NavLink to="/mapa"><FaMapMarkedAlt /><span>Mapa ao Vivo</span></NavLink></li>
          <li><NavLink to="/otimizacao"><FaCalculator /><span>Otimizador</span></NavLink></li>
          <li><NavLink to="/relatorios"><FaChartPie /><span>Relatórios</span></NavLink></li>
          <li><NavLink to="/configuracoes"><FaCog /><span>Configurações</span></NavLink></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;