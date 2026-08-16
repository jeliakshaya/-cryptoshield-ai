# CryptoShield AI — Cryptocurrency Cyber Threat Prediction

CryptoShield AI is a full-stack mini project for cryptocurrency transaction monitoring and cyber-threat risk analysis.

## What was cleaned

- Removed the old demo transaction seeding path.
- Database seeding now imports the supplied **Elliptic model-prediction CSV**.
- Verified the `risk_score` scale: the supplied CSV already uses the UI's `0..100` range.
- Removed fabricated blockchain hashes/addresses from the historical dataset view. Elliptic transaction IDs are shown as dataset identifiers.
- Added a real-time Bitcoin mempool feed using Blockstream's public API.
- Added a transparent structural risk baseline for live mempool transactions. Live transactions are **not falsely labelled as trained-model predictions**.
- Removed unused sample transaction/alert datasets from the runtime project.
- Replaced hard-coded analytics accuracy/false-positive claims with neutral values until a measured model evaluation is supplied.

## Important ML limitation

The uploaded ZIP did not contain the original trained Random Forest model artifact or the full 166-feature Elliptic training data. Therefore, it is not technically possible to retrain or reproduce that exact model from the uploaded project alone.

The project truthfully uses the included `server/predicted_transactions.csv` as **precomputed model predictions**. The live Bitcoin feed is a separate structural-risk baseline and is persisted into PostgreSQL so the live stream, monitoring table and alerts use the same data.

For a submission that claims a newly trained Random Forest, include:
1. the actual Elliptic feature dataset,
2. the training script,
3. the saved model (`.joblib`/`.pkl`),
4. the feature preprocessing pipeline,
5. measured test metrics.

## Run

### Frontend

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run db:init
npm run db:seed
npm run db:import
npm run dev
```

The API runs on `http://localhost:5000`.

### Demo analyst login

- Email: `analyst@cryptoshield.ai`
- Password: `Demo@12345`

Change this password before any public deployment.

## Database

PostgreSQL database: `cryptoshield`

The schema is in `server/sql/schema.sql`.

## Data sources

- Historical predictions: supplied `server/predicted_transactions.csv`, based on the Elliptic Bitcoin transaction dataset.
- Live feed: current Bitcoin mempool transactions from Blockstream.
