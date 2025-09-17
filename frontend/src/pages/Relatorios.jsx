import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { FaCalendarAlt, FaFilter, FaFilePdf, FaChevronDown, FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Relatorios.css';

// --- GERADOR DE DADOS FAKES (VERSÃO FINAL E COMPLETA) ---
const generateDetailedReportData = (count = 250) => {
    const data = [];
    const now = new Date('2025-09-12T12:00:00Z');
    const motoristas = ['Ana P.', 'Carlos S.', 'João C.', 'Mariana L.'];
    const statusOptions = ['ENTREGUE', 'ATRASADA', 'FALHOU'];

    for (let i = 0; i < count; i++) {
        const date = new Date(now.getTime() - (i * (Math.random() * 24) * 60 * 60 * 1000));
        const distancia = 20 + Math.random() * 80;
        const custo = 50 + distancia * (2 + Math.random());
        data.push({
            id: `f${9000 - i}`,
            data: date.toISOString().split('T')[0],
            custoTotal: custo,
            distancia: distancia,
            custoKm: custo / distancia,
            motorista: motoristas[i % motoristas.length],
            status: statusOptions[i % statusOptions.length],
        });
    }
    return data;
};

// --- COMPONENTE DE TOOLTIP CUSTOMIZADO ---
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const custoTotal = payload.find(p => p.dataKey === 'Custo Total');
        const custoKm = payload.find(p => p.dataKey === 'Custo/km Médio');
        return (
            <div className="custom-tooltip">
                <p className="label">{label}</p>
                {custoTotal && <p className="desc" style={{ color: custoTotal.color }}>Custo: {custoTotal.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>}
                {custoKm && <p className="desc" style={{ color: custoKm.color }}>Custo/km: {custoKm.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>}
            </div>
        );
    }
    return null;
};

// --- COMPONENTE PRINCIPAL DA PÁGINA ---
function Relatorios() {
    const [allData] = useState(() => generateDetailedReportData(250));
    const [filteredData, setFilteredData] = useState(allData);
    const [sortConfig, setSortConfig] = useState({ key: 'data', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 15;

    useEffect(() => {
        let data = [...allData];
        if (searchQuery) {
            data = data.filter(item =>
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.motorista.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredData(data);
        setCurrentPage(1);
    }, [allData, searchQuery, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const kpiData = useMemo(() => {
        const totalCost = allData.reduce((s, d) => s + d.custoTotal, 0);
        const totalDistance = allData.reduce((s, d) => s + d.distancia, 0);
        const entregues = allData.filter(d => d.status === 'ENTREGUE').length;
        return {
            custoTotal: totalCost,
            distanciaTotal: totalDistance,
            taxaSucesso: (entregues / allData.length * 100),
            custoMedioKm: totalCost / totalDistance
        };
    }, [allData]);
    
    const chartData = useMemo(() => {
      const monthly = allData.reduce((acc, item) => {
        const month = new Date(item.data).toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
        if (!acc[month]) acc[month] = { custo: 0, custoKmSum: 0, count: 0 };
        acc[month].custo += item.custoTotal;
        acc[month].custoKmSum += item.custoKm;
        acc[month].count++;
        return acc;
      }, {});
      return Object.entries(monthly).map(([name, values]) => ({
        name,
        'Custo Total': values.custo,
        'Custo/km Médio': values.custoKmSum / values.count,
      })).reverse();
    }, [allData]);

    return (
        <div className="page-container reports-page-final theme-light">
            <div className="report-toolbar">
                <div className="toolbar-left">
                    <h2>Gerador de Relatórios</h2>
                </div>
                {/* CORREÇÃO AQUI: movi os controles para a direita */}
                <div className="toolbar-right">
                    <div className="date-picker-wrapper">
                        <FaCalendarAlt />
                        <input type="text" defaultValue="Últimos 90 dias" readOnly/>
                        <FaChevronDown />
                    </div>
                    <button className="btn-secondary"><FaFilter /> Filtros</button>
                    <button className="btn-primary" onClick={() => toast.success('Exportação iniciada!')}><FaFilePdf /> Exportar PDF</button>
                </div>
            </div>

            <div className="report-section summary-section">
                <h3 className="section-title">Resumo do Período</h3>
                <div className="summary-grid">
                    <div className="summary-card"><span>R$ {kpiData.custoTotal.toLocaleString('pt-BR')}</span><p>Custo Total</p></div>
                    <div className="summary-card"><span>{kpiData.distanciaTotal.toLocaleString('pt-BR')} km</span><p>Distância Total</p></div>
                    <div className="summary-card"><span>{kpiData.taxaSucesso.toFixed(1)}%</span><p>Taxa de Sucesso</p></div>
                    <div className="summary-card"><span>R$ {kpiData.custoMedioKm.toFixed(2)}</span><p>Custo Médio/km</p></div>
                </div>
            </div>

            <div className="report-section chart-section">
                <h3 className="section-title">Análise de Custos</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
                        <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v) => `R$${v/1000}k`} />
                        <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v) => `R$${v.toFixed(1)}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="Custo Total" fill="var(--vexa-primary)" barSize={30} radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="Custo/km Médio" stroke="var(--vexa-accent)" strokeWidth={2} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="report-section table-section">
                <div className="table-header">
                    <h3 className="section-title">Todas as Entregas ({filteredData.length})</h3>
                    <div className="table-search-wrapper">
                        <FaSearch />
                        <input type="text" placeholder="Buscar por ID ou motorista..." onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <div className="table-pro-container">
                    <table className="table-pro-final">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('id')}>ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                                <th onClick={() => requestSort('data')}>Data {sortConfig.key === 'data' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                                <th onClick={() => requestSort('motorista')}>Motorista {sortConfig.key === 'motorista' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                                <th onClick={() => requestSort('status')}>Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                                <th onClick={() => requestSort('distancia')}>Distância {sortConfig.key === 'distancia' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                                <th onClick={() => requestSort('custoKm')}>Custo/km {sortConfig.key === 'custoKm' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                                <th onClick={() => requestSort('custoTotal')}>Custo Total {sortConfig.key === 'custoTotal' && (sortConfig.direction === 'asc' ? <FaArrowUp/> : <FaArrowDown/>)}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id.substring(1, 6)}</td>
                                    <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                                    <td>{item.motorista}</td>
                                    <td><span className={`status-badge-pro status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                                    <td>{item.distancia.toFixed(1)} km</td>
                                    <td>R$ {item.custoKm.toFixed(2)}</td>
                                    <td>R$ {item.custoTotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-pagination">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            </div>
        </div>
    );
}

export default Relatorios;