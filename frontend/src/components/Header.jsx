import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './Layout.css';

const tickerData = [
    { type: 'success', text: "Entrega #1021 Concluída", icon: <FaCheckCircle />, link: '/app/entregas' },
    { type: 'info', text: "Entrega #1022 Em Rota", icon: <FaInfoCircle />, link: '/app/entregas' },
    { type: 'warning', text: "Entrega #1023 Atraso Potencial", icon: <FaExclamationTriangle />, link: '/app/entregas' },
    { type: 'alert', text: "Alerta Crítico: VAN-007 com desvio de rota!", icon: <FaExclamationTriangle />, link: '/app/mapa' },
];

const Ticker = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items]);
  return (
    <div className="status-ticker-viewport">
      <div className="status-ticker-list" style={{ transform: `translateY(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <Link to={item.link} className="status-ticker-item-link" key={index}>
            <div className={`status-ticker-item ${item.type}`}>
                <span className="ticker-icon">{item.icon}</span>
                <span>{item.text}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

function Header() {
  return (
    <header className="app-status-header">
      <Ticker items={tickerData} />
    </header>
  );
}

export default Header;