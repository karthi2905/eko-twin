import { useState, useEffect } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Play, Pause, RotateCcw, Sliders, Zap, Trees, Wind, Radio, Gauge } from 'lucide-react';
import { simulateScenario, generateHourlyData } from '../data/cityData.js';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ color: p.color, display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
                    <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong>
                </div>
            ))}
        </div>
    );
};

function ScoreRing({ score, size = 120 }) {
    const r = (size / 2) - 10;
    const circumference = 2 * Math.PI * r;
    const strokeDash = (score / 100) * circumference;
    const color = score >= 70 ? '#22c55e' : score >= 40 ? '#fbbf24' : '#f87171';

    return (
        <div className="score-ring" style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(226,244,238,0.08)" strokeWidth={8} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                />
            </svg>
            <div className="score-text" style={{ fontSize: size > 100 ? 22 : 16, color }}>
                {score}
            </div>
        </div>
    );
}

const DEFAULT_PARAMS = { treeCount: 0, trafficReduction: 0, renewableEnergy: 0, biofilters: 0, carbonCapture: 0 };

const SLIDERS = [
    { key: 'treeCount', label: 'Trees Planted', icon: '🌳', unit: 'K trees', max: 50, color: '#22c55e' },
    { key: 'trafficReduction', label: 'Traffic Reduction', icon: '🚗', unit: '%', max: 80, color: '#f97316' },
    { key: 'renewableEnergy', label: 'Renewable Energy', icon: '⚡', unit: '%', max: 100, color: '#a78bfa' },
    { key: 'biofilters', label: 'Biofilter Units', icon: '🌿', unit: ' units', max: 50, color: '#2dd4bf' },
    { key: 'carbonCapture', label: 'Carbon Capture Devices', icon: '🏭', unit: ' units', max: 30, color: '#60a5fa' },
];

export default function Simulation() {
    const [params, setParams] = useState(DEFAULT_PARAMS);
    const [results, setResults] = useState(() => simulateScenario(DEFAULT_PARAMS));
    const [running, setRunning] = useState(false);
    const [twinData, setTwinData] = useState(() => generateHourlyData(68.4));
    const [simulatedData, setSimulatedData] = useState(() => generateHourlyData(68.4));

    useEffect(() => {
        const r = simulateScenario(params);
        setResults(r);
        setSimulatedData(generateHourlyData(r.newCO2Level));
    }, [params]);

    // Live twin animation
    useEffect(() => {
        if (!running) return;
        const iv = setInterval(() => {
            setTwinData(generateHourlyData(68.4 + (Math.random() - 0.5) * 3));
        }, 2000);
        return () => clearInterval(iv);
    }, [running]);

    const radarData = [
        { subject: 'Trees', value: params.treeCount / 50 * 100 },
        { subject: 'Traffic', value: params.trafficReduction },
        { subject: 'Renewables', value: params.renewableEnergy },
        { subject: 'Biofilters', value: params.biofilters / 50 * 100 },
        { subject: 'CCS', value: params.carbonCapture / 30 * 100 },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Digital Twin Simulation Engine
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
                        Adjust strategies and observe real-time impact on city CO₂ levels
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        className={`btn ${running ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => setRunning(p => !p)}
                    >
                        {running ? <><Pause size={15} /> Stop Simulation</> : <><Play size={15} /> Run Simulation</>}
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setParams(DEFAULT_PARAMS); setRunning(false); }}>
                        <RotateCcw size={15} /> Reset
                    </button>
                </div>
            </div>

            <div className="grid-2">
                {/* Sliders Panel */}
                <div className="card">
                    <div className="card-header">
                        <div className="card-title"><Sliders size={16} /> Intervention Controls</div>
                        <span className={`badge ${running ? 'badge-green' : 'badge-blue'}`} style={{ borderRadius: '9999px' }}>
                            {running ? '● LIVE' : '○ Paused'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 8 }}>
                        {SLIDERS.map(s => (
                            <div key={s.key} className="slider-container">
                                <div className="slider-header">
                                    <span className="slider-label">{s.icon} {s.label}</span>
                                    <span className="slider-value" style={{ color: s.color }}>
                                        {params[s.key]}{s.unit}
                                    </span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="range" min={0} max={s.max} step={1}
                                        value={params[s.key]}
                                        onChange={e => setParams(p => ({ ...p, [s.key]: +e.target.value }))}
                                        style={{
                                            background: `linear-gradient(to right, ${s.color} 0%, ${s.color} ${params[s.key] / s.max * 100}%, var(--bg-elevated) ${params[s.key] / s.max * 100}%, var(--bg-elevated) 100%)`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Results Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Score and reduction */}
                    <div className="card" style={{ borderColor: results.totalReduction > 30 ? 'rgba(34,197,94,0.3)' : 'var(--border-default)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <ScoreRing score={results.sustainabilityScore} size={120} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sustainability Score</div>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                                    {results.sustainabilityScore < 30 ? '🌱 Getting started' :
                                        results.sustainabilityScore < 60 ? '🌿 Good progress' :
                                            results.sustainabilityScore < 85 ? '🌳 Excellent strategy' : '🏆 Optimal!'}
                                </div>
                                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {[
                                        { label: 'CO₂ Reduction', value: `${results.totalReduction}%`, color: 'var(--eco-green-400)' },
                                        { label: 'New CO₂ Level', value: `${results.newCO2Level} kg/m²`, color: 'var(--eco-blue-400)' },
                                        { label: 'Tonnes Saved/yr', value: `${results.annualTonnesSaved.toLocaleString()}`, color: 'var(--eco-teal-400)' },
                                        { label: 'Cost Saved/yr', value: `$${(results.costSaving / 1000).toFixed(0)}K`, color: 'var(--eco-amber-400)' },
                                    ].map(m => (
                                        <div key={m.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 10px', border: '1px solid var(--border-subtle)' }}>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                                            <div style={{ fontFamily: 'Space Grotesk', fontSize: 15, fontWeight: 700, color: m.color, marginTop: 2 }}>{m.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="alert alert-success">
                        <Radio size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>AI Recommendation</div>
                            <div style={{ fontSize: 12.5 }}>{results.aiRecommendation}</div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="card">
                        <div className="card-title" style={{ marginBottom: 12 }}><Gauge size={15} /> Impact Breakdown</div>
                        {[
                            { label: 'Tree Plantation', value: results.breakdown.trees, color: '#22c55e', icon: '🌳' },
                            { label: 'Traffic Control', value: results.breakdown.traffic, color: '#f97316', icon: '🚗' },
                            { label: 'Renewable Energy', value: results.breakdown.energy, color: '#a78bfa', icon: '⚡' },
                            { label: 'Biofilters', value: results.breakdown.biofilters, color: '#2dd4bf', icon: '🌿' },
                            { label: 'Carbon Capture', value: results.breakdown.carbonCapture, color: '#60a5fa', icon: '🏭' },
                        ].map(b => (
                            <div key={b.label} className="progress-bar-wrapper" style={{ marginBottom: 8 }}>
                                <div className="progress-header">
                                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.icon} {b.label}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>−{b.value}%</span>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: `${Math.min(b.value / 50 * 100, 100)}%`, background: b.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Twin Visualization Chart */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title"><Zap size={16} /> Digital Twin — Emission Overlay</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--eco-red-400)' }}>
                            <div style={{ width: 20, height: 2, background: '#f87171' }} /> Baseline
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--eco-green-400)' }}>
                            <div style={{ width: 20, height: 2, background: '#22c55e' }} /> Simulated
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                        <defs>
                            <linearGradient id="gradBase" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradSim" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,244,238,0.05)" />
                        <XAxis dataKey="hour" data={twinData} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} interval={4} />
                        <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area data={twinData} type="monotone" dataKey="co2" stroke="#f87171" strokeWidth={2} fill="url(#gradBase)" name="Baseline CO₂" />
                        <Area data={simulatedData} type="monotone" dataKey="co2" stroke="#22c55e" strokeWidth={2} fill="url(#gradSim)" name="Simulated CO₂" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="card" style={{ maxWidth: 420, alignSelf: 'flex-start' }}>
                <div className="card-title" style={{ marginBottom: 12 }}>Strategy Radar</div>
                <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(226,244,238,0.08)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
                        <Radar name="Strategy" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
