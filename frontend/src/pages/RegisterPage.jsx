import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import axios from 'axios';
import './LoginPage.css'; // Reutiliza o CSS
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estados para validação da senha
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
  });

  // Efeito para validar a senha em tempo real
  useEffect(() => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  }, [password]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
        setError('Por favor, cumpra todos os requisitos de senha.');
        return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/register/', {
        username: username,
        email: email,
        password: password,
      });
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça o login.' } });
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData) {
        let errorMsg = Object.values(errorData).flat().join(' ');
        setError(errorMsg);
      } else {
        setError('Falha ao realizar o cadastro. Tente novamente.');
      }
    }
  };
  
  const ValidationCheck = ({ isValid, text }) => (
    <li className={isValid ? 'valid' : 'invalid'}>
      {isValid ? <FaCheckCircle /> : <FaTimesCircle />}
      {text}
    </li>
  );

  return (
    <>
      <SimpleHeader />
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Crie sua Conta</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group"><label>Nome de Usuário</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></div>
            <div className="form-group"><label>E-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="form-group"><label>Senha</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
            
            <ul className="password-requirements">
              <ValidationCheck isValid={passwordValidation.minLength} text="Pelo menos 8 caracteres" />
              <ValidationCheck isValid={passwordValidation.hasUpper} text="Uma letra maiúscula" />
              <ValidationCheck isValid={passwordValidation.hasLower} text="Uma letra minúscula" />
              <ValidationCheck isValid={passwordValidation.hasNumber} text="Pelo menos um número" />
            </ul>

            {error && <p className="form-error">{error}</p>}
            
            <button type="submit" className="btn-login-submit">Criar Conta</button>
          </form>
          <div className="signup-link"><p>Já tem uma conta? <Link to="/login">Faça o login</Link></p></div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;