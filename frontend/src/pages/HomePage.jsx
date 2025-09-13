import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { FaShieldAlt, FaChartLine, FaUsers, FaRoute, FaUserTie } from 'react-icons/fa';
import PlanosGrid from '../components/PlanosGrid';
import FakeDashboard from '../components/FakeDashboard';
import ContactModal from '../components/ContactModal';
import './HomePage.css';

const AnimatedSection = ({ children, id, className = '' }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section id={id} ref={ref} className={`home-section ${className} ${inView ? 'is-visible' : ''}`}>
      {children}
    </section>
  );
};

function HomePage() {
  const [contactModalIsOpen, setContactModalIsOpen] = useState(false);
  return (
    <div className="home-page-container">
      <header className="home-header">
        <nav className="home-nav">
          <div className="home-logo">VEXA</div>
          <ul className="home-menu">
            <li><ScrollLink to="solucoes" smooth={true} duration={500} offset={-70}>Soluções</ScrollLink></li>
            <li><ScrollLink to="comofunciona" smooth={true} duration={500} offset={-70}>Como Funciona</ScrollLink></li>
            <li><ScrollLink to="planos" smooth={true} duration={500} offset={-70}>Planos</ScrollLink></li>
            <li><ScrollLink to="quemsomos" smooth={true} duration={500} offset={-70}>Quem Somos</ScrollLink></li>
          </ul>
          <div className="home-actions">
            <RouterLink to="/login" className="btn-login">Acessar minha conta</RouterLink>
          </div>
        </nav>
      </header>
      <main className="home-hero">
        <div className="hero-content">
          <p className="hero-tagline">PLATAFORMA TMS EMBARCADOR</p>
          <h1 className="hero-title">Sua logística no controle, seus custos no chão.</h1>
          <p className="hero-description">
            A VEXA centraliza sua operação de transporte, da cotação à auditoria, transformando dados em economia real.
          </p>
          <button className="btn-login hero-cta" onClick={() => document.getElementById('planos').scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            Conheça os Planos
          </button>
        </div>
        <div className="hero-dashboard-wrapper">
          <FakeDashboard isInteractive={false} />
          <RouterLink to="/preview" className="dashboard-cta"><span>Clique para Interagir →</span></RouterLink>
        </div>
      </main>
      <AnimatedSection id="solucoes">
        <h2 className="section-title">A Solução Completa para sua Logística</h2>
        <div className="features-grid">
          <div className="feature-card"><FaRoute className="feature-icon" /><h3>Roteirização Inteligente</h3><p>Nosso algoritmo calcula as rotas mais eficientes para economizar tempo e combustível.</p></div>
          <div className="feature-card"><FaChartLine className="feature-icon" /><h3>Dashboards e KPIs</h3><p>Tenha acesso a indicadores de performance em tempo real para tomar as melhores decisões.</p></div>
          <div className="feature-card"><FaShieldAlt className="feature-icon" /><h3>Auditoria de Fretes</h3><p>Compare faturas com cotações e garanta que você nunca pague a mais pelo seu frete.</p></div>
        </div>
      </AnimatedSection>
      <AnimatedSection id="comofunciona" className="section-dark">
        <h2 className="section-title">Simples de começar, impossível de largar.</h2>
        <div className="how-it-works-grid">
          <div className="step-card"><div className="step-number">1</div><h3>Cadastre</h3><p>Importe suas entregas e cadastre suas transportadoras parceiras de forma rápida e intuitiva.</p></div>
          <div className="step-card"><div className="step-number">2</div><h3>Otimize</h3><p>Com um clique, nosso sistema calcula a melhor rota e sugere a transportadora ideal para cada envio.</p></div>
          <div className="step-card"><div className="step-number">3</div><h3>Acompanhe</h3><p>Monitore tudo em tempo real através de dashboards claros e receba relatórios completos de performance.</p></div>
        </div>
      </AnimatedSection>
      <AnimatedSection id="planos">
        <PlanosGrid onContactClick={() => setContactModalIsOpen(true)} />
      </AnimatedSection>
      <AnimatedSection id="quemsomos" className="section-dark">
        <h2 className="section-title">Nascemos para Mover Negócios</h2>
        <p className="section-description">A VEXA foi fundada por especialistas em logística e tecnologia com um único objetivo: simplificar o complexo.</p>
        <div className="testimonials">
          <div className="testimonial-card"><FaUserTie /><span><strong>João Silva</strong>, Diretor de Logística na "Distribuidora Veloz"</span></div>
        </div>
      </AnimatedSection>
      <footer className="home-footer">
        <p>© 2025 VEXA. Todos os direitos reservados.</p>
      </footer>
      <ContactModal isOpen={contactModalIsOpen} onRequestClose={() => setContactModalIsOpen(false)} />
    </div>
  );
}
export default HomePage;