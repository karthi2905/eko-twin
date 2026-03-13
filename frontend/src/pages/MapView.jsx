import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, LayerGroup, useMap, Tooltip as MapTooltip } from 'react-leaflet';
import { Layers, Thermometer, AlertTriangle, Factory, Car, Filter, ZoomIn, MapPin, Globe } from 'lucide-react';
import { CITY_ZONES, CITY_CENTER, DEFAULT_ZOOM, HOTSPOT_CLUSTERS, CITY_SUMMARIES } from '../data/cityData.js';

function getColorByCO2(co2) {
    if (co2 >= 110) return '#dc2626';
    if (co2 >= 90) return '#ef4444';
    if (co2 >= 70) return '#f97316';
    if (co2 >= 50) return '#eab308';
    if (co2 >= 30) return '#84cc16';
    return '#22c55e';
}

function getRadiusByCO2(co2) {
    return Math.max(6, Math.min(22, co2 / 6));
}

const severityColor = { critical: '#ef4444', high: '#f97316', medium: '#eab308' };

const LAYER_OPTIONS = [
    { id: 'heatmap', label: 'CO₂ Heatmap', icon: Thermometer },
    { id: 'hotspots', label: 'Hotspot Clusters', icon: AlertTriangle },
    { id: 'cityview', label: 'City Summary', icon: Globe },
    { id: 'industrial', label: 'Industrial Zones', icon: Factory },
];

// Cities for the dropdown filter
const ALL_CITIES = ['All India', ...Array.from(new Set(CITY_ZONES.map(z => z.city))).sort()];

