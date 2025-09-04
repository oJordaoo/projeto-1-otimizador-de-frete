import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;