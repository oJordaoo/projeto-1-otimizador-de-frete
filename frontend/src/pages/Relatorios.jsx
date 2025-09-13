import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import './Relatorios.css';

// --- DADOS FAKES PARA OS GRÁFICOS ---
const entregaNoPrazoData = [
  { name: 'Jan', Taxa: 92 }, { name: 'Fev', Taxa: 94 },
  { name: 'Mar', Taxa: 91 }, { name: 'Abr', Taxa: 95 },
  { name: 'Mai', Taxa: 96 }, { name: 'Jun', Taxa: 97 },
];

const custoPorMesData = [
  { name: 'Jan', Custo: 12000 }, { name: 'Fev', Custo: 15500 },
  { name: 'Mar', Custo: 14000 }, { name: 'Abr', Custo: 18000 },
  { name: 'Mai', Custo: 17200 }, { name: 'Jun', Custo: 19500 },
];

const entregasPorStatusData = [
  { name: 'Entregue', valor: 1245 },
  { name: 'Em Rota', valor: 120 },
  { name: 'Pendente', valor: 85 },
  { name: 'Falhou', valor: 12 },
];
const COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#D32F2F'];


function Relatorios() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Relatórios de Performance</h1>
        <div className="date-filter">
          {/* Este seria um seletor de data funcional no futuro */}
          <select>
            <option>Últimos 30 dias</option>
            <option>Este Mês</option>
            <option>Últimos 3 meses</option>
          </select>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Entrega no Prazo (OTIF)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={entregaNoPrazoData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis unit="%" domain={[80, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Taxa" stroke="var(--logired-primary)" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="report-card">
          <h3>Custo Total de Frete (R$)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={custoPorMesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$${value/1000}k`} />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}/>
              <Legend />
              <Bar dataKey="Custo" fill="var(--logired-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="report-card">
          <h3>Distribuição de Entregas por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={entregasPorStatusData} dataKey="valor" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {entregasPorStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="report-card">
            <h3>Performance por Transportadora</h3>
            <p style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Em breve...</p>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;