"""
EcoTwin — ML Model Training Suite
Trains three models:
  1. Emission Prediction (Random Forest Regressor)
  2. Hotspot Detection (K-Means + DBSCAN)
  3. Scenario Impact (XGBoost Regressor)
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.cluster import KMeans, DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import os
import warnings
warnings.filterwarnings("ignore")

np.random.seed(42)

# ─── 1. Generate Synthetic Training Dataset ───────────────────────────────────

def generate_emission_dataset(n_samples: int = 5000) -> pd.DataFrame:
    """Generate synthetic city emission dataset."""
    traffic_density    = np.random.uniform(10, 100, n_samples)
    industrial_count   = np.random.randint(0, 50, n_samples).astype(float)
    energy_usage_mwh   = np.random.uniform(100, 1200, n_samples)
    temperature_c      = np.random.uniform(20, 42, n_samples)
    population_density = np.random.uniform(500, 120000, n_samples)
    wind_speed         = np.random.uniform(0, 30, n_samples)
    humidity           = np.random.uniform(30, 95, n_samples)
    hour_of_day        = np.random.randint(0, 24, n_samples).astype(float)

    # Hour traffic multiplier
    traffic_mult = np.where((hour_of_day >= 7) & (hour_of_day <= 9), 1.4,
                   np.where((hour_of_day >= 17) & (hour_of_day <= 19), 1.35,
                   np.where(hour_of_day <= 5, 0.6, 1.0)))

    co2_emission = (
        traffic_density * 0.45 * traffic_mult +
        industrial_count * 1.85 +
        energy_usage_mwh * 0.04 +
        temperature_c * 0.3 -
        wind_speed * 0.8 +
        population_density / 3000 +
        np.random.normal(0, 4, n_samples)
    )
    co2_emission = np.clip(co2_emission, 5, 200)

    return pd.DataFrame({
        "traffic_density":    traffic_density,
        "industrial_count":   industrial_count,
        "energy_usage_mwh":   energy_usage_mwh,
        "temperature_c":      temperature_c,
        "population_density": population_density,
        "wind_speed":         wind_speed,
        "humidity":           humidity,
        "hour_of_day":        hour_of_day,
        "co2_emission":       co2_emission,
    })


def generate_scenario_dataset(n_samples: int = 3000) -> pd.DataFrame:
    """Dataset for scenario impact prediction."""
    tree_count        = np.random.uniform(0, 50, n_samples)
    traffic_reduction = np.random.uniform(0, 80, n_samples)
    renewable_energy  = np.random.uniform(0, 100, n_samples)
    biofilters        = np.random.uniform(0, 50, n_samples)
    carbon_capture    = np.random.uniform(0, 30, n_samples)

    co2_reduction_pct = np.clip(
        tree_count * 0.08 +
        traffic_reduction * 0.45 +
        renewable_energy * 0.22 +
        biofilters * 0.15 +
        carbon_capture * 0.12 +
        np.random.normal(0, 1.5, n_samples),
        0, 92
    )

    return pd.DataFrame({
        "tree_count":        tree_count,
        "traffic_reduction": traffic_reduction,
        "renewable_energy":  renewable_energy,
        "biofilters":        biofilters,
        "carbon_capture":    carbon_capture,
        "co2_reduction_pct": co2_reduction_pct,
    })


# ─── 2. Train Model 1: Emission Prediction ──────────────────────────────────

def train_emission_model(df: pd.DataFrame) -> dict:
    print("\n" + "="*55)
    print("  MODEL 1: Emission Prediction (Random Forest)")
    print("="*55)

    features = ["traffic_density", "industrial_count", "energy_usage_mwh",
                "temperature_c", "population_density", "wind_speed", "humidity", "hour_of_day"]
    X = df[features]
    y = df["co2_emission"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        n_jobs=-1,
        random_state=42
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae    = mean_absolute_error(y_test, y_pred)
    rmse   = np.sqrt(mean_squared_error(y_test, y_pred))
    r2     = r2_score(y_test, y_pred)

    print(f"  ✓ Samples:       {len(df):,}")
    print(f"  ✓ MAE:           {mae:.4f}")
    print(f"  ✓ RMSE:          {rmse:.4f}")
    print(f"  ✓ R² Score:      {r2:.4f}")
    print(f"  ✓ CV R² (5-fold):{np.mean(cross_val_score(model, X, y, cv=5, scoring='r2')):.4f}")

    # Feature importance
    importance_df = pd.DataFrame({
        "feature":    features,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    print("\n  Feature Importances:")
    for _, row in importance_df.iterrows():
        bar = "█" * int(row["importance"] * 40)
        print(f"  {row['feature']:25s} {row['importance']:.4f} {bar}")

    return {"model": model, "mae": mae, "rmse": rmse, "r2": r2, "features": features}


# ─── 3. Train Model 2: Hotspot Detection ─────────────────────────────────────

def train_hotspot_model(df: pd.DataFrame) -> dict:
    print("\n" + "="*55)
    print("  MODEL 2: Hotspot Detection (K-Means + DBSCAN)")
    print("="*55)

    # Normalize
    features = ["traffic_density", "industrial_count", "energy_usage_mwh", "co2_emission"]
    X        = df[features]
    scaler   = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # K-Means
    kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
    kmeans_labels = kmeans.fit_predict(X_scaled)

    # DBSCAN
    dbscan = DBSCAN(eps=0.5, min_samples=10)
    dbscan_labels = dbscan.fit_predict(X_scaled)
    n_clusters_dbscan = len(set(dbscan_labels)) - (1 if -1 in dbscan_labels else 0)
    noise_pct = (dbscan_labels == -1).sum() / len(dbscan_labels) * 100

    print(f"  ✓ K-Means Clusters:  5")
    print(f"  ✓ DBSCAN Clusters:   {n_clusters_dbscan}")
    print(f"  ✓ Noise Points:      {noise_pct:.1f}%")

    # Cluster summary by CO₂
    df_clustered = df.copy()
    df_clustered["cluster"] = kmeans_labels
    cluster_summary = df_clustered.groupby("cluster")["co2_emission"].agg(["mean", "count"])
    print("\n  K-Means Cluster CO₂ Statistics:")
    for idx, row in cluster_summary.iterrows():
        label = "🔴 Critical" if row["mean"] > 90 else "🟠 High" if row["mean"] > 65 else "🟡 Medium" if row["mean"] > 40 else "🟢 Low"
        print(f"  Cluster {idx}: mean={row['mean']:.1f} kg/m²  n={int(row['count']):4d}  {label}")

    return {"kmeans": kmeans, "dbscan": dbscan, "scaler": scaler, "features": features, "n_clusters": 5}


# ─── 4. Train Model 3: Scenario Impact ───────────────────────────────────────

def train_scenario_model(df: pd.DataFrame) -> dict:
    print("\n" + "="*55)
    print("  MODEL 3: Scenario Impact Prediction (XGBoost)")
    print("="*55)

    features = ["tree_count", "traffic_reduction", "renewable_energy", "biofilters", "carbon_capture"]
    X = df[features]
    y = df["co2_reduction_pct"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    try:
        from xgboost import XGBRegressor
        model = XGBRegressor(
            n_estimators=200, max_depth=6, learning_rate=0.08,
            subsample=0.85, colsample_bytree=0.85, random_state=42, verbosity=0
        )
        model_name = "XGBoost"
    except ImportError:
        from sklearn.ensemble import GradientBoostingRegressor
        model = GradientBoostingRegressor(n_estimators=200, max_depth=5, learning_rate=0.08, random_state=42)
        model_name = "GradientBoosting (fallback)"

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mae    = mean_absolute_error(y_test, y_pred)
    rmse   = np.sqrt(mean_squared_error(y_test, y_pred))
    r2     = r2_score(y_test, y_pred)

    print(f"  ✓ Algorithm:     {model_name}")
    print(f"  ✓ Samples:       {len(df):,}")
    print(f"  ✓ MAE:           {mae:.4f}")
    print(f"  ✓ RMSE:          {rmse:.4f}")
    print(f"  ✓ R² Score:      {r2:.4f}")

    # Sample predictions
    print("\n  Sample Scenario Predictions:")
    test_cases = [
        {"tree_count": 10, "traffic_reduction": 20, "renewable_energy": 30, "biofilters": 5, "carbon_capture": 2},
        {"tree_count": 40, "traffic_reduction": 60, "renewable_energy": 80, "biofilters": 30, "carbon_capture": 20},
        {"tree_count": 0,  "traffic_reduction": 70, "renewable_energy": 0,  "biofilters": 0,  "carbon_capture": 0},
    ]
    for case in test_cases:
        pred = model.predict(pd.DataFrame([case]))[0]
        print(f"  Trees={case['tree_count']:2d}K  Traffic={case['traffic_reduction']:2d}%  Renewables={case['renewable_energy']:3d}%  → Reduction: {pred:.1f}%")

    return {"model": model, "mae": mae, "rmse": rmse, "r2": r2, "features": features}


# ─── 5. Save Models ──────────────────────────────────────────────────────────

def save_models(results: dict, output_dir: str = "models"):
    os.makedirs(output_dir, exist_ok=True)
    for name, data in results.items():
        with open(f"{output_dir}/{name}.pkl", "wb") as f:
            pickle.dump(data, f)
        print(f"  ✓ Saved: {output_dir}/{name}.pkl")


# ─── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n" + "█"*55)
    print("  🌿  EcoTwin ML Training Pipeline")
    print("  CO₂ Digital Twin — Model Suite v1.0")
    print("█"*55)

    print("\n⟳  Generating training datasets...")
    emission_df = generate_emission_dataset(5000)
    scenario_df = generate_scenario_dataset(3000)
    print(f"  ✓ Emission dataset:  {len(emission_df):,} samples")
    print(f"  ✓ Scenario dataset:  {len(scenario_df):,} samples")

    emission_results = train_emission_model(emission_df)
    hotspot_results  = train_hotspot_model(emission_df)
    scenario_results = train_scenario_model(scenario_df)

    print("\n" + "="*55)
    print("  Saving trained models...")
    save_models({
        "emission_model": emission_results,
        "hotspot_model":  hotspot_results,
        "scenario_model": scenario_results,
    })

    print("\n" + "█"*55)
    print("  ✓ All models trained and saved successfully!")
    print("  Summary:")
    print(f"    Emission Model R²  : {emission_results['r2']:.4f}")
    print(f"    Scenario Model R²  : {scenario_results['r2']:.4f}")
    print("█"*55 + "\n")
