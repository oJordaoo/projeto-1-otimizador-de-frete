import React, { useState } from 'react'; // Note as chaves {} em useState
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAction } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await loginAction({ username, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">LogiRed</div>
        <h1 className="login-title">Acesse sua conta</h1>
        <p className="login-subtitle">
          Bem-vindo de volta! Por favor, insira seus dados.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário ou E-mail</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p
              style={{
                color: 'var(--logired-primary)',
                marginBottom: '15p',
              }}
            >
              {error}
            </p>
          )}

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Lembrar-me</label>
            </div>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>
          <button type="submit" className="btn-login-submit">
            Entrar
          </button>
        </form>

        <div className="signup-link">
          <p>
            Não tem uma conta? <Link to="/register">Crie uma agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;