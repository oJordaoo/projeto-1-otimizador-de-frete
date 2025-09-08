import React from 'react';
import { Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import './LoginPage.css'; // Reutilizaremos o estilo da página de login

function RegisterPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Por enquanto, apenas mostraremos no console. Futuramente, chamará a API.
    console.log('Formulário de registro enviado!');
    alert('Funcionalidade de registro a ser implementada!');
  };

  return (
    <>
      <SimpleHeader />
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">LogiRed</div>
          <h1 className="login-title">Crie sua Conta</h1>
          <p className="login-subtitle">Comece sua otimização em poucos passos.</p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <input type="text" id="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" required />
            </div>
            
            <button type="submit" className="btn-login-submit">Criar Conta</button>
          </form>
          
          <div className="signup-link">
            <p>Já tem uma conta? <Link to="/login">Faça o login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;