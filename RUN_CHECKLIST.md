# CryptoShield AI — Final Run Checklist

## 1. PostgreSQL
Create a PostgreSQL database named `cryptoshield`.

## 2. Backend environment
Copy `server/.env.example` to `server/.env` and set the real PostgreSQL connection string and a strong JWT secret.

## 3. Backend setup
```bash
cd server
npm install
npm run db:init
npm run db:seed
npm run db:import
npm run dev
```

Backend: `http://localhost:5000`

## 4. Frontend setup
In the project root:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Frontend: `http://localhost:3000`

## 5. Demo login
- Email: `analyst@cryptoshield.ai`
- Password: `Demo@12345`

Change the password before public deployment.

## 6. Live transaction test
After login, open the Dashboard and confirm the **Live Blockchain Transaction Feed** updates approximately every 15 seconds. Live records are also persisted into PostgreSQL and can appear in the monitoring table and alerts.
