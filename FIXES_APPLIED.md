# CryptoShield AI – Fixes Applied

This submission ZIP contains the following corrections:

1. Fixed the Footer API endpoint label from the obsolete `/api/v1/predict` to `/api`.
2. Standardized the risk-score thresholds across frontend and backend:
   - 0–29: Safe
   - 30–54: Suspicious
   - 55–79: High Risk
   - 80–100: Critical
3. Fixed backend analytics so `highRiskCount` uses the same 55+ threshold as the rest of the application.
4. Standardized the analytics risk-score histogram buckets to 0–29, 30–54, 55–79, and 80–100.
5. Standardized severity calculation so High severity begins at 55, matching the application's High Risk classification.
6. Updated wallet risk visualizations to use the same 55+ High Risk threshold.

## Validation

- Frontend TypeScript check: run `npm run lint`.
- Frontend production build: run `npm run build`.
- Backend TypeScript build: run `cd server && npm run build`.
- Database initialization: run `cd server && npm run db:init` with PostgreSQL configured.
- Demo data import: run `cd server && npm run db:seed` or `npm run db:import` as appropriate.

The application continues to use the structural/live risk baseline for live Bitcoin detection and does not falsely claim that the live feed is a trained ML prediction model.
