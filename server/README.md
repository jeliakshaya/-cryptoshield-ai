# CryptoShield AI Backend

Express + PostgreSQL API for the CryptoShield cryptocurrency threat-monitoring application.

## Data model

The included `predicted_transactions.csv` contains **precomputed Elliptic-dataset model predictions**. Its `risk_score` values are already on the application's `0..100` scale.

Important: an Elliptic `txId` is a dataset transaction identifier, not a public Bitcoin transaction hash. The application therefore uses `elliptic:<txId>` and does **not** fabricate blockchain hashes or wallet addresses.

## Local setup

1. Install PostgreSQL and create a database named `cryptoshield`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
3. From `server/`, run `npm install`.
4. Run `npm run db:init`.
5. Run `npm run db:seed`.
6. Run `npm run dev`.

Demo analyst account for local development:

- Email: `analyst@cryptoshield.ai`
- Password: `Demo@12345`

## API

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `GET /api/transactions`
- `GET /api/transactions/:id`
- `PATCH /api/transactions/:id/status`
- `GET /api/wallets/:address`
- `GET /api/alerts`
- `GET /api/alerts/unread-count`
- `PATCH /api/alerts/:id/status`
- `POST /api/ai/analyze`
- `GET /api/ai/analyses`
- `GET /api/preferences`
- `PUT /api/preferences`
- `GET /api/analytics/overview`

## ML note

The supplied ZIP did not contain the original trained model file or the 166-feature Elliptic training dataset, so the backend cannot truthfully retrain a Random Forest from the included files. The dashboard now uses the supplied precomputed model predictions rather than pretending that a rule-based detector is a trained model.

For genuine live blockchain inference, add the trained model artifact plus its feature pipeline and connect it to a live blockchain data provider.

### Live Bitcoin monitoring

`GET /api/live/bitcoin` reads current Bitcoin mempool transactions from Blockstream, obtains a public BTC/USD spot price when available, calculates a transparent structural risk baseline, persists the observations in PostgreSQL, and creates alerts for high-risk observations. The live feed is not presented as a trained ML prediction.
