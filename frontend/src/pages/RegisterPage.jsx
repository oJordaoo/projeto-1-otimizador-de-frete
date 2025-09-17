// frontend/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import axiosInstance from '../api/axiosInstance'; // Importa nossa instância do Axios
import toast from 'react-hot-toast';
import './LoginPage.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// ... (Componente ValidationCheck mantido como antes)

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // ... (Lógica de validação de senha mantida como antes)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Criando sua conta...');

    try {
      // CHAMADA DE API REAL
      await axiosInstance.post('/register/', {
        username,
        email,
        password,
      });
      
      toast.dismiss(loadingToast);
      // Redireciona para o login com uma mensagem de sucesso
      navigate('/login', { state: { message: 'Conta criada com sucesso! Faça o login.' } });

    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMessage = err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || 'Ocorreu um erro ao criar a conta.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <SimpleHeader />
      <div className="login-container">
        <div className="login-card">
          {/* O restante do JSX do formulário é mantido exatamente como antes */}
        </div>
      </div>
    </>
  );
}

// ... (Componente ValidationCheck mantido como antes)

export default RegisterPage;