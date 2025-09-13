import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import './ContactModal.css';

// Configuração inicial para o modal (importante para acessibilidade)
Modal.setAppElement('#root');

const ContactModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Em um projeto real, aqui seria a chamada de API para enviar os dados
    console.log("Dados de contato enviados:", formData);
    alert('Obrigado pelo seu interesse! Entraremos em contato em breve.');
    onRequestClose(); // Fecha o modal após o envio
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Formulário de Contato Enterprise"
      className="contact-modal"
      overlayClassName="contact-overlay"
    >
      <div className="contact-modal-header">
        <h2>Contato Enterprise</h2>
        <button onClick={onRequestClose} className="close-modal-btn"><FaTimes /></button>
      </div>
      <p className="contact-modal-subtitle">
        Nossa equipe preparará uma proposta customizada para sua operação.
      </p>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Nome Completo</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail Profissional</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Telefone / WhatsApp</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-primary">Enviar Solicitação</button>
      </form>
    </Modal>
  );
};

export default ContactModal;