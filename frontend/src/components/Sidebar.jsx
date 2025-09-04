import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaTruck, FaCar } from 'react-icons/fa';
import './Layout.css'; // Usaremos um CSS compartilhado

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">LogiRed</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end>
              <FaTachometerAlt />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/entregas">
              <FaTruck />
              <span>Entregas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/veiculos">
              <FaCar />
              <span>Frota</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;