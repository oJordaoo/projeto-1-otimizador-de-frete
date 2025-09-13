import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './StatusBar.css'; // Estilos para a barra de status

const tickerMessages = [
  { type: 'alert', text: "Alerta: VAN-007 com desvio de rota!", icon: <FaExclamationTriangle /> },
  { type: 'warning', text: "Entrega #1024 - Atraso de 15min", icon: <FaExclamationTriangle /> },
  { type: 'info', text: "Novo Pedido de Entrega #1027", icon: <FaInfoCircle /> },
  { type: 'success', text: "Entrega #1023 Concluída", icon: <FaCheckCircle /> },
];

function StatusBar() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % tickerMessages.length);
    }, 5000); // Troca a cada 5 segundos
    return () => clearInterval(tickerInterval);
  }, []);

  const currentMessage = tickerMessages[currentMessageIndex];

  return (
    <div className="status-bar">
      <div className={`ticker-message ${currentMessage.type}`}>
        <span className="ticker-icon">{currentMessage.icon}</span>
        <span>{currentMessage.text}</span>
      </div>
    </div>
  );
}

export default StatusBar;