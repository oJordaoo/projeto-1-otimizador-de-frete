import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        // Buscamos os dados da API de veículos
        const response = await axios.get('http://127.0.0.1:8000/api/veiculos/');
        setVeiculos(response.data);
      } catch (err) {
        setError('Falha ao buscar os dados da frota.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVeiculos();
  }, []);

  if (loading) {
    return <div>Carregando frota...</div>;
  }

  if (error) {
    return <div style={{ color: 'var(--logired-primary)' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Frota de Veículos ({veiculos.length})</h1>
      
      {veiculos.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {veiculos.map(veiculo => (
            <li 
              key={veiculo.id} 
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ color: 'var(--logired-primary)', fontSize: '1.1em' }}>
                  Placa: {veiculo.placa}
                </strong>
                <br />
                <span style={{ color: 'var(--text-secondary)' }}>
                  ID: {veiculo.id.substring(0, 8)}...
                </span>
              </div>
              <div>
                <span>Capacidade: {veiculo.capacidade_kg} kg</span>
                <span style={{ margin: '0 10px' }}>|</span>
                <span>Volume: {veiculo.capacidade_m3} m³</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum veículo encontrado.</p>
      )}
    </div>
  );
}

export default Veiculos;