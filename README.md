# CarValue AI — Used Car Price Prediction

A complete, runnable college-level full-stack demo:
- React + Vite frontend
- FastAPI backend
- scikit-learn Random Forest model
- CSV-based training pipeline
- Prediction explanation using feature importance
- Demo dataset included

> **Important:** `backend/data/used_cars_demo.csv` is synthetic demo data generated for this project. It is suitable for testing the application flow, not for claiming real-market accuracy. For a credible project, replace it with a licensed/appropriately sourced Indian used-car dataset, retrain, and report metrics on a held-out test set.

## Requirements
- Python 3.10+
- Node.js 18+
- npm

## 1. Start the backend (Windows PowerShell)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train_model.py
uvicorn app.main:app --reload
```
API: http://127.0.0.1:8000  
Swagger docs: http://127.0.0.1:8000/docs

## 2. Start the frontend (new terminal)
```powershell
cd frontend
npm install
npm run dev
```
Open the URL printed by Vite (normally http://localhost:5173).

## 3. API quick test
```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/health
```
The UI sends prediction requests to `http://127.0.0.1:8000`.

## Dataset format
Training expects these columns:
`brand, year, km_driven, fuel, transmission, owner, mileage, engine_cc, max_power_bhp, selling_price`

Replace the demo CSV with a real dataset using the same column names, then run:
```powershell
cd backend
python train_model.py
```
Do not include `selling_price` in prediction inputs. Do not use the demo model's score as evidence of real-world performance.

## Project structure
```text
CarValue_AI/
├── backend/
│   ├── app/main.py
│   ├── data/used_cars_demo.csv
│   ├── models/                 # created after training
│   ├── requirements.txt
│   └── train_model.py
├── frontend/
│   ├── src/App.jsx
│   ├── src/main.jsx
│   ├── src/style.css
│   ├── index.html
│   └── package.json
└── docs/
    ├── PROJECT_REPORT.md
    └── VIVA_QUESTIONS.md
```

## Notes
- Prices are represented in Indian rupees (INR).
- The demo app estimates a resale price from vehicle specifications.
- The feature-importance panel describes global model importance, not a guaranteed causal explanation for an individual prediction.
- This is an educational prototype, not a certified vehicle valuation service.
