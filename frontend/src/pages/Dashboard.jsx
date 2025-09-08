import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Importa nossa instância configurada
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({ totalVeiculos: 0, totalEntregas: 0, concluidas: 0, pendentes: 0 });
  const [entregasRecentes, setEntregasRecentes] = useState([]);
  const [statsPorStatus, setStatsPorStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Agora usamos o axiosInstance, que já cuida do token
        const [veiculosRes, entregasRes] = await Promise.all([
          axiosInstance.get('veiculos/'),
          axiosInstance.get('entregas/')
        ]);

        const entregas = entregasRes.data;
        const statusCount = { PENDENTE: 0, EM_ROTA: 0, ENTREGUE: 0, FALHOU: 0 };
        entregas.forEach(e => { if (e.status in statusCount) statusCount[e.status]++; });

        setStats({
          totalVeiculos: veiculosRes.data.length,
          totalEntregas: entregas.length,
          concluidas: statusCount.ENTREGUE,
          pendentes: statusCount.PENDENTE,
        });

        setStatsPorStatus([
          { name: 'Pendente', valor: statusCount.PENDENTE, fill: '#FFC107' },
          { name: 'Em Rota', valor: statusCount.EM_ROTA, fill: '#2196F3' },
          { name: 'Entregue', valor: statusCount.ENTREGUE, fill: '#4CAF50' },
          { name: 'Falhou', valor: statusCount.FALHOU, fill: 'var(--logired-primary)' },
        ]);
        
        setEntregasRecentes(entregas.slice(0, 5));

      } catch (err) {
        setError('Falha ao carregar os dados do dashboard.');
        console.error("Erro detalhado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando dashboard...</div>;
  if (error) return <div style={{ color: 'var(--logired-primary)' }}>{error}</div>;

  return (
    <div>
      <h1>Dashboard Operacional</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Visão geral da sua operação logística em tempo real.
      </p>

      <div className="stats-container">
        <div className="stat-card"><h2 className="stat-value">{stats.totalVeiculos}</h2><p className="stat-label">Veículos na Frota</p></div>
        <div className="stat-card"><h2 className="stat-value">{stats.totalEntregas}</h2><p className="stat-label">Entregas Registradas</p></div>
        <div className="stat-card"><h2 className="stat-value">{stats.concluidas}</h2><p className="stat-label">Entregas Concluídas</p></div>
        <div className="stat-card"><h2 className="stat-value">{stats.pendentes}</h2><p className="stat-label">Entregas Pendentes</p></div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card chart-container">
          <h3>Entregas por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsPorStatus} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'rgba(0,0,0,0.1)'}}/>
              <Bar dataKey="valor" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>Entregas Recentes</h3>
          <table className="recent-deliveries-table">
            <thead>
              <tr>
                <th>ID da Entrega</th>
                <th>Status</th>
                <th>Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
              {entregasRecentes.map(entrega => (
                <tr key={entrega.id}>
                  <td>{entrega.id.substring(0, 8)}...</td>
                  <td><span className={`status-badge status-${entrega.status.toLowerCase()}`}>{entrega.status}</span></td>
                  <td>{entrega.peso_kg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;