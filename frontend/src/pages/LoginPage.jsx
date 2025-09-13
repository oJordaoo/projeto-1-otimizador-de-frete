import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import SimpleHeader from '../components/SimpleHeader';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginAction } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Autenticando...');
    try {
      await loginAction({ username, password });
      toast.dismiss(loadingToast);
      toast.success('Login bem-sucedido!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Usuário ou senha inválidos.');
    }
  };

  return (
    <>
      <SimpleHeader />
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">VEXA</div>
          <h1 className="login-title">Acesse sua conta</h1>
          <p className="login-subtitle">Bem-vindo de volta! Por favor, insira seus dados.</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuário ou E-mail</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Lembrar-me</label>
              </div>
              <a href="#" className="forgot-password">Esqueceu a senha?</a>
            </div>
            <button type="submit" className="btn-login-submit">Entrar</button>
          </form>
          <div className="signup-link">
            <p>Não tem uma conta? <Link to="/register">Crie uma agora</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;