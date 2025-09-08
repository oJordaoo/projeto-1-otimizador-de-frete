import React from 'react';
import { Link } from 'react-router-dom';
import './SimpleHeader.css';

function SimpleHeader() {
  return (
    <header className="simple-header">
      <div className="simple-header-content">
        <Link to="/" className="simple-header-logo">
          LogiRed
        </Link>
        <Link to="/login" className="simple-header-action">
          Acessar minha conta
        </Link>
      </div>
    </header>
  );
}

export default SimpleHeader;