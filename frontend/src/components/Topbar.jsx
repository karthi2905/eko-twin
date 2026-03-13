import { Bell, Wifi, RefreshCw } from 'lucide-react';

const PAGE_META = {
    dashboard: { title: 'City Overview', subtitle: 'Real-time emission monitoring dashboard' },
    map: { title: 'CO₂ Heatmap', subtitle: 'Interactive pollution visualization' },
    simulation: { title: 'Digital Twin Simulation', subtitle: 'Live virtual city model' },
    predictions: { title: 'AI Predictions', subtitle: 'Forecasted emission trajectory' },
    ai: { title: 'AI Recommendations', subtitle: 'Optimal carbon reduction strategies' },
    scenarios: { title: 'Scenario Laboratory', subtitle: 'Compare environmental interventions' },
};

export default function Topbar({ activePage, currentTime }) {
    const meta = PAGE_META[activePage] || PAGE_META.dashboard;
    const timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <header className="topbar">
            <div style={{ flex: 1 }}>
                <div className="topbar-title">
                    {meta.title}
                    <span className="topbar-subtitle" style={{ marginLeft: 10, fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>
                        — {meta.subtitle}
                    </span>
                </div>
            </div>

            <div className="topbar-status">
                <div className="status-dot" />
                <span>Live Data</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 'var(--radius-full)' }}>
                <Wifi size={12} style={{ color: 'var(--eco-blue-400)' }} />
                <span style={{ fontSize: 12, color: 'var(--eco-blue-400)', fontWeight: 600 }}>API Connected</span>
            </div>

            <div className="topbar-time">
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, monospace' }}>{timeStr}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dateStr}</div>
                </div>
            </div>

            <button className="btn btn-ghost" title="Refresh Data">
                <RefreshCw size={16} />
            </button>
            <button className="btn btn-ghost" title="Notifications">
                <Bell size={16} />
            </button>
        </header>
    );
}
