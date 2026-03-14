import { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { Brain, Clock, Calendar, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { predictEmissions } from '../api.js';

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

const HORIZONS = [
    { id: '24h', label: '24 Hours', icon: Clock, desc: 'Hourly forecast with uncertainty bounds' },
    { id: '7d', label: '7 Days', icon: Calendar, desc: 'Daily average with AI trend model' },
    { id: '30d', label: '30 Days', icon: TrendingUp, desc: 'Long-range projection with climate factors' },
];

const MODEL_METRICS = [
    { label: 'Model Accuracy', value: '94.2%', sub: 'Random Forest R²', color: 'var(--eco-green-400)' },
    { label: 'MAE', value: '2.14', sub: 'Mean Absolute Error', color: 'var(--eco-blue-400)' },
    { label: 'RMSE', value: '3.08', sub: 'Root Mean Square Error', color: 'var(--eco-teal-400)' },
    { label: 'Confidence', value: '91%', sub: '95% prediction interval', color: 'var(--eco-amber-400)' },
];

const FEATURES = [
    { name: 'Traffic Density', importance: 28, color: '#f87171' },
    { name: 'Temperature', importance: 18, color: '#fb923c' },
    { name: 'Industrial Activity', importance: 23, color: '#a78bfa' },
    { name: 'Population Density', importance: 14, color: '#60a5fa' },
    { name: 'Wind Speed', importance: 9, color: '#2dd4bf' },
    { name: 'Humidity', importance: 5, color: '#fbbf24' },
    { name: 'Energy Usage', importance: 3, color: '#34d399' },
];

export default function Predictions() {
    const [horizon, setHorizon] = useState('24h');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        predictEmissions({ horizon }).then(res => {
            setData(res.predictions);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [horizon]);

    const latestPredicted = data[data.length - 1]?.predicted ?? 0;
    const firstPredicted = data[0]?.predicted ?? 0;
    const trend = latestPredicted - firstPredicted;
    const xKey = 'label';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Horizon Selector */}
            <div style={{ display: 'flex', gap: 12 }}>
                {HORIZONS.map(h => {
                    const Icon = h.icon;
                    return (
                        <button
                            key={h.id}
                            className={`btn ${horizon === h.id ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', height: 'auto', gap: 4 }}
                            onClick={() => setHorizon(h.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Icon size={15} /> <span>{h.label}</span>
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 400, color: horizon === h.id ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                                {h.desc}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Model Metrics */}
            <div className="stat-grid">
                {MODEL_METRICS.map(m => (
                    <div key={m.label} className="card" style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{m.label}</div>
                        <div style={{ fontFamily: 'Space Grotesk', fontSize: 26, fontWeight: 800, color: m.color }}>{m.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{m.sub}</div>
                    </div>
                ))}
            </div>

            {/* Prediction Chart */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <div className="card-title"><Brain size={16} /> AI Emission Forecast — {HORIZONS.find(h => h.id === horizon)?.label}</div>
                        <div className="card-subtitle">Predicted CO₂ with 95% confidence interval</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trend:</span>
                        {trend < 0 ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--eco-green-400)', fontWeight: 700, fontSize: 13 }}>
                                <TrendingDown size={14} /> {Math.abs(trend).toFixed(1)} kg/m²
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--eco-red-400)', fontWeight: 700, fontSize: 13 }}>
                                <TrendingUp size={14} /> +{trend.toFixed(1)} kg/m²
                            </span>
                        )}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                        <defs>
                            <linearGradient id="gradPred" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,244,238,0.05)" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false}
                            interval={horizon === '24h' ? 3 : 0} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={55} stroke="rgba(34,197,94,0.4)" strokeDasharray="6 3" label={{ value: 'Target', fill: '#22c55e', fontSize: 10, position: 'insideTopRight' }} />
                        <Area type="monotone" dataKey="upper" stroke="rgba(96,165,250,0.3)" strokeWidth={1} fill="url(#gradConf)" name="Upper Bound" strokeDasharray="4 2" />
                        <Area type="monotone" dataKey="predicted" stroke="#22c55e" strokeWidth={2.5} fill="url(#gradPred)" name="AI Prediction" />
                        <Area type="monotone" dataKey="lower" stroke="rgba(96,165,250,0.3)" strokeWidth={1} fill="none" name="Lower Bound" strokeDasharray="4 2" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid-2">
                {/* Feature Importance */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}><Activity size={15} /> Feature Importance</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {FEATURES.sort((a, b) => b.importance - a.importance).map(f => (
                            <div key={f.name} className="progress-bar-wrapper">
                                <div className="progress-header">
                                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{f.name}</span>
                                    <span style={{ fontSize: 12.5, fontWeight: 700, color: f.color }}>{f.importance}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${f.importance / 28 * 100}%`, background: f.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zone Predictions */}
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}>Zone-Level Forecasts</div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Zone</th>
                                <th>Current</th>
                                <th>Predicted</th>
                                <th>Δ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { zone: 'Thane Industrial', curr: 117.3, pred: 119.1 },
                                { zone: 'Sewri Port', curr: 109.2, pred: 107.8 },
                                { zone: 'Dharavi Industrial', curr: 98.4, pred: 101.2 },
                                { zone: 'Chembur Refinery', curr: 102.8, pred: 98.4 },
                                { zone: 'Andheri East', curr: 81.7, pred: 79.3 },
                                { zone: 'Sion', curr: 83.7, pred: 84.9 },
                                { zone: 'Worli Sea Face', curr: 31.2, pred: 30.1 },
                                { zone: 'Juhu Residential', curr: 28.7, pred: 29.4 },
                            ].map(r => {
                                const delta = (r.pred - r.curr).toFixed(1);
                                const up = delta > 0;
                                return (
                                    <tr key={r.zone}>
                                        <td style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{r.zone}</td>
                                        <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: 'var(--text-secondary)' }}>{r.curr}</td>
                                        <td style={{ fontFamily: 'Space Grotesk', fontWeight: 700, color: r.pred > 90 ? 'var(--eco-red-400)' : r.pred > 65 ? 'var(--eco-amber-400)' : 'var(--eco-green-400)' }}>
                                            {r.pred}
                                        </td>
                                        <td style={{ fontWeight: 700, color: up ? 'var(--eco-red-400)' : 'var(--eco-green-400)', fontSize: 12 }}>
                                            {up ? '↑' : '↓'} {Math.abs(delta)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
