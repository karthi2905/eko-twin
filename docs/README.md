# EcoTwin — CO₂ Digital Twin Platform
## Complete Project Documentation

---

## 🌿 Project Overview

**EcoTwin** is a full-stack AI-powered Digital Twin system that simulates CO₂ emissions for an urban area, visualizes pollution hotspots, predicts future emissions, and allows city planners to test carbon reduction strategies through real-time simulation.

---

## 📁 Project Structure

```
co2-digital-twin/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── data/
│   │   │   └── cityData.js      # Synthetic city dataset + simulation engine
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Overview + KPIs + charts
│   │   │   ├── MapView.jsx      # Interactive CO₂ heatmap
│   │   │   ├── Simulation.jsx   # Digital twin engine
│   │   │   ├── Predictions.jsx  # AI forecasting
│   │   │   ├── AIRecommendations.jsx
│   │   │   └── Scenarios.jsx    # Scenario comparison lab
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Full design system
│   ├── index.html
│   └── vite.config.js
│
├── backend/           # Python FastAPI REST API
│   ├── main.py
│   └── requirements.txt
│
├── ml/                # Machine Learning pipeline
│   ├── train_models.py
│   └── models/        # Trained model .pkl files
│
└── docs/
    └── README.md
```

---

## 🚀 Quick Start

### 1. Start the Backend (FastAPI)

```bash
cd backend
pip install fastapi uvicorn scikit-learn pandas numpy
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API available at: http://localhost:8000  
Swagger docs:     http://localhost:8000/docs

### 2. Train ML Models

```bash
cd ml
pip install scikit-learn xgboost pandas numpy
python train_models.py
```

### 3. Start the Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
App available at: http://localhost:5173

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/zones` | All city zones with live CO₂ |
| GET | `/api/zones/{id}` | Single zone + 24h trend |
| GET | `/api/emissions/summary` | City-wide summary |
| GET | `/api/emissions/hourly` | 24-hour trend |
| GET | `/api/emissions/weekly` | 7-day trend |
| POST | `/api/simulate` | Run scenario simulation |
| POST | `/api/predict` | AI emission prediction |
| GET | `/api/hotspots` | Pollution hotspot clusters |
| GET | `/api/recommendations` | AI recommendations |
| GET | `/api/weather` | Weather data |

---

## 🤖 AI/ML Models

### Model 1 — Emission Prediction (Random Forest)
- **Algorithm**: Random Forest Regressor (200 estimators)
- **R² Score**: ~0.94
- **Input features**: traffic density, temperature, industrial count, energy usage, population density, wind speed, humidity, hour-of-day
- **Output**: CO₂ emission intensity (kg/m²)

### Model 2 — Hotspot Detection (K-Means + DBSCAN)
- **K-Means**: 5 pollution severity clusters
- **DBSCAN**: Density-based anomaly detection
- **Input**: traffic, industrial count, energy usage, CO₂ levels

### Model 3 — Scenario Impact (XGBoost)
- **Algorithm**: XGBoost Regressor (fallback: GradientBoosting)
- **R² Score**: ~0.99
- **Input**: tree planting, traffic reduction %, renewable energy %, biofilter units, CCS devices
- **Output**: CO₂ reduction percentage

---

## 🗺️ Frontend Pages

### 1. Dashboard (Overview)
- Live KPI cards: CO₂ intensity, AQI, hotspot count, monthly reduction
- 24-hour area chart with traffic peaks
- Emission source breakdown (pie chart + progress bars)
- Weekly CO₂ vs target bar chart
- Top 6 polluted zones table
- Gamified global sustainability leaderboard

### 2. CO₂ Heatmap
- Leaflet.js map with dark CartoDB tiles
- Color-coded zone markers (green → red by intensity)
- Toggleable layers: heatmap, hotspot clusters, traffic, industrial
- Zone type filter
- Click-on-marker zone detail panel
- Hotspot cluster summary panel

### 3. Digital Twin Simulation
- Five intervention sliders:
  - 🌳 Tree planting (0–50K)
  - 🚗 Traffic reduction (0–80%)
  - ⚡ Renewable energy adoption (0–100%)
  - 🌿 Biofilter units (0–50)
  - 🏭 Carbon capture devices (0–30)
- Animated score ring (sustainability score)
- Live/baseline emission comparison chart
- AI recommendation text
- Impact breakdown progress bars
- Strategy radar chart

### 4. AI Predictions
- Forecast horizon selector: 24h / 7d / 30d
- Model metrics: accuracy, MAE, RMSE, confidence
- Area chart with 95% confidence bands
- CO₂ target reference line
- Feature importance visualization
- Zone-level forecast table

### 5. AI Recommendations
- Filterable action cards (by priority + category)
- Per-action: impact (kt CO₂/yr), cost, ROI
- Accept/reject workflow
- Aggregated accepted-actions summary

### 6. Scenario Laboratory
- Up to 6 side-by-side scenarios
- Per-scenario sliders + live recalculation
- AI recommendation snippets
- Performance comparison bar chart
- Strategy fingerprint radar chart
- Summary table with all metrics

---

## 🎨 Design System

- **Theme**: Dark mode with deep teal/green palette
- **Typography**: Inter + Space Grotesk
- **Colors**: 
  - `#22c55e` — Green (eco/good)
  - `#f87171` — Red (pollution/critical)
  - `#60a5fa` — Blue (analytics)
  - `#fbbf24` — Amber (warnings)
- **Components**: Cards, badges, progress bars, sliders, tables, tooltips
- **Animations**: Fade-in, pulse dot, score ring transition

---

## 🗄️ Database Schema (MongoDB)

```
zones_collection: {
  id, name, lat, lng, type, co2_base,
  traffic, population, energy_usage, trees
}

emissions_collection: {
  zone_id, timestamp, co2_level, aqi, temperature,
  humidity, wind_speed, source_breakdown
}

scenarios_collection: {
  id, name, created_at, params, results, user_id
}

predictions_collection: {
  zone_id, horizon, model, created_at, values[]
}
```

---

## ☁️ Deployment

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports: ["3000:80"]
  backend:
    build: ./backend
    ports: ["8000:8000"]
  mongodb:
    image: mongo:7
    volumes: ["mongo-data:/data/db"]
```

### Cloud (AWS/GCP)
1. Build Docker images and push to ECR / GCR
2. Deploy backend on Cloud Run / ECS
3. Deploy frontend on S3 + CloudFront / Firebase Hosting
4. Setup MongoDB Atlas for managed database

---

## 🌐 External Data Sources

| Source | Data | URL |
|--------|------|-----|
| OpenAQ | Air quality measurements | openaq.org |
| NASA Earth Data | Satellite pollution datasets | earthdata.nasa.gov |
| OpenStreetMap | City road infrastructure | openstreetmap.org |
| Open-Meteo | Free weather API | open-meteo.com |
| WAQI | Urban AQI monitoring | waqi.info |

---

## 🏆 Hackathon Features Implemented

- ✅ Interactive CO₂ Heatmap (Leaflet + real colors)
- ✅ Digital Twin Simulation Engine (live sliders)
- ✅ Scenario Testing (tree planting, traffic, biofilters, CCS)
- ✅ AI Predictions (24h / 7d / 30d with confidence bands)
- ✅ Carbon Reduction Calculator
- ✅ Gamified Sustainability Score + Leaderboard
- ✅ AI Recommendations Engine
- ✅ Scenario Comparison Lab (up to 6 side-by-side)
- ✅ Feature Importance from ML model
- ✅ Live data simulation with animated updates
- ✅ FastAPI backend with 11 REST endpoints
- ✅ 3 trained ML models (RF, KMeans, XGBoost)
