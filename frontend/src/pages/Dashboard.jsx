import { useState, useEffect } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    Wind, Factory, Car, Home, TrendingUp, TrendingDown,
    AlertTriangle, Leaf, Zap, Globe, Award, ArrowUp, ArrowDown
} from 'lucide-react';
import {
    EMISSION_SOURCES, LEADERBOARD
} from '../data/cityData.js';
import { fetchSummary, fetchHourlyEmissions, fetchWeeklyEmissions, fetchZones } from '../api.js';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, display: 'flex', gap: 8, marginBottom: 2 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
                    <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
                </div>
            ))}
        </div>
    );
};

export default function Dashboard() {
    const [hourlyData, setHourlyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [zones, setZones] = useState([]);
    const [liveStats, setLiveStats] = useState({ totalCO2: 78.4, aqi: 168, hotspots: 10, reduction: 9.2 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchHourlyEmissions(),
            fetchWeeklyEmissions(),
            fetchZones(),
            fetchSummary()
        ]).then(([hourly, weekly, zns, sum]) => {
            setHourlyData(hourly);
            setWeeklyData(weekly);
            setZones(zns.map(z => ({...z, co2: z.co2_live})));
            setLiveStats({ totalCO2: sum.avg_co2, aqi: sum.aqi_city, hotspots: sum.hotspot_count, reduction: 9.2 });
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch data:", err);
            setLoading(false);
        });

        const interval = setInterval(() => {
            setLiveStats(prev => ({
                ...prev,
                totalCO2: +(prev.totalCO2 + (Math.random() - 0.5) * 0.5).toFixed(1),
                aqi: Math.max(80, Math.min(200, prev.aqi + Math.round((Math.random() - 0.5) * 3))),
                reduction: +(prev.reduction + (Math.random() - 0.5) * 0.2).toFixed(1),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{padding: 40, textAlign: 'center', color: 'var(--text-muted)'}}>Loading live dashboard data...</div>;

    const topZones = [...zones]
        .sort((a, b) => b.co2 - a.co2)
        .slice(0, 8);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Alert Banner */}
            <div className="alert alert-warning" style={{ borderRadius: 'var(--radius-lg)' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                    <strong>🇮🇳 National Air Quality Alert:</strong> 6 critical hotspots active across India —
                    Hazira (121.4), Vizag Steel Plant (119.6), Delhi Anand Vihar (118.4), Thane Industrial (117.3),
                    Naroda Ahmedabad (114.2), Manali Chennai (112.7). Immediate intervention recommended.
                </div>
            </div>

            {/* KPI Stats */}
            <div className="stat-grid">
                <div className="stat-card danger">
                    <div className="stat-icon red"><Factory size={20} /></div>
                    <div className="stat-value">{liveStats.totalCO2} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>kg/m²</span></div>
                    <div className="stat-label">National Avg CO₂</div>
                    <div className="stat-change up">
                        <ArrowUp size={12} /> 4.1% vs last week
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon amber"><Wind size={20} /></div>
                    <div className="stat-value">{liveStats.aqi} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>AQI</span></div>
                    <div className="stat-label">National Avg AQI</div>
                    <div className="stat-change up">
                        <ArrowUp size={12} /> Very Unhealthy
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon red"><AlertTriangle size={20} /></div>
                    <div className="stat-value">{liveStats.hotspots} <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>zones</span></div>
                    <div className="stat-label">Critical Hotspots</div>
                    <div className="stat-change up">
                        <ArrowUp size={12} /> Across 8 cities
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green"><Leaf size={20} /></div>
                    <div className="stat-value">{liveStats.reduction}% <span style={{ fontSize: 14, color: 'var(--text-muted)' }}></span></div>
                    <div className="stat-label">CO₂ Reduced (MTD)</div>
                    <div className="stat-change down">
                        <ArrowDown size={12} /> −18.4 kt this month
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid-2">
                {/* 24h CO₂ Trend */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title"><TrendingUp size={16} /> 24-Hour National Emission Trend</div>
                            <div className="card-subtitle">Hourly CO₂ intensity — national average (60 zones)</div>
                        </div>
                        <span className="badge badge-red">Today</span>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={hourlyData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                            <defs>
                                <linearGradient id="gradCO2" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradIndustrial" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,244,238,0.05)" />
                            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} interval={4} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="co2" stroke="#f87171" strokeWidth={2} fill="url(#gradCO2)" name="Total CO₂" />
                            <Area type="monotone" dataKey="industrial" stroke="#fb923c" strokeWidth={1.5} fill="url(#gradIndustrial)" name="Industrial" strokeDasharray="4 2" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Emission Sources Pie */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title"><Factory size={16} /> Emission Sources</div>
                            <div className="card-subtitle">Contribution by sector — city-wide</div>
                        </div>
                        <span className="badge badge-amber">Breakdown</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <ResponsiveContainer width="55%" height={200}>
                            <PieChart>
                                <Pie data={EMISSION_SOURCES} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                                    paddingAngle={3} dataKey="value">
                                    {EMISSION_SOURCES.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                            {EMISSION_SOURCES.map((s, i) => (
                                <div key={i} className="progress-bar-wrapper">
                                    <div className="progress-header">
                                        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{s.icon} {s.name}</span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${s.value}%`, background: s.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid-2">
                {/* Weekly Bar */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title"><Globe size={16} /> Weekly National CO₂ vs Target</div>
                            <div className="card-subtitle">Daily national average vs 55 kg/m² WHO target</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,244,238,0.05)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="co2" fill="#f87171" name="CO₂ Actual" radius={[4, 4, 0, 0]} maxBarSize={36} />
                            <Bar dataKey="target" fill="rgba(34,197,94,0.4)" name="Target" radius={[4, 4, 0, 0]} maxBarSize={36} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Polluted Zones */}
                <div className="card">
                    <div className="card-header">
                        <div>
                            <div className="card-title"><AlertTriangle size={16} /> Top Polluted Zones — India</div>
                            <div className="card-subtitle">Highest CO₂ emission zones across all cities</div>
                        </div>
                        <span className="badge badge-red">Live</span>
                    </div>
                    <table className="data-table" style={{ marginTop: 4 }}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Zone</th>
                                <th>City</th>
                                <th>Type</th>
                                <th>CO₂</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topZones.map((z, i) => (
                                <tr key={z.id}>
                                    <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 12.5 }}>{z.name}</td>
                                    <td style={{ fontSize: 12, color: 'var(--eco-blue-400)', fontWeight: 500 }}>{z.city}</td>
                                    <td>
                                        <span className={`badge ${z.type === 'industrial' ? 'badge-red' : z.type === 'commercial' ? 'badge-amber' : 'badge-blue'}`}>
                                            {z.type}
                                        </span>
                                    </td>
                                    <td style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: z.co2 > 100 ? 'var(--eco-red-400)' : z.co2 > 70 ? 'var(--eco-amber-400)' : 'var(--eco-green-400)' }}>
                                        {z.co2}
                                    </td>
                                    <td>
                                        <span className={`badge ${z.co2 > 100 ? 'badge-red' : z.co2 > 70 ? 'badge-amber' : 'badge-green'}`}>
                                            {z.co2 > 100 ? 'Critical' : z.co2 > 70 ? 'High' : 'Medium'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sustainability Leaderboard */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title"><Award size={16} /> Indian Cities Sustainability Leaderboard</div>
                        <div className="card-subtitle">City rankings based on AI-computed sustainability score</div>
                    </div>
                    <span className="badge badge-blue">Gamified</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10, marginTop: 8 }}>
                    {LEADERBOARD.map(item => (
                        <div key={item.rank}
                            style={{
                                background: item.highlight ? 'rgba(34,197,94,0.08)' : 'var(--bg-secondary)',
                                border: `1px solid ${item.highlight ? 'rgba(34,197,94,0.3)' : 'var(--border-subtle)'}`,
                                borderRadius: 'var(--radius-md)',
                                padding: '14px 12px',
                                textAlign: 'center',
                                transition: 'all 0.25s',
                            }}
                        >
                            <div style={{ fontSize: 22, marginBottom: 6 }}>{item.badge}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.city}</div>
                            <div style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 800, color: item.highlight ? 'var(--eco-green-400)' : 'var(--text-primary)', lineHeight: 1.2, marginTop: 4 }}>
                                {item.score}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Score</div>
                            <div style={{ fontSize: 11, color: 'var(--eco-green-400)', fontWeight: 600, marginTop: 4 }}>−{item.reduction}% CO₂</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