export default function MapView() {
    const [activeLayers, setActiveLayers] = useState(['heatmap', 'hotspots']);
    const [selectedZone, setSelectedZone] = useState(null);
    const [filterCity, setFilterCity] = useState('All India');
    const [filterType, setFilterType] = useState('all');
    const [viewMode, setViewMode] = useState('india'); // 'india' | 'city'

    const toggleLayer = (id) => {
        setActiveLayers(prev =>
            prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
        );
    };

    const filteredZones = CITY_ZONES.filter(z => {
        const cityMatch = filterCity === 'All India' || z.city === filterCity;
        const typeMatch = filterType === 'all' || z.type === filterType;
        return cityMatch && typeMatch;
    });

    const topZones = [...filteredZones].sort((a, b) => b.co2 - a.co2).slice(0, 8);

    const stats = {
        avgCO2: +(filteredZones.reduce((s, z) => s + z.co2, 0) / filteredZones.length).toFixed(1),
        maxCO2: Math.max(...filteredZones.map(z => z.co2)),
        critical: filteredZones.filter(z => z.co2 >= 100).length,
        zones: filteredZones.length,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* National Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                    { label: filterCity === 'All India' ? 'Cities Monitored' : 'Zones in ' + filterCity, value: stats.zones, color: 'var(--eco-blue-400)' },
                    { label: 'Avg CO₂ Intensity', value: `${stats.avgCO2} kg/m²`, color: 'var(--eco-amber-400)' },
                    { label: 'Peak CO₂ Zone', value: `${stats.maxCO2} kg/m²`, color: 'var(--eco-red-400)' },
                    { label: 'Critical Zones', value: stats.critical, color: 'var(--eco-red-400)' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '12px 16px', borderColor: `${s.color}20` }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontFamily: 'Space Grotesk', fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="card" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Layers size={14} style={{ color: 'var(--eco-green-400)' }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>Layers:</span>
                    </div>
                    {LAYER_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        const active = activeLayers.includes(opt.id);
                        return (
                            <button key={opt.id}
                                className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: 11.5 }}
                                onClick={() => toggleLayer(opt.id)}
                            >
                                <Icon size={12} /> {opt.label}
                            </button>
                        );
                    })}

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                        <select
                            value={filterCity}
                            onChange={e => setFilterCity(e.target.value)}
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 12, cursor: 'pointer', minWidth: 140 }}
                        >
                            {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <Filter size={13} style={{ color: 'var(--text-muted)' }} />
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}
                        >
                            <option value="all">All Types</option>
                            <option value="industrial">Industrial</option>
                            <option value="commercial">Commercial</option>
                            <option value="residential">Residential</option>
                            <option value="mixed">Mixed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, alignItems: 'start' }}>
                {/* MAP */}
                <div className="map-wrapper">
                    <MapContainer
                        center={CITY_CENTER}
                        zoom={DEFAULT_ZOOM}
                        style={{ height: 560, width: '100%', background: '#0a1a1f' }}
                        zoomControl={true}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; CartoDB'
                        />

                        {/* CO₂ Zone Markers */}
                        {activeLayers.includes('heatmap') && (
                            <LayerGroup>
                                {filteredZones.map(zone => (
                                    <CircleMarker
                                        key={zone.id}
                                        center={[zone.lat, zone.lng]}
                                        radius={getRadiusByCO2(zone.co2)}
                                        pathOptions={{
                                            color: getColorByCO2(zone.co2),
                                            fillColor: getColorByCO2(zone.co2),
                                            fillOpacity: 0.7,
                                            weight: 1.5,
                                        }}
                                        eventHandlers={{ click: () => setSelectedZone(zone) }}
                                    >
                                        <Popup>
                                            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 200 }}>
                                                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: '#e2f4ee' }}>{zone.name}</div>
                                                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>{zone.city} • {zone.type}</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 10px', fontSize: 11.5 }}>
                                                    <span style={{ color: '#9ca3af' }}>CO₂:</span>
                                                    <span style={{ fontWeight: 700, color: getColorByCO2(zone.co2) }}>{zone.co2} kg/m²</span>
                                                    <span style={{ color: '#9ca3af' }}>Traffic:</span>
                                                    <span style={{ color: '#e2f4ee' }}>{zone.traffic}%</span>
                                                    <span style={{ color: '#9ca3af' }}>Population:</span>
                                                    <span style={{ color: '#e2f4ee' }}>{(zone.population / 1000).toFixed(0)}K</span>
                                                    <span style={{ color: '#9ca3af' }}>Energy:</span>
                                                    <span style={{ color: '#e2f4ee' }}>{zone.energy} MWh</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </LayerGroup>
                        )}

                        {/* Hotspot Rings */}
                        {activeLayers.includes('hotspots') && (
                            <LayerGroup>
                                {HOTSPOT_CLUSTERS.filter(h => filterCity === 'All India' || h.city === filterCity).map(cluster => (
                                    <Circle
                                        key={cluster.id}
                                        center={cluster.center}
                                        radius={cluster.radius}
                                        pathOptions={{
                                            color: severityColor[cluster.severity],
                                            fillColor: severityColor[cluster.severity],
                                            fillOpacity: 0.10,
                                            weight: 2,
                                            dashArray: '6 4',
                                        }}
                                    >
                                        <Popup>
                                            <div style={{ fontFamily: 'Inter, sans-serif' }}>
                                                <div style={{ fontWeight: 700, color: '#e2f4ee', marginBottom: 3 }}>{cluster.label}</div>
                                                <div style={{ fontSize: 12, color: severityColor[cluster.severity], fontWeight: 600 }}>
                                                    {cluster.severity.toUpperCase()} — {cluster.co2} kg/m²
                                                </div>
                                            </div>
                                        </Popup>
                                    </Circle>
                                ))}
                            </LayerGroup>
                        )}

                        {/* City Summary Pins */}
                        {activeLayers.includes('cityview') && (
                            <LayerGroup>
                                {CITY_SUMMARIES.filter(c => filterCity === 'All India' || c.city === filterCity).map(cs => (
                                    <CircleMarker
                                        key={cs.city}
                                        center={[cs.lat, cs.lng]}
                                        radius={14}
                                        pathOptions={{
                                            color: getColorByCO2(cs.avg_co2),
                                            fillColor: getColorByCO2(cs.avg_co2),
                                            fillOpacity: 0.25,
                                            weight: 2.5,
                                        }}
                                    >
                                        <Popup>
                                            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180 }}>
                                                <div style={{ fontWeight: 700, fontSize: 14, color: '#e2f4ee', marginBottom: 6 }}>{cs.city}</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 10px', fontSize: 11.5 }}>
                                                    <span style={{ color: '#9ca3af' }}>Avg CO₂:</span>
                                                    <span style={{ fontWeight: 700, color: getColorByCO2(cs.avg_co2) }}>{cs.avg_co2}</span>
                                                    <span style={{ color: '#9ca3af' }}>Peak CO₂:</span>
                                                    <span style={{ color: '#f87171' }}>{cs.max_co2}</span>
                                                    <span style={{ color: '#9ca3af' }}>Zones:</span>
                                                    <span style={{ color: '#e2f4ee' }}>{cs.zone_count}</span>
                                                    <span style={{ color: '#9ca3af' }}>Critical:</span>
                                                    <span style={{ color: '#f87171', fontWeight: 700 }}>{cs.critical_zones}</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </LayerGroup>
                        )}

                        {/* Industrial Zones highlight */}
                        {activeLayers.includes('industrial') && (
                            <LayerGroup>
                                {filteredZones.filter(z => z.type === 'industrial').map(zone => (
                                    <Circle
                                        key={`i-${zone.id}`}
                                        center={[zone.lat, zone.lng]}
                                        radius={6000}
                                        pathOptions={{
                                            color: '#a78bfa',
                                            fillColor: '#a78bfa',
                                            fillOpacity: 0.10,
                                            weight: 1.5,
                                        }}
                                    />
                                ))}
                            </LayerGroup>
                        )}
                    </MapContainer>

                    {/* Legend */}
                    <div className="map-legend">
                        <h4>CO₂ Intensity (kg/m²)</h4>
                        {[
                            { label: 'Extreme (≥110)', color: '#dc2626' },
                            { label: 'Critical (90–110)', color: '#ef4444' },
                            { label: 'High (70–90)', color: '#f97316' },
                            { label: 'Medium (50–70)', color: '#eab308' },
                            { label: 'Low (30–50)', color: '#84cc16' },
                            { label: 'Good (<30)', color: '#22c55e' },
                        ].map(l => (
                            <div key={l.label} className="legend-item">
                                <div className="legend-dot" style={{ background: l.color }} />
                                <span>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Selected Zone */}
                    {selectedZone ? (
                        <div className="card" style={{ borderColor: `${getColorByCO2(selectedZone.co2)}40` }}>
                            <div className="card-header">
                                <div>
                                    <div style={{ fontSize: 12, color: 'var(--eco-blue-400)', fontWeight: 600, marginBottom: 2 }}>
                                        📍 {selectedZone.city}
                                    </div>
                                    <div className="card-title" style={{ fontSize: 13.5 }}>{selectedZone.name}</div>
                                </div>
                                <span className={`badge ${selectedZone.co2 >= 100 ? 'badge-red' : selectedZone.co2 >= 70 ? 'badge-amber' : 'badge-green'}`}>
                                    {selectedZone.co2 >= 100 ? 'Critical' : selectedZone.co2 >= 70 ? 'High' : 'Moderate'}
                                </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {[
                                    { label: 'CO₂ Intensity', value: `${selectedZone.co2}`, unit: 'kg/m²', color: getColorByCO2(selectedZone.co2) },
                                    { label: 'Traffic Load', value: `${selectedZone.traffic}`, unit: '%', color: 'var(--eco-amber-400)' },
                                    { label: 'Population', value: `${(selectedZone.population / 1000).toFixed(0)}`, unit: 'K', color: 'var(--eco-blue-400)' },
                                    { label: 'Energy Use', value: `${selectedZone.energy}`, unit: 'MWh', color: 'var(--eco-purple-400)' },
                                    { label: 'Tree Cover', value: `${selectedZone.trees}`, unit: 'trees', color: 'var(--eco-green-400)' },
                                    { label: 'Zone Type', value: selectedZone.type, unit: '', color: 'var(--eco-teal-400)' },
                                ].map(m => (
                                    <div key={m.label} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '9px 10px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>{m.label}</div>
                                        <div style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, color: m.color }}>
                                            {m.value} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
                            <ZoomIn size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
                            <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>Click any zone marker to view detailed analysis</div>
                        </div>
                    )}

                    {/* Top Polluted This View */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title" style={{ fontSize: 13.5 }}>
                                <AlertTriangle size={14} /> Top Polluted Zones
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{filterCity}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {topZones.map((z, i) => (
                                <div
                                    key={z.id}
                                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                                    onClick={() => setSelectedZone(z)}
                                >
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, width: 18, textAlign: 'right' }}>{i + 1}</span>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: getColorByCO2(z.co2), flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{z.name}</div>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{z.city}</div>
                                    </div>
                                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 13, color: getColorByCO2(z.co2) }}>{z.co2}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* India Hotspot Summary */}
                    <div className="card">
                        <div className="card-title" style={{ fontSize: 13.5, marginBottom: 10 }}>
                            🔴 National Hotspots
                        </div>
                        {HOTSPOT_CLUSTERS.filter(h => filterCity === 'All India' || h.city === filterCity).slice(0, 6).map(h => (
                            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: severityColor[h.severity], flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.label}</div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.city}</div>
                                </div>
                                <span style={{ fontFamily: 'Space Grotesk', fontSize: 12, fontWeight: 700, color: severityColor[h.severity] }}>{h.co2}</span>
                                <span className={`badge badge-${h.severity === 'critical' ? 'red' : h.severity === 'high' ? 'amber' : 'blue'}`} style={{ fontSize: 9 }}>
                                    {h.severity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* City Comparison Grid */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title"><Globe size={15} /> Indian City CO₂ Comparison</div>
                    <span className="badge badge-blue">All Cities</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginTop: 8 }}>
                    {CITY_SUMMARIES.sort((a, b) => b.avg_co2 - a.avg_co2).map(cs => (
                        <div
                            key={cs.city}
                            style={{
                                background: 'var(--bg-secondary)',
                                border: filterCity === cs.city ? `1px solid ${getColorByCO2(cs.avg_co2)}` : '1px solid var(--border-subtle)',
                                borderRadius: 10, padding: '10px 12px',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onClick={() => setFilterCity(cs.city)}
                        >
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{cs.city}</div>
                            <div style={{ fontFamily: 'Space Grotesk', fontSize: 19, fontWeight: 800, color: getColorByCO2(cs.avg_co2) }}>{cs.avg_co2}</div>
                            <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>avg kg/m²</div>
                            <div style={{ marginTop: 4, height: 3, borderRadius: 99, background: 'var(--bg-elevated)' }}>
                                <div style={{ width: `${Math.min(cs.avg_co2 / 130 * 100, 100)}%`, height: '100%', background: getColorByCO2(cs.avg_co2), borderRadius: 99, transition: 'width 0.8s' }} />
                            </div>
                            <div style={{ marginTop: 4, fontSize: 9.5, color: getColorByCO2(cs.avg_co2) }}>
                                {cs.critical_zones > 0 ? `⚠ ${cs.critical_zones} critical` : '✓ No critical'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
