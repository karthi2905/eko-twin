import { useState, useEffect } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { GitCompare, Plus, Trash2, Play, Download, Trophy } from 'lucide-react';
import { simulateScenario } from '../api.js';

const PRESET_SCENARIOS = [
    { name: 'Green City Plan', params: { treeCount: 20, trafficReduction: 30, renewableEnergy: 40, biofilters: 10, carbonCapture: 5 } },
    { name: 'Traffic-First Strategy', params: { treeCount: 5, trafficReduction: 70, renewableEnergy: 20, biofilters: 0, carbonCapture: 0 } },
    { name: 'Industrial Reform', params: { treeCount: 0, trafficReduction: 10, renewableEnergy: 80, biofilters: 20, carbonCapture: 15 } },
    { name: 'Nature-Based Solution', params: { treeCount: 50, trafficReduction: 20, renewableEnergy: 30, biofilters: 30, carbonCapture: 0 } },
    { name: 'Full Carbon Capture', params: { treeCount: 10, trafficReduction: 40, renewableEnergy: 60, biofilters: 15, carbonCapture: 30 } },
];

const COLORS = ['#22c55e', '#60a5fa', '#f87171', '#fbbf24', '#a78bfa', '#2dd4bf'];

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

export default function Scenarios() {
    const [scenarios, setScenarios] = useState(() =>
        PRESET_SCENARIOS.slice(0, 3).map((s, i) => ({
            ...s, id: i, color: COLORS[i],
            results: { totalReduction: 0, newCO2Level: 0, sustainabilityScore: 0, annualTonnesSaved: 0, costSaving: 0, aiRecommendation: 'Loading...', breakdown: {} },
        }))
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all(PRESET_SCENARIOS.slice(0, 3).map((s, i) => 
            simulateScenario(s.params).then(res => ({ id: i, res }))
        )).then(results => {
            setScenarios(prev => prev.map(s => {
                const updated = results.find(r => r.id === s.id);
                return updated ? { ...s, results: updated.res } : s;
            }));
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const addScenario = () => {
        const next = PRESET_SCENARIOS[scenarios.length % PRESET_SCENARIOS.length];
        const id = Date.now();
        setScenarios(prev => [
            ...prev,
            { ...next, id, color: COLORS[prev.length % COLORS.length], results: { totalReduction: 0, newCO2Level: 0, sustainabilityScore: 0, annualTonnesSaved: 0, costSaving: 0, aiRecommendation: 'Loading...', breakdown: {} } },
        ]);
        simulateScenario(next.params).then(res => {
            setScenarios(prev => prev.map(s => s.id === id ? { ...s, results: res } : s));
        });
    };

    const removeScenario = (id) => setScenarios(prev => prev.filter(s => s.id !== id));

    const updateParam = (id, key, val) => {
        setScenarios(prev => prev.map(s => {
            if (s.id !== id) return s;
            return { ...s, params: { ...s.params, [key]: +val } };
        }));

        // Fetch new results async
        const s = scenarios.find(x => x.id === id);
        if (s) {
            const newParams = { ...s.params, [key]: +val };
            simulateScenario(newParams).then(res => {
                setScenarios(prev => prev.map(sc => sc.id === id ? { ...sc, results: res } : sc));
            });
        }
    };

    // Comparison chart data
    const comparisonData = [
        { metric: 'CO₂ Reduction %', ...Object.fromEntries(scenarios.map(s => [s.name, s.results.totalReduction])) },
        { metric: 'Sustainability Score', ...Object.fromEntries(scenarios.map(s => [s.name, s.results.sustainabilityScore])) },
        { metric: 'Tonnes Saved (÷100)', ...Object.fromEntries(scenarios.map(s => [s.name, s.results.annualTonnesSaved / 100])) },
    ];

    const radarData = ['Trees', 'Traffic', 'Renewables', 'Biofilters', 'CCS'].map(label => {
        const keyMap = { Trees: 'treeCount', Traffic: 'trafficReduction', Renewables: 'renewableEnergy', Biofilters: 'biofilters', CCS: 'carbonCapture' };
        const maxMap = { treeCount: 50, trafficReduction: 80, renewableEnergy: 100, biofilters: 50, carbonCapture: 30 };
        const key = keyMap[label];
        return {
            subject: label,
            ...Object.fromEntries(scenarios.map(s => [s.name, (s.params[key] / maxMap[key]) * 100])),
        };
    });

    const best = scenarios.reduce((a, b) => a.results.totalReduction > b.results.totalReduction ? a : b, scenarios[0]);

    const SLIDERS = [
        { key: 'treeCount', label: '🌳 Trees (K)', max: 50 },
        { key: 'trafficReduction', label: '🚗 Traffic %', max: 80 },
        { key: 'renewableEnergy', label: '⚡ Renewable %', max: 100 },
        { key: 'biofilters', label: '🌿 Biofilters', max: 50 },
        { key: 'carbonCapture', label: '🏭 CCS Units', max: 30 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Scenario Laboratory</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>Build and compare up to 6 environmental intervention strategies side-by-side</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {scenarios.length < 6 && (
                        <button className="btn btn-primary" onClick={addScenario}>
                            <Plus size={15} /> Add Scenario
                        </button>
                    )}
                    <button className="btn btn-secondary">
                        <Download size={15} /> Export Report
                    </button>
                </div>
            </div>

            {/* Best Scenario Banner */}
            {best && (
                <div className="alert alert-success" style={{ borderRadius: 'var(--radius-lg)' }}>
                    <Trophy size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <strong>Best Performing Strategy: {best.name}</strong> — achieves {best.results.totalReduction}% CO₂ reduction
                        ({best.results.annualTonnesSaved.toLocaleString()} tonnes/yr saved) with a sustainability score of {best.results.sustainabilityScore}/100.
                    </div>
                </div>
            )}

            {/* Scenario Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(scenarios.length, 3)}, 1fr)`, gap: 14 }}>
                {scenarios.map(s => (
                    <div key={s.id} className="card" style={{ borderColor: `${s.color}30`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '12px 12px 0 0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color }} />
                                <input
                                    value={s.name}
                                    onChange={e => setScenarios(prev => prev.map(x => x.id === s.id ? { ...x, name: e.target.value } : x))}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: 13.5, fontFamily: 'Inter, sans-serif', width: '100%' }}
                                />
                            </div>
                            <button className="btn btn-ghost" style={{ padding: 4 }} onClick={() => removeScenario(s.id)}>
                                <Trash2 size={13} style={{ color: 'var(--eco-red-400)' }} />
                            </button>
                        </div>

                        {/* Key result */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: s.color }}>{s.results.totalReduction}%</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>CO₂ Reduction</div>
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: s.color }}>{s.results.sustainabilityScore}</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Eco Score</div>
                            </div>
                        </div>

                        {/* Sliders */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {SLIDERS.map(sl => (
                                <div key={sl.key} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{sl.label}</span>
                                        <span style={{ color: s.color, fontWeight: 700 }}>{s.params[sl.key]}</span>
                                    </div>
                                    <input
                                        type="range" min={0} max={sl.max} step={1}
                                        value={s.params[sl.key]}
                                        onChange={e => updateParam(s.id, sl.key, e.target.value)}
                                        style={{ background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${s.params[sl.key] / sl.max * 100}%, var(--bg-elevated) ${s.params[sl.key] / sl.max * 100}%, var(--bg-elevated) 100%)` }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 11.5, color: 'var(--text-muted)', borderLeft: `3px solid ${s.color}` }}>
                            {s.results.aiRecommendation.substring(0, 90)}…
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Charts */}
            <div className="grid-2">
                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}><GitCompare size={15} /> Performance Comparison</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={comparisonData} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 80 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,244,238,0.05)" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                            <YAxis type="category" dataKey="metric" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} />
                            {scenarios.map(s => (
                                <Bar key={s.id} dataKey={s.name} fill={s.color} radius={[0, 4, 4, 0]} maxBarSize={20} />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <div className="card-title" style={{ marginBottom: 14 }}>Strategy Fingerprint</div>
                    <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={radarData}>
                            <PolarGrid stroke="rgba(226,244,238,0.08)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                            {scenarios.map(s => (
                                <Radar key={s.id} name={s.name} dataKey={s.name} stroke={s.color} fill={s.color} fillOpacity={0.12} strokeWidth={2} />
                            ))}
                            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Table */}
            <div className="card">
                <div className="card-title" style={{ marginBottom: 14 }}>Scenario Summary Table</div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Scenario</th>
                            <th>CO₂ Reduction</th>
                            <th>New CO₂ Level</th>
                            <th>Eco Score</th>
                            <th>Tonnes Saved/yr</th>
                            <th>Cost Saving/yr</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenarios.map(s => (
                            <tr key={s.id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                                </td>
                                <td style={{ fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.results.totalReduction}%</td>
                                <td style={{ fontFamily: 'Space Grotesk', fontWeight: 600, color: s.results.newCO2Level < 40 ? 'var(--eco-green-400)' : s.results.newCO2Level < 55 ? 'var(--eco-amber-400)' : 'var(--eco-red-400)' }}>
                                    {s.results.newCO2Level} kg/m²
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 60, height: 5, background: 'var(--bg-elevated)', borderRadius: 99 }}>
                                            <div style={{ width: `${s.results.sustainabilityScore}%`, height: '100%', background: s.color, borderRadius: 99, transition: 'width 0.8s' }} />
                                        </div>
                                        <span style={{ fontWeight: 700, color: s.color }}>{s.results.sustainabilityScore}</span>
                                    </div>
                                </td>
                                <td style={{ fontFamily: 'Space Grotesk', color: 'var(--text-secondary)' }}>{s.results.annualTonnesSaved.toLocaleString()}</td>
                                <td style={{ fontFamily: 'Space Grotesk', color: 'var(--eco-green-400)', fontWeight: 600 }}>${(s.results.costSaving / 1000).toFixed(0)}K</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
