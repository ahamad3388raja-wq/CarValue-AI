from pathlib import Path
import json
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE = Path(__file__).resolve().parents[1]
MODEL_PATH = BASE / "models" / "car_price_model.joblib"
METRICS_PATH = BASE / "models" / "metrics.json"

app = FastAPI(title="CarValue AI API", version="1.0.0",
              description="Used car resale price prediction demo API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CarInput(BaseModel):
    brand: str = Field(min_length=1, max_length=40)
    year: int = Field(ge=1990, le=2026)
    km_driven: int = Field(ge=0, le=1_000_000)
    fuel: str
    transmission: str
    owner: str
    mileage: float = Field(gt=0, le=60)
    engine_cc: int = Field(gt=0, le=8000)
    max_power_bhp: float = Field(gt=0, le=1500)

def load_model():
    if not MODEL_PATH.exists():
        raise HTTPException(status_code=503, detail="Model not trained. Run: python train_model.py")
    return joblib.load(MODEL_PATH)

@app.get("/health")
def health():
    return {"status": "ok", "model_ready": MODEL_PATH.exists()}

@app.get("/metrics")
def metrics():
    if not METRICS_PATH.exists():
        return {"message": "Train the model first."}
    return json.loads(METRICS_PATH.read_text(encoding="utf-8"))

@app.post("/predict")
def predict(car: CarInput):
    model = load_model()
    row = pd.DataFrame([car.model_dump()])
    estimate = max(0, float(model.predict(row)[0]))
    # A simple indicative band; not a statistical confidence interval.
    low, high = estimate * 0.90, estimate * 1.10
    return {
        "predicted_price": round(estimate),
        "low_estimate": round(low),
        "high_estimate": round(high),
        "currency": "INR",
        "disclaimer": "Indicative model estimate, not a guaranteed market price."
    }
