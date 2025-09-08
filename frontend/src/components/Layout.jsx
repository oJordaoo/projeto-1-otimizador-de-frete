import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-area">
        <Header />
        <main className="content-wrapper">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;