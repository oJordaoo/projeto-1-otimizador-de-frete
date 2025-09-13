import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './Dashboard.css';

// --- DADOS FAKES DE ALTA QUALIDADE PARA SIMULAÇÃO ---
const kpiData = {
  entregas_concluidas: { valor: 1245, mudanca: 12.5, tendencia: 'up' },
  custo_total: { valor: 42850.70, mudanca: -8.2, tendencia: 'down' },
  otif: { valor: 97.2, mudanca: 1.8, tendencia: 'up' },
  veiculos_ativos: { valor: 12, mudanca: -1, tendencia: 'down' }
};

const custoPorMesData = [
  { mes: 'Abr', custo: 38000 }, { mes: 'Mai', custo: 41000 },
  { mes: 'Jun', custo: 39500 }, { mes: 'Jul', custo: 45000 },
  { mes: 'Ago', custo: 42850 },
];

const entregasRecentes = [
    {id: 'f386', status: 'ENTREGUE', destino: 'São José dos Pinhais'},
    {id: '0cff', status: 'EM_ROTA', destino: 'Centro Cívico, Curitiba'},
    {id: '54b7', status: 'PENDENTE', destino: 'Araucária'},
    {id: '9a8c', status: 'FALHOU', destino: 'Campo Largo'},
];


const KpiCard = ({ title, value, change, trend, unit = '' }) => {
  const isPositive = trend === 'up';
  return (
    <div className="kpi-card-real">
      <h3 className="kpi-title">{title}</h3>
      <div className="kpi-value-main">
        {unit === 'R$' && 'R$ '}{value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{unit !== 'R$' && unit}
      </div>
      <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <FaArrowUp /> : <FaArrowDown />}
        <span>{Math.abs(change)}% vs. último período</span>
      </div>
    </div>
  );
};

function Dashboard() {
  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header">
        <h1>Dashboard Operacional</h1>
        <div className="date-filter">
          <select defaultValue="30d">
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="3m">Últimos 3 meses</option>
          </select>
        </div>
      </div>

      <div className="dashboard-grid-real">
        {/* Linha de KPIs */}
        <div className="kpi-grid-row">
          <KpiCard title="Entregas Concluídas" value={kpiData.entregas_concluidas.valor} change={kpiData.entregas_concluidas.mudanca} trend={kpiData.entregas_concluidas.tendencia} />
          <KpiCard title="Custo Total de Frete" value={kpiData.custo_total.valor} change={kpiData.custo_total.mudanca} trend={kpiData.custo_total.tendencia} unit="R$" />
          <KpiCard title="Entrega no Prazo (OTIF)" value={kpiData.otif.valor} change={kpiData.otif.mudanca} trend={kpiData.otif.tendencia} unit="%" />
          <KpiCard title="Veículos Ativos" value={kpiData.veiculos_ativos.valor} change={kpiData.veiculos_ativos.mudanca} trend={kpiData.veiculos_ativos.tendencia} />
        </div>

        {/* Gráfico Principal */}
        <div className="main-chart-card card-real">
          <h3 className="card-title">Tendência de Custos (Últimos 5 Meses)</h3>
           <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={custoPorMesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--vexa-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--vexa-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={ "var(--border-color)" } />
              <XAxis dataKey="mes" stroke="var(--text-secondary)" />
              <YAxis tickFormatter={(value) => `R$${value/1000}k`} stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}/>
              <Area type="monotone" dataKey="custo" stroke="var(--vexa-primary)" strokeWidth={2} fill="url(#colorCusto)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Painel Lateral */}
        <div className="side-panel-real">
            <div className="activity-panel-real card-real">
              <h3 className="card-title">Atividade Recente</h3>
              <ul className="activity-list">
                {entregasRecentes.map(entrega => (
                  <li key={entrega.id}>
                    <div className="activity-info">
                      <span className="activity-id">Entrega #{entrega.id}</span>
                      <span className="activity-dest">{entrega.destino}</span>
                    </div>
                    <span className={`status-badge status-${entrega.status.toLowerCase()}`}>{entrega.status}</span>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;