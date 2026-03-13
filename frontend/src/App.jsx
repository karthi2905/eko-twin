import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MapView from './pages/MapView.jsx';
import Simulation from './pages/Simulation.jsx';
import Predictions from './pages/Predictions.jsx';
import AIRecommendations from './pages/AIRecommendations.jsx';
import Scenarios from './pages/Scenarios.jsx';

const PAGES = {
  dashboard: Dashboard,
  map: MapView,
  simulation: Simulation,
  predictions: Predictions,
  ai: AIRecommendations,
  scenarios: Scenarios,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
      />
      <div className="main-content">
        <Topbar
          activePage={activePage}
          currentTime={currentTime}
        />
        <div className="page-content animate-in">
          <PageComponent />
        </div>
      </div>
    </div>
  );
}
