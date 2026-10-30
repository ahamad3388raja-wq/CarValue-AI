# CarValue AI — Project Report

## Abstract
CarValue AI is an educational machine-learning application that estimates the resale value of a used car from vehicle attributes such as brand, manufacturing year, kilometres driven, fuel type, transmission, ownership, mileage, engine capacity and power. A React interface collects inputs, a FastAPI service validates them, and a trained scikit-learn regression pipeline returns an indicative price.

## Problem statement
Used-car buyers and sellers often lack a consistent starting point for estimating a vehicle's resale value. This project demonstrates how historical listing data can be processed and used to build a regression model that estimates price from vehicle characteristics.

## Objectives
1. Clean and prepare tabular used-car data.
2. Encode categorical attributes and impute missing values.
3. Train a regression model.
4. Evaluate the model using MAE, RMSE and R².
5. Expose predictions through a REST API.
6. Build a responsive web interface.

## Methodology
- Data ingestion from CSV.
- Separate numeric and categorical preprocessing.
- Median imputation and standard scaling for numeric features.
- Most-frequent imputation and one-hot encoding for categorical features.
- Random Forest regression.
- 80/20 train-test split with a fixed random seed.
- Evaluation with MAE, RMSE and R².

## System architecture
React frontend → FastAPI endpoint → persisted scikit-learn pipeline → predicted INR value → result display.

## Limitations
The bundled CSV is synthetic demo data and cannot establish real-world predictive performance. The displayed ±10% band is a simple indicative range, not a calibrated confidence interval. Feature importance is not causation. Real deployments require representative regional data, data-quality checks, robust validation, monitoring and periodic retraining.

## Future scope
- Train and compare Random Forest, Gradient Boosting, XGBoost and CatBoost.
- Add location, variant, service history, accident history and insurance status.
- Use time-based validation and market-segment evaluation.
- Add model explainability with SHAP.
- Add user accounts, saved valuations and admin analytics.
- Deploy frontend and API with environment-based configuration.
