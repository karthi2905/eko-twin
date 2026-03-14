import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://eko-twin.onrender.com';

const api = axios.create({
    baseURL: API_URL,
});

export const fetchHealth = () => api.get('/api/health').then(res => res.data);
export const fetchZones = () => api.get('/api/zones').then(res => res.data);
export const fetchZone = (id) => api.get(`/api/zones/${id}`).then(res => res.data);
export const fetchSummary = () => api.get('/api/emissions/summary').then(res => res.data);
export const fetchHourlyEmissions = () => api.get('/api/emissions/hourly').then(res => res.data);
export const fetchWeeklyEmissions = () => api.get('/api/emissions/weekly').then(res => res.data);
export const simulateScenario = (params) => api.post('/api/simulate', {
    tree_count: params.treeCount || 0,
    traffic_reduction: params.trafficReduction || 0,
    renewable_energy: params.renewableEnergy || 0,
    biofilters: params.biofilters || 0,
    carbon_capture: params.carbonCapture || 0
}).then(res => {
    const data = res.data;
    return {
        totalReduction: data.total_reduction_pct,
        newCO2Level: data.new_co2_level,
        co2Saved: data.co2_saved,
        sustainabilityScore: data.sustainability_score,
        annualTonnesSaved: data.annual_tonnes_saved,
        costSaving: data.cost_saving_usd,
        breakdown: {
            trees: data.breakdown.trees_pct,
            traffic: data.breakdown.traffic_pct,
            energy: data.breakdown.energy_pct,
            biofilters: data.breakdown.biofilters_pct,
            carbonCapture: data.breakdown.carbon_capture_pct
        },
        aiRecommendation: data.ai_recommendation
    };
});
export const predictEmissions = (req) => api.post('/api/predict', req).then(res => res.data);
export const fetchHotspots = () => api.get('/api/hotspots').then(res => res.data);
export const fetchRecommendations = () => api.get('/api/recommendations').then(res => res.data);
export const fetchWeather = () => api.get('/api/weather').then(res => res.data);
