import {
    LayoutDashboard, Map, FlaskConical, TrendingUp,
    Brain, GitCompare, ChevronLeft, ChevronRight, Leaf
} from 'lucide-react';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, section: 'MAIN' },
    { id: 'map', label: 'CO₂ Heatmap', icon: Map, section: 'MAIN' },
    { id: 'simulation', label: 'Digital Twin', icon: FlaskConical, section: 'ANALYSIS', badge: 'LIVE' },
    { id: 'predictions', label: 'AI Predictions', icon: TrendingUp, section: 'ANALYSIS' },
    { id: 'ai', label: 'Recommendations', icon: Brain, section: 'INTELLIGENCE' },
    { id: 'scenarios', label: 'Scenario Lab', icon: GitCompare, section: 'INTELLIGENCE' },
];

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }) {
    let lastSection = null;

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <Leaf size={22} />
                </div>
                <div className="sidebar-brand">
                    <h1>EcoTwin</h1>
                    <span>CO₂ Digital Twin</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    const showSection = item.section !== lastSection;
                    lastSection = item.section;
                    return (
                        <div key={item.id}>
                            {showSection && (
                                <div className="nav-section-label">{item.section}</div>
                            )}
                            <div
                                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                                onClick={() => onNavigate(item.id)}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                                {item.badge && <span className="nav-badge">{item.badge}</span>}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-collapse-btn" onClick={onToggle}>
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    <span>Collapse</span>
                </button>
            </div>
        </aside>
    );
}
