import React from 'react';
import { Link } from 'react-router-dom'; // Para navegar entre páginas
import './HomePage.css'; // Vamos criar um CSS específico para ela

function HomePage() {
  return (
    <div className="home-page-container">
      <header className="home-header">
        <nav className="home-nav">
          <div className="home-logo">LogiRed</div>
          <ul className="home-menu">
            <li><a href="#solucoes">Soluções</a></li>
            <li><a href="#conteudo">Conteúdo</a></li>
            <li><a href="#quemsomos">Quem Somos</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
          <div className="home-actions">
            <button className="btn-support">Falar com o suporte</button>
            <Link to="/login" className="btn-login">Acessar minha conta</Link>
          </div>
        </nav>
      </header>

      <main className="home-hero">
        <div className="hero-content">
          <p className="hero-tagline">SISTEMA DE GERENCIAMENTO DE TRANSPORTE</p>
          <h1 className="hero-title">Sistema TMS embarcador</h1>
          <p className="hero-description">
            Gerencie compliance, performance logística e saving de frete com um sistema TMS.
          </p>
        </div>
        <div className="hero-form-card">
          <h2>Inicie sua jornada com a LogiRed</h2>
          <p>Agende uma demonstração voltada ao seu negócio com nossos especialistas.</p>
          <form className="demo-form">
            <div className="form-group">
              <input type="text" placeholder="Nome Completo" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Seu e-mail profissional" />
            </div>
            <button type="submit" className="btn-continue">CONTINUAR</button>
          </form>
          <p className="form-footer">Quer reduzir os custos de logística da sua empresa?</p>
        </div>
      </main>

      {/* Seções adicionais podem vir aqui */}
      <section id="solucoes" style={{ height: '300px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Seção de Soluções</h2>
      </section>
      <section id="conteudo" style={{ height: '300px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Seção de Conteúdo</h2>
      </section>

      <footer className="home-footer">
        <p>© 2024 LogiRed Entregas Expressas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;