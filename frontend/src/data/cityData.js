// =========================================================
// EcoTwin — All-India Urban CO₂ Dataset
// 60 zones across major cities and industrial corridors
// =========================================================

export const CITY_CENTER = [22.5, 80.5]; // Geographic center of India
export const DEFAULT_ZOOM = 5;

// ──────────────────────────────────────────────────────────
// 60 ZONES — INDIA-WIDE
// ──────────────────────────────────────────────────────────
export const CITY_ZONES = [
    // ── DELHI / NCR ─────────────────────────────────────────
    { id: 1, city: "Delhi", name: "Anand Vihar (Delhi)", lat: 28.647, lng: 77.316, co2: 118.4, type: "industrial", traffic: 94, population: 312000, energy: 1140, trees: 80 },
    { id: 2, city: "Delhi", name: "Okhla Industrial Estate", lat: 28.549, lng: 77.271, co2: 109.7, type: "industrial", traffic: 88, population: 145000, energy: 980, trees: 95 },
    { id: 3, city: "Delhi", name: "Connaught Place", lat: 28.632, lng: 77.219, co2: 79.3, type: "commercial", traffic: 85, population: 68000, energy: 720, trees: 310 },
    { id: 4, city: "Delhi", name: "Dwarka Residential", lat: 28.590, lng: 77.046, co2: 44.1, type: "residential", traffic: 52, population: 188000, energy: 390, trees: 870 },
    { id: 5, city: "Gurugram", name: "Udyog Vihar (Gurugram)", lat: 28.505, lng: 77.083, co2: 91.8, type: "commercial", traffic: 82, population: 92000, energy: 860, trees: 220 },
    { id: 6, city: "Noida", name: "Noida Sector 62 (Tech Zone)", lat: 28.627, lng: 77.370, co2: 63.2, type: "commercial", traffic: 70, population: 78000, energy: 580, trees: 540 },
    { id: 7, city: "Faridabad", name: "Faridabad Industrial", lat: 28.408, lng: 77.308, co2: 104.6, type: "industrial", traffic: 86, population: 97000, energy: 950, trees: 110 },

    // ── MUMBAI / MMR ─────────────────────────────────────────
    { id: 8, city: "Mumbai", name: "Dharavi Industrial", lat: 19.041, lng: 72.853, co2: 98.4, type: "industrial", traffic: 87, population: 92000, energy: 840, trees: 120 },
    { id: 9, city: "Mumbai", name: "Chembur Refinery", lat: 19.062, lng: 72.899, co2: 102.8, type: "industrial", traffic: 70, population: 55000, energy: 960, trees: 89 },
    { id: 10, city: "Mumbai", name: "Andheri East (Commercial)", lat: 19.115, lng: 72.869, co2: 81.7, type: "commercial", traffic: 82, population: 89000, energy: 710, trees: 420 },
    { id: 11, city: "Mumbai", name: "Bandra West (Residential)", lat: 19.054, lng: 72.828, co2: 42.1, type: "residential", traffic: 55, population: 78000, energy: 380, trees: 890 },
    { id: 12, city: "Thane", name: "Thane Industrial", lat: 19.218, lng: 72.978, co2: 117.3, type: "industrial", traffic: 91, population: 67000, energy: 1080, trees: 55 },
    { id: 13, city: "Navi Mumbai", name: "Sewri Port / Navi Mumbai", lat: 18.990, lng: 72.861, co2: 109.2, type: "industrial", traffic: 85, population: 22000, energy: 990, trees: 70 },

    // ── BANGALORE ────────────────────────────────────────────
    { id: 14, city: "Bengaluru", name: "Peenya Industrial Area", lat: 13.028, lng: 77.519, co2: 88.6, type: "industrial", traffic: 80, population: 74000, energy: 810, trees: 190 },
    { id: 15, city: "Bengaluru", name: "Whitefield IT Hub", lat: 12.969, lng: 77.750, co2: 52.4, type: "commercial", traffic: 73, population: 62000, energy: 560, trees: 610 },
    { id: 16, city: "Bengaluru", name: "Electronic City", lat: 12.840, lng: 77.678, co2: 57.1, type: "commercial", traffic: 68, population: 55000, energy: 490, trees: 680 },
    { id: 17, city: "Bengaluru", name: "Koramangala (Residential)", lat: 12.935, lng: 77.624, co2: 33.4, type: "residential", traffic: 44, population: 48000, energy: 290, trees: 1120 },
    { id: 18, city: "Bengaluru", name: "Yelahanka (North Bengaluru)", lat: 13.100, lng: 77.594, co2: 46.2, type: "mixed", traffic: 56, population: 82000, energy: 380, trees: 820 },

    // ── CHENNAI ──────────────────────────────────────────────
    { id: 19, city: "Chennai", name: "Manali Industrial (Chennai)", lat: 13.165, lng: 80.263, co2: 112.7, type: "industrial", traffic: 88, population: 41000, energy: 1020, trees: 65 },
    { id: 20, city: "Chennai", name: "Chennai Port Trust", lat: 13.103, lng: 80.294, co2: 97.4, type: "industrial", traffic: 76, population: 28000, energy: 870, trees: 90 },
    { id: 21, city: "Chennai", name: "Anna Salai (Commercial)", lat: 13.060, lng: 80.241, co2: 68.9, type: "commercial", traffic: 79, population: 58000, energy: 610, trees: 380 },
    { id: 22, city: "Chennai", name: "Adyar (Residential)", lat: 13.003, lng: 80.255, co2: 36.1, type: "residential", traffic: 46, population: 67000, energy: 310, trees: 990 },
    { id: 23, city: "Chennai", name: "SIPCOT IT Park (Siruseri)", lat: 12.829, lng: 80.228, co2: 53.7, type: "commercial", traffic: 61, population: 38000, energy: 460, trees: 720 },

    // ── KOLKATA ──────────────────────────────────────────────
    { id: 24, city: "Kolkata", name: "Howrah Industrial Belt", lat: 22.588, lng: 88.314, co2: 106.8, type: "industrial", traffic: 84, population: 85000, energy: 960, trees: 130 },
    { id: 25, city: "Kolkata", name: "Kolkata Dockyard / Garden Reach", lat: 22.530, lng: 88.327, co2: 99.2, type: "industrial", traffic: 78, population: 52000, energy: 890, trees: 100 },
    { id: 26, city: "Kolkata", name: "Salt Lake IT Sector", lat: 22.581, lng: 88.433, co2: 48.6, type: "commercial", traffic: 60, population: 72000, energy: 430, trees: 760 },
    { id: 27, city: "Kolkata", name: "Ballygunge (Residential)", lat: 22.528, lng: 88.367, co2: 34.2, type: "residential", traffic: 42, population: 63000, energy: 270, trees: 1050 },
    { id: 28, city: "Kolkata", name: "Barasat Industrial North", lat: 22.721, lng: 88.476, co2: 76.4, type: "industrial", traffic: 71, population: 49000, energy: 680, trees: 210 },

    // ── HYDERABAD ────────────────────────────────────────────
    { id: 29, city: "Hyderabad", name: "Patancheru Industrial", lat: 17.534, lng: 78.265, co2: 101.5, type: "industrial", traffic: 85, population: 62000, energy: 940, trees: 105 },
    { id: 30, city: "Hyderabad", name: "HITECH City (Cyberabad)", lat: 17.447, lng: 78.376, co2: 54.8, type: "commercial", traffic: 72, population: 88000, energy: 540, trees: 650 },
    { id: 31, city: "Hyderabad", name: "Oldcity / Charminar", lat: 17.361, lng: 78.474, co2: 78.3, type: "mixed", traffic: 81, population: 74000, energy: 680, trees: 240 },
    { id: 32, city: "Hyderabad", name: "Gachibowli (Residential)", lat: 17.435, lng: 78.346, co2: 38.7, type: "residential", traffic: 48, population: 57000, energy: 320, trees: 980 },

    // ── PUNE ─────────────────────────────────────────────────
    { id: 33, city: "Pune", name: "Bhosari Industrial Zone", lat: 18.656, lng: 73.843, co2: 92.3, type: "industrial", traffic: 81, population: 58000, energy: 840, trees: 155 },
    { id: 34, city: "Pune", name: "Hinjewadi IT Park", lat: 18.591, lng: 73.738, co2: 49.7, type: "commercial", traffic: 66, population: 71000, energy: 470, trees: 720 },
    { id: 35, city: "Pune", name: "Koregaon Park (Residential)", lat: 18.537, lng: 73.895, co2: 31.4, type: "residential", traffic: 40, population: 46000, energy: 260, trees: 1180 },

    // ── AHMEDABAD ────────────────────────────────────────────
    { id: 36, city: "Ahmedabad", name: "Odhav Industrial Estate", lat: 23.001, lng: 72.670, co2: 107.9, type: "industrial", traffic: 87, population: 68000, energy: 980, trees: 88 },
    { id: 37, city: "Ahmedabad", name: "Naroda Industrial Zone", lat: 23.066, lng: 72.664, co2: 114.2, type: "industrial", traffic: 90, population: 51000, energy: 1040, trees: 72 },
    { id: 38, city: "Ahmedabad", name: "SG Highway (Commercial)", lat: 23.039, lng: 72.505, co2: 58.4, type: "commercial", traffic: 69, population: 82000, energy: 510, trees: 590 },
    { id: 39, city: "Ahmedabad", name: "Vatva Industrial Area", lat: 22.974, lng: 72.640, co2: 103.6, type: "industrial", traffic: 82, population: 44000, energy: 940, trees: 99 },

    // ── SURAT ────────────────────────────────────────────────
    { id: 40, city: "Surat", name: "Surat Textile Industrial", lat: 21.195, lng: 72.832, co2: 96.1, type: "industrial", traffic: 80, population: 77000, energy: 870, trees: 130 },
    { id: 41, city: "Surat", name: "Hazira Petrochemical Complex", lat: 21.120, lng: 72.691, co2: 121.4, type: "industrial", traffic: 74, population: 38000, energy: 1180, trees: 48 },

    // ── JAIPUR ───────────────────────────────────────────────
    { id: 42, city: "Jaipur", name: "Sitapura Industrial Area", lat: 26.762, lng: 75.872, co2: 84.2, type: "industrial", traffic: 76, population: 52000, energy: 760, trees: 195 },
    { id: 43, city: "Jaipur", name: "Malviya Nagar (Commercial)", lat: 26.857, lng: 75.802, co2: 55.6, type: "commercial", traffic: 63, population: 66000, energy: 470, trees: 620 },

    // ── LUCKNOW ──────────────────────────────────────────────
    { id: 44, city: "Lucknow", name: "Amausi Industrial (Lucknow)", lat: 26.760, lng: 80.862, co2: 87.3, type: "industrial", traffic: 78, population: 48000, energy: 790, trees: 175 },
    { id: 45, city: "Lucknow", name: "Gomti Nagar (IT/Commercial)", lat: 26.868, lng: 81.007, co2: 51.4, type: "commercial", traffic: 61, population: 72000, energy: 440, trees: 640 },

    // ── KANPUR ───────────────────────────────────────────────
    { id: 46, city: "Kanpur", name: "Kanpur Industrial Zone", lat: 26.450, lng: 80.346, co2: 113.8, type: "industrial", traffic: 89, population: 62000, energy: 1050, trees: 62 },

    // ── NAGPUR ───────────────────────────────────────────────
    { id: 47, city: "Nagpur", name: "Butibori Industrial Estate", lat: 21.014, lng: 79.037, co2: 89.7, type: "industrial", traffic: 77, population: 44000, energy: 820, trees: 165 },
    { id: 48, city: "Nagpur", name: "Hingna Industrial Zone", lat: 21.128, lng: 78.946, co2: 82.4, type: "industrial", traffic: 73, population: 36000, energy: 740, trees: 190 },

    // ── VISAKHAPATNAM ─────────────────────────────────────────
    { id: 49, city: "Visakhapatnam", name: "Vizag Steel Plant", lat: 17.734, lng: 83.315, co2: 119.6, type: "industrial", traffic: 83, population: 41000, energy: 1140, trees: 58 },
    { id: 50, city: "Visakhapatnam", name: "HPCL Refinery (Vizag)", lat: 17.681, lng: 83.292, co2: 115.2, type: "industrial", traffic: 79, population: 28000, energy: 1080, trees: 69 },

    // ── INDORE ───────────────────────────────────────────────
    { id: 51, city: "Indore", name: "Pithampur Industrial Zone", lat: 22.614, lng: 75.688, co2: 86.4, type: "industrial", traffic: 74, population: 51000, energy: 780, trees: 185 },
    { id: 52, city: "Indore", name: "Vijay Nagar (Commercial)", lat: 22.752, lng: 75.884, co2: 48.1, type: "commercial", traffic: 58, population: 74000, energy: 410, trees: 670 },

    // ── KOCHI ────────────────────────────────────────────────
    { id: 53, city: "Kochi", name: "Kochi Petrochemicals (FACT)", lat: 10.004, lng: 76.339, co2: 94.8, type: "industrial", traffic: 72, population: 34000, energy: 860, trees: 145 },
    { id: 54, city: "Kochi", name: "Marine Drive (Commercial)", lat: 9.956, lng: 76.262, co2: 42.7, type: "commercial", traffic: 55, population: 49000, energy: 370, trees: 810 },

    // ── COIMBATORE ───────────────────────────────────────────
    { id: 55, city: "Coimbatore", name: "Coimbatore Textile Belt", lat: 11.017, lng: 76.979, co2: 78.9, type: "industrial", traffic: 71, population: 52000, energy: 700, trees: 240 },

    // ── PATNA ────────────────────────────────────────────────
    { id: 56, city: "Patna", name: "Hajipur Industrial Area", lat: 25.711, lng: 85.208, co2: 88.6, type: "industrial", traffic: 76, population: 47000, energy: 790, trees: 160 },
    { id: 57, city: "Patna", name: "Patna Commercial Core", lat: 25.610, lng: 85.143, co2: 74.1, type: "commercial", traffic: 80, population: 59000, energy: 660, trees: 290 },

    // ── BHOPAL ───────────────────────────────────────────────
    { id: 58, city: "Bhopal", name: "Mandideep Industrial Area", lat: 23.053, lng: 77.472, co2: 91.4, type: "industrial", traffic: 75, population: 43000, energy: 820, trees: 185 },

    // ── VADODARA ─────────────────────────────────────────────
    { id: 59, city: "Vadodara", name: "GIDC Savli Industrial Estate", lat: 22.299, lng: 73.273, co2: 95.7, type: "industrial", traffic: 78, population: 56000, energy: 870, trees: 140 },

    // ── AMRITSAR / LUDHIANA ──────────────────────────────────
    { id: 60, city: "Ludhiana", name: "Ludhiana Industrial South", lat: 30.892, lng: 75.829, co2: 108.3, type: "industrial", traffic: 84, population: 61000, energy: 990, trees: 95 },
];

// ──────────────────────────────────────────────────────────
// CITY SUMMARIES — aggregate per city
// ──────────────────────────────────────────────────────────
export const CITY_SUMMARIES = Object.values(
    CITY_ZONES.reduce((acc, z) => {
        if (!acc[z.city]) acc[z.city] = { city: z.city, zones: [], lat: z.lat, lng: z.lng };
        acc[z.city].zones.push(z);
        return acc;
    }, {})
).map(c => ({
    city: c.city,
    lat: c.lat,
    lng: c.lng,
    avg_co2: +(c.zones.reduce((s, z) => s + z.co2, 0) / c.zones.length).toFixed(1),
    max_co2: Math.max(...c.zones.map(z => z.co2)),
    zone_count: c.zones.length,
    total_population: c.zones.reduce((s, z) => s + z.population, 0),
    critical_zones: c.zones.filter(z => z.co2 > 100).length,
}));

// ──────────────────────────────────────────────────────────
// TIME-SERIES DATA GENERATORS
// ──────────────────────────────────────────────────────────
export function generateHourlyData(baseValue = 75) {
    return Array.from({ length: 24 }, (_, h) => {
        const trafficFactor = h >= 7 && h <= 9 ? 1.45 : h >= 17 && h <= 19 ? 1.38 : h >= 0 && h <= 5 ? 0.55 : 1.0;
        const noise = (Math.random() - 0.5) * 8;
        return {
            hour: `${String(h).padStart(2, '0')}:00`,
            co2: +(baseValue * trafficFactor + noise).toFixed(1),
            vehicles: +(trafficFactor * 12000 + (Math.random() - 0.5) * 800).toFixed(0),
            industrial: +(baseValue * 0.38 + noise * 0.3).toFixed(1),
            residential: +(baseValue * 0.18 * (1 - trafficFactor * 0.08) + noise * 0.2).toFixed(1),
        };
    });
}

export function generateWeeklyData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const base = [82, 85, 84, 87, 90, 65, 57];
    return days.map((day, i) => ({
        day,
        co2: +(base[i] + (Math.random() - 0.5) * 5).toFixed(1),
        target: 55,
        reduction: Math.max(0, (base[i] - 55 + (Math.random() - 0.5) * 3)),
    }));
}

export function generateMonthlyData() {
    return Array.from({ length: 30 }, (_, i) => {
        const trend = 86 - i * 0.35;
        return {
            day: `Mar ${i + 1}`,
            actual: +(trend + (Math.random() - 0.5) * 6).toFixed(1),
            predicted: +(trend - 2 + (Math.random() - 0.5) * 3).toFixed(1),
            target: 55,
        };
    });
}

// ──────────────────────────────────────────────────────────
// EMISSION SOURCES (National breakdown)
// ──────────────────────────────────────────────────────────
export const EMISSION_SOURCES = [
    { name: 'Vehicle Transport', value: 35, color: '#f87171', icon: '🚗' },
    { name: 'Industrial', value: 32, color: '#fb923c', icon: '🏭' },
    { name: 'Residential', value: 16, color: '#fbbf24', icon: '🏠' },
    { name: 'Energy Generation', value: 13, color: '#a78bfa', icon: '⚡' },
    { name: 'Waste', value: 4, color: '#34d399', icon: '♻️' },
];

// ──────────────────────────────────────────────────────────
// POLLUTION HOTSPOTS (National)
// ──────────────────────────────────────────────────────────
export const HOTSPOT_CLUSTERS = [
    { id: 'H1', center: [28.647, 77.316], radius: 9000, severity: 'critical', label: 'Delhi — Anand Vihar', co2: 118.4, city: 'Delhi' },
    { id: 'H2', center: [28.408, 77.308], radius: 8000, severity: 'critical', label: 'Faridabad Industrial Belt', co2: 104.6, city: 'Faridabad' },
    { id: 'H3', center: [21.120, 72.691], radius: 8500, severity: 'critical', label: 'Hazira Petrochemical Complex', co2: 121.4, city: 'Surat' },
    { id: 'H4', center: [17.734, 83.315], radius: 8000, severity: 'critical', label: 'Vizag Steel Plant', co2: 119.6, city: 'Visakhapatnam' },
    { id: 'H5', center: [26.450, 80.346], radius: 8000, severity: 'critical', label: 'Kanpur Industrial Zone', co2: 113.8, city: 'Kanpur' },
    { id: 'H6', center: [23.066, 72.664], radius: 7500, severity: 'critical', label: 'Naroda Industrial (Ahmedabad)', co2: 114.2, city: 'Ahmedabad' },
    { id: 'H7', center: [13.165, 80.263], radius: 7500, severity: 'critical', label: 'Manali Industrial (Chennai)', co2: 112.7, city: 'Chennai' },
    { id: 'H8', center: [22.588, 88.314], radius: 7000, severity: 'high', label: 'Howrah Industrial Belt', co2: 106.8, city: 'Kolkata' },
    { id: 'H9', center: [17.534, 78.265], radius: 7000, severity: 'high', label: 'Patancheru Industrial (Hyd)', co2: 101.5, city: 'Hyderabad' },
    { id: 'H10', center: [19.218, 72.978], radius: 6500, severity: 'high', label: 'Thane Industrial Corridor', co2: 117.3, city: 'Mumbai' },
];

