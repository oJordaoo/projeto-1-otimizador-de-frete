import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Layout.css';

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Futuramente podemos adicionar um campo de busca ou título da página aqui */}
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle Dark Mode">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          {/* Futuramente podemos adicionar um menu de usuário aqui */}
        </div>
      </div>
    </header>
  );
}

export default Header;