import { useState } from 'react';
import { Brain, AlertTriangle, Leaf, Zap, Filter, Wind, DollarSign, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { AI_RECOMMENDATIONS } from '../data/cityData.js';

const CATEGORY_META = {
    biofilter: { icon: '🌿', color: 'var(--eco-teal-400)', label: 'Biofilter' },
    energy: { icon: '⚡', color: 'var(--eco-purple-400)', label: 'Energy' },
    traffic: { icon: '🚗', color: 'var(--eco-amber-400)', label: 'Traffic' },
    trees: { icon: '🌳', color: 'var(--eco-green-400)', label: 'Trees' },
    capture: { icon: '🏭', color: 'var(--eco-blue-400)', label: 'CCS' },
};

const PRIORITY_COLOR = {
    critical: 'var(--eco-red-400)',
    high: 'var(--eco-amber-400)',
    medium: 'var(--eco-blue-400)',
};

const EXTRA_RECS = [
    {
        id: 6, zone: "Kurla–Dadar Corridor", priority: "medium",
        action: "Introduce electric bus rapid transit lane replacing 2 vehicle lanes",
        impact: "−9.3 kt CO₂/yr", cost: "$3.2M", roi: "6.1 years", category: "traffic",
    },
    {
        id: 7, zone: "Chembur–Ghatkopar Zone", priority: "high",
        action: "Mandate zero-emission zones for trucks 8AM–6PM daily",
        impact: "−7.8 kt CO₂/yr", cost: "$28K", roi: "0.4 years", category: "traffic",
    },
    {
        id: 8, zone: "Industrial Belt — North", priority: "critical",
        action: "Install rooftop solar array across 25 industrial units",
        impact: "−19.2 kt CO₂/yr", cost: "$2.1M", roi: "4.1 years", category: "energy",
    },
];

const ALL_RECS = [...AI_RECOMMENDATIONS, ...EXTRA_RECS];

export default function AIRecommendations() {
    const [filter, setFilter] = useState('all');
    const [accepted, setAccepted] = useState([]);

    const filtered = filter === 'all' ? ALL_RECS : ALL_RECS.filter(r => r.category === filter || r.priority === filter);
    const totalImpact = ALL_RECS.reduce((acc, r) => acc + parseFloat(r.impact.replace('−', '').replace(' kt CO₂/yr', '')), 0);

    const accept = (id) => setAccepted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                    { label: 'Total Recommendations', value: ALL_RECS.length, icon: Brain, color: 'var(--eco-green-400)', bg: 'rgba(34,197,94,0.1)' },
                    { label: 'Critical Actions', value: ALL_RECS.filter(r => r.priority === 'critical').length, icon: AlertTriangle, color: 'var(--eco-red-400)', bg: 'rgba(239,68,68,0.1)' },
                    { label: 'Total Impact Potential', value: `${totalImpact.toFixed(0)} kt/yr`, icon: Leaf, color: 'var(--eco-teal-400)', bg: 'rgba(45,212,191,0.1)' },
                    { label: 'Actions Accepted', value: accepted.length, icon: CheckCircle, color: 'var(--eco-blue-400)', bg: 'rgba(96,165,250,0.1)' },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="card" style={{ padding: '14px 18px', borderColor: `${s.color}20` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, background: s.bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={18} style={{ color: s.color }} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'Space Grotesk', fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                {[
                    { id: 'all', label: 'All Actions' },
                    { id: 'critical', label: '🔴 Critical' },
                    { id: 'high', label: '🟠 High Priority' },
                    { id: 'medium', label: '🟡 Medium Priority' },
                    { id: 'energy', label: '⚡ Energy' },
                    { id: 'traffic', label: '🚗 Traffic' },
                    { id: 'trees', label: '🌳 Trees' },
                    { id: 'biofilter', label: '🌿 Biofilter' },
                    { id: 'capture', label: '🏭 CCS' },
                ].map(f => (
                    <button
                        key={f.id}
                        className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: 11.5 }}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Recommendation Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(rec => {
                    const cat = CATEGORY_META[rec.category];
                    const isAccepted = accepted.includes(rec.id);
                    return (
                        <div
                            key={rec.id}
                            className="card"
                            style={{
                                borderColor: isAccepted ? 'rgba(34,197,94,0.35)' : `${PRIORITY_COLOR[rec.priority]}20`,
                                background: isAccepted ? 'rgba(34,197,94,0.04)' : 'var(--bg-card)',
                                transition: 'all 0.3s',
                            }}
                        >
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                {/* Category icon */}
                                <div style={{ width: 48, height: 48, background: `${cat.color}15`, border: `1px solid ${cat.color}30`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                    {cat.icon}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: PRIORITY_COLOR[rec.priority], background: `${PRIORITY_COLOR[rec.priority]}15`, padding: '2px 8px', borderRadius: 999, border: `1px solid ${PRIORITY_COLOR[rec.priority]}25` }}>
                                            {rec.priority.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>•</span>
                                        <span style={{ fontSize: 12, color: cat.color, fontWeight: 600 }}>{cat.label}</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>•</span>
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rec.zone}</span>
                                    </div>

                                    <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.4 }}>
                                        {rec.action}
                                    </div>

                                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Leaf size={13} style={{ color: 'var(--eco-green-400)' }} />
                                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Impact:</span>
                                            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--eco-green-400)' }}>{rec.impact}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <DollarSign size={13} style={{ color: 'var(--eco-amber-400)' }} />
                                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Cost:</span>
                                            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--eco-amber-400)' }}>{rec.cost}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Clock size={13} style={{ color: 'var(--eco-blue-400)' }} />
                                            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>ROI:</span>
                                            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--eco-blue-400)' }}>{rec.roi}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                                    <button
                                        className={`btn btn-sm ${isAccepted ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => accept(rec.id)}
                                        style={{ minWidth: 110 }}
                                    >
                                        {isAccepted ? <><CheckCircle size={13} /> Accepted</> : <><ChevronRight size={13} /> Accept Action</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Accepted Summary */}
            {accepted.length > 0 && (
                <div className="alert alert-success" style={{ borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
                    <CheckCircle size={18} style={{ flexShrink: 0 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                            {accepted.length} action{accepted.length > 1 ? 's' : ''} accepted for implementation
                        </div>
                        <div style={{ fontSize: 12.5 }}>
                            Combined impact: −
                            {ALL_RECS.filter(r => accepted.includes(r.id))
                                .reduce((acc, r) => acc + parseFloat(r.impact.replace('−', '').replace(' kt CO₂/yr', '')), 0)
                                .toFixed(1)} kt CO₂/yr. Head to Scenario Lab to model combined effects.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
