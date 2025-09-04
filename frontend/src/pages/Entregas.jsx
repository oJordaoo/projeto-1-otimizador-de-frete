// frontend/src/pages/Entregas.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/entregas/');
        setEntregas(response.data);
      } catch (err) {
        setError('Falha ao buscar os dados das entregas.');
        console.error(err);

      } finally {
        setLoading(false);
      }
    };

    fetchEntregas();
  }, []);

  if (loading) {
    return <div>Carregando entregas...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--logired-primary)' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Lista de Entregas ({entregas.length})</h1>
      
      {entregas.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entregas.map(entrega => (
            <li 
              key={entrega.id} 
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid var(--border-color)'
              }}
            >
              <strong style={{ color: 'var(--logired-primary)' }}>ID:</strong> {entrega.id.substring(0, 8)}...
              <br />
              <strong>Status:</strong> {entrega.status}
              <br />
              <strong>Peso:</strong> {entrega.peso_kg} kg
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma entrega encontrada.</p>
      )}
    </div>
  );
}

export default Entregas;