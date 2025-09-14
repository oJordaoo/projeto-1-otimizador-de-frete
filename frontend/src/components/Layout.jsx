import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import './Layout.css';

function Layout() {
  return (
    <div className="app-layout-main">
      <TopNav />
      <main className="content-wrapper">
        <Outlet /> {/* As páginas serão renderizadas aqui */}
      </main>
    </div>
  );
}

export default Layout;