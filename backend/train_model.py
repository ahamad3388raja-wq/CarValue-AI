from pathlib import Path
import json
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

BASE = Path(__file__).resolve().parent
DATA = BASE / "data" / "used_cars_demo.csv"
MODEL_DIR = BASE / "models"
MODEL_DIR.mkdir(exist_ok=True)

TARGET = "selling_price"
NUMERIC = ["year", "km_driven", "mileage", "engine_cc", "max_power_bhp"]
CATEGORICAL = ["brand", "fuel", "transmission", "owner"]
FEATURES = NUMERIC + CATEGORICAL

def main():
    df = pd.read_csv(DATA)
    missing = [c for c in FEATURES + [TARGET] if c not in df.columns]
    if missing:
        raise ValueError(f"Dataset is missing columns: {missing}")
    df = df[FEATURES + [TARGET]].dropna(subset=[TARGET])
    X, y = df[FEATURES], df[TARGET]

    numeric_pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])
    categorical_pipe = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore"))
    ])
    preprocess = ColumnTransformer([
        ("num", numeric_pipe, NUMERIC),
        ("cat", categorical_pipe, CATEGORICAL)
    ])
    model = Pipeline([
        ("preprocess", preprocess),
        ("regressor", RandomForestRegressor(
            n_estimators=350, min_samples_leaf=2, random_state=42, n_jobs=-1
        ))
    ])
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    metrics = {
        "mae": round(float(mean_absolute_error(y_test, pred)), 2),
        "rmse": round(float(mean_squared_error(y_test, pred) ** 0.5), 2),
        "r2": round(float(r2_score(y_test, pred)), 4),
        "test_rows": int(len(X_test)),
        "training_rows": int(len(X_train)),
        "note": "Metrics are from synthetic demo data; do not treat as real-market performance."
    }
    joblib.dump(model, MODEL_DIR / "car_price_model.joblib")
    (MODEL_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print("Model trained successfully.")
    print(json.dumps(metrics, indent=2))

if __name__ == "__main__":
    main()
