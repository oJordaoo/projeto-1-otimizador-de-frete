import React from 'react';
import TopNav from './TopNav';
// import Header from './Header'; // <-- REMOVA ESTA LINHA
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="app-layout-main">
      <TopNav />
      {/* <Header /> // <-- REMOVA ESTE COMPONENTE DA RENDERIZAÇÃO */}
      <main className="content-wrapper">
        {children}
      </main>
    </div>
  );
}

export default Layout;