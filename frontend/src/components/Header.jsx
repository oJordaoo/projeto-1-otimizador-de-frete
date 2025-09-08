import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const tickerMessages = [
  { type: 'alert', text: "Alerta: VAN-007 com desvio de rota em 5km!", icon: <FaExclamationTriangle /> },
  { type: 'warning', text: "Entrega #1024 (ABC-1234) - Previsão: HOJE 14:30 - Atraso: 15min", icon: <FaExclamationTriangle /> },
  { type: 'info', text: "Novo Pedido de Entrega #1027 adicionado - Prioridade Alta", icon: <FaInfoCircle /> },
  { type: 'success', text: "Motorista Ana Souza completou entrega #1023", icon: <FaCheckCircle /> },
];

function Header() {
  const { logoutAction } = useAuth();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % tickerMessages.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(tickerInterval);
  }, []);

  const currentMessage = tickerMessages[currentMessageIndex];

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="ticker-container">
          {/* A 'key' é crucial para o React recriar o elemento e a animação funcionar */}
          <div key={currentMessageIndex} className={`ticker-message ${currentMessage.type}`}>
            <span className="ticker-icon">{currentMessage.icon}</span>
            <span>{currentMessage.text}</span>
          </div>
        </div>
      </div>
      <div className="header-right">
        <button className="user-menu-btn">
          <FaUserCircle className="user-icon" />
          <span>Usuário</span>
        </button>
        <button onClick={logoutAction} className="user-menu-btn" title="Sair">
          <FaSignOutAlt className="user-icon" />
        </button>
      </div>
    </header>
  );
}

export default Header;