// ──────────────────────────────────────────────────────────
// PREDICTIONS
// ──────────────────────────────────────────────────────────
export function generatePredictions(horizon = '24h') {
    const labels =
        horizon === '24h' ? Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`) :
            horizon === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
                Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

    const base = 78;
    return labels.map((label, i) => {
        const trend = base - i * (horizon === '30d' ? 0.45 : 0.12);
        return {
            label,
            predicted: +(trend + (Math.random() - 0.5) * 5).toFixed(1),
            lower: +(trend - 5 + (Math.random() - 0.5) * 2).toFixed(1),
            upper: +(trend + 5 + (Math.random() - 0.5) * 2).toFixed(1),
        };
    });
}

// ──────────────────────────────────────────────────────────
// SCENARIO SIMULATION ENGINE
// ──────────────────────────────────────────────────────────
export function simulateScenario(params) {
    const {
        treeCount = 0,
        trafficReduction = 0,
        renewableEnergy = 0,
        biofilters = 0,
        carbonCapture = 0,
    } = params;

    const treeImpact = treeCount * 0.08;
    const trafficImpact = trafficReduction * 0.45;
    const energyImpact = renewableEnergy * 0.22;
    const biofilterImpact = biofilters * 0.15;
    const captureImpact = carbonCapture * 0.12;

    const totalReduction = Math.min(treeImpact + trafficImpact + energyImpact + biofilterImpact + captureImpact, 92);
    const baselineCO2 = 78.4; // India national avg
    const newCO2 = baselineCO2 * (1 - totalReduction / 100);

    return {
        totalReduction: +totalReduction.toFixed(1),
        newCO2Level: +newCO2.toFixed(1),
        co2Saved: +(baselineCO2 - newCO2).toFixed(1),
        breakdown: {
            trees: +treeImpact.toFixed(1),
            traffic: +trafficImpact.toFixed(1),
            energy: +energyImpact.toFixed(1),
            biofilters: +biofilterImpact.toFixed(1),
            carbonCapture: +captureImpact.toFixed(1),
        },
        sustainabilityScore: Math.min(Math.round(totalReduction * 1.08), 100),
        annualTonnesSaved: +(totalReduction * 284.2).toFixed(0),  // Scaled for India
        costSaving: +(totalReduction * 18400).toFixed(0),
        aiRecommendation: getAIRecommendation(totalReduction),
    };
}

function getAIRecommendation(reduction) {
    if (reduction < 10) return "Consider increasing traffic reduction and renewable energy targets for measurable national impact.";
    if (reduction < 25) return "Good start! Deploying biofilters in Anand Vihar, Manali, and Vizag industrial zones will amplify results.";
    if (reduction < 45) return "Solid progress. Focus next on carbon capture near Hazira, Kanpur, and Howrah for maximum all-India ROI.";
    if (reduction < 65) return "Excellent trajectory! Combine afforestation in NCR & Indo-Gangetic Plain corridors to reach 60% reduction.";
    return "Outstanding! This strategy achieves near-optimal emission reduction across the Indian urban grid.";
}

// ──────────────────────────────────────────────────────────
// LEADERBOARD — Indian Cities
// ──────────────────────────────────────────────────────────
export const LEADERBOARD = [
    { rank: 1, city: "Kochi", score: 82, reduction: 48, badge: "🏆" },
    { rank: 2, city: "Bengaluru", score: 76, reduction: 42, badge: "🥈" },
    { rank: 3, city: "Pune", score: 71, reduction: 37, badge: "🥉" },
    { rank: 4, city: "Mumbai", score: 64, reduction: 31, badge: "🌿" },
    { rank: 5, city: "Hyderabad", score: 60, reduction: 28, badge: "🌱" },
    { rank: 6, city: "Chennai", score: 55, reduction: 24, badge: "🌱" },
    { rank: 7, city: "Ahmedabad", score: 44, reduction: 18, badge: "⚠️" },
    { rank: 8, city: "Delhi (NCR)", score: 28, reduction: 8, badge: "🔴", highlight: true },
];

// ──────────────────────────────────────────────────────────
// AI RECOMMENDATIONS (National)
// ──────────────────────────────────────────────────────────
export const AI_RECOMMENDATIONS = [
    { id: 1, zone: "Delhi — Anand Vihar", priority: "critical", action: "Emergency PM2.5 biofilter deployment — 24 units along Ring Road corridors", impact: "−28.4 kt CO₂/yr", cost: "₹18 Cr", roi: "1.8 years", category: "biofilter" },
    { id: 2, zone: "Hazira Petrochemical, Surat", priority: "critical", action: "Phase-in natural gas substitution for 40% of coal boilers", impact: "−34.1 kt CO₂/yr", cost: "₹240 Cr", roi: "3.9 years", category: "energy" },
    { id: 3, zone: "Kanpur Industrial Zone", priority: "critical", action: "Mandate zero-emission zones in tannery belt; enforce EV freight by 2026", impact: "−19.2 kt CO₂/yr", cost: "₹4 Cr", roi: "0.3 years", category: "traffic" },
    { id: 4, zone: "Vizag Steel Plant", priority: "critical", action: "Install 6 direct air carbon capture units with ocean mineralization", impact: "−22.6 kt CO₂/yr", cost: "₹320 Cr", roi: "5.4 years", category: "capture" },
    { id: 5, zone: "Howrah Industrial, Kolkata", priority: "high", action: "Riverfront green buffer — plant 15,000 trees along Hooghly industrial corridor", impact: "−9.8 kt CO₂/yr", cost: "₹22 Cr", roi: "3.2 years", category: "trees" },
    { id: 6, zone: "Naroda Industrial, Ahmedabad", priority: "critical", action: "Solar thermal replacement for 50% of process heating in dyeing units", impact: "−26.3 kt CO₂/yr", cost: "₹185 Cr", roi: "4.1 years", category: "energy" },
    { id: 7, zone: "NCR — Gurugram Corridor", priority: "high", action: "BRT lane expansion + EV charging every 500m on NH-48", impact: "−14.7 kt CO₂/yr", cost: "₹48 Cr", roi: "2.1 years", category: "traffic" },
    { id: 8, zone: "Manali Industrial, Chennai", priority: "critical", action: "Relocate 8 high-emitter units to SIPCOT SEZ with mandatory scrubbers", impact: "−31.5 kt CO₂/yr", cost: "₹290 Cr", roi: "5.8 years", category: "biofilter" },
    { id: 9, zone: "Patancheru Industrial, Hyd", priority: "high", action: "Waste-heat-to-power recovery across pharma cluster — 12 units", impact: "−16.9 kt CO₂/yr", cost: "₹96 Cr", roi: "3.6 years", category: "energy" },
    { id: 10, zone: "Indo-Gangetic Plain Belt", priority: "medium", action: "Afforestation program — 1 million trees across UP-Bihar highway corridors", impact: "−11.4 kt CO₂/yr", cost: "₹140 Cr", roi: "6.2 years", category: "trees" },
];
