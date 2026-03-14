import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import pickle
import os

print("Generating synthetic historical data for ML training...")

# Features:
# - hour_sin, hour_cos (cyclical time)
# - day_of_week
# - month
# - base_co2 (from the zone definition)
# - traffic_load (0-100)
# - temperature (C)
# - wind_speed (km/h)
# - industrial_active (1 if weekday else 0.5)

np.random.seed(42)

# Generate 30 days of hourly data for a few base_co2 archetypes to train a generalized model
dates = pd.date_range(start="2026-01-01", periods=30*24, freq='h')
base_co2_archetypes = [40, 60, 80, 100, 120]

records = []
for base in base_co2_archetypes:
    for dt in dates:
        hour = dt.hour
        dow = dt.dayofweek
        month = dt.month
        
        # Traffic logic
        if dow < 5: # Weekday
            if 7 <= hour <= 10 or 17 <= hour <= 20: traffic = np.random.normal(85, 5)
            elif 1 <= hour <= 5: traffic = np.random.normal(20, 5)
            else: traffic = np.random.normal(60, 10)
            ind_active = 1.0
        else: # Weekend
            traffic = np.random.normal(40, 10)
            ind_active = 0.6 if dow == 5 else 0.3
            
        traffic = max(0, min(100, traffic))
        
        # Weather logic
        temp = 25 - 5 * np.cos((hour - 14) * np.pi / 12) + np.random.normal(0, 2)
        wind = np.random.lognormal(mean=2.0, sigma=0.5)
        
        # Calculate target CO2
        traffic_factor = (traffic / 100) * 0.4
        ind_factor = ind_active * 0.4
        weather_factor = (wind / 20) * -0.1 + (temp / 40) * 0.05
        
        target = base * (0.3 + traffic_factor + ind_factor) * (1 + weather_factor)
        target += np.random.normal(0, base * 0.05) # Add noise
        target = max(10, min(target, base * 2.0))
        
        records.append({
            'hour': hour,
            'day_of_week': dow,
            'month': month,
            'base_co2': base,
            'traffic_load': traffic,
            'temperature': temp,
            'wind_speed': wind,
            'industrial_active': ind_active,
            'target_co2': target
        })

df = pd.DataFrame(records)

# Cyclical encoding for hour
df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)

# Features and target
features = ['hour_sin', 'hour_cos', 'day_of_week', 'month', 'base_co2', 'traffic_load', 'temperature', 'wind_speed', 'industrial_active']
X = df[features]
y = df['target_co2']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training generalized Random Forest Model...")
rf = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
rf.fit(X_train, y_train)
score = rf.score(X_test, y_test)
print(f"Random Forest R^2: {score:.3f}")

print("Training XGBoost Regressor for scenario impact...")
# A simple model estimating total reduction % based on interventions
# [treeCount, trafficReduction, renewableEnergy, biofilters, carbonCapture]
import random

scenario_records = []
for _ in range(5000):
    t = random.uniform(0, 50)
    tr = random.uniform(0, 80)
    re = random.uniform(0, 100)
    b = random.uniform(0, 50)
    c = random.uniform(0, 30)
    
    # Non-linear impact calculation
    val = (t*0.09) + (tr*0.48) + (re*0.25) + (b*0.17) + (c*0.14)
    # Diminishing returns synergistic effect
    val = val * (1 - (val/200)) 
    target_reduction = min(92, val + random.gauss(0, 1.5))
    
    scenario_records.append([t, tr, re, b, c, target_reduction])

sdf = pd.DataFrame(scenario_records, columns=['trees', 'traffic', 'renewables', 'biofilters', 'ccs', 'reduction'])
X_sc = sdf.iloc[:, :-1]
y_sc = sdf['reduction']

xgb = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5)
xgb.fit(X_sc, y_sc)
sc_score = xgb.score(X_sc, y_sc)
print(f"XGBoost Scenario Model R^2: {sc_score:.3f}")

# Save models
os.makedirs("models", exist_ok=True)
with open("models/forecast_model.pkl", "wb") as f:
    pickle.dump(rf, f)
    
with open("models/scenario_model.pkl", "wb") as f:
    pickle.dump(xgb, f)
    
print("Models trained and saved successfully.")
