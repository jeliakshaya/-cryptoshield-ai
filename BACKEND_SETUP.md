# Backend setup

1. Install PostgreSQL.
2. Create database `cryptoshield`.
3. Copy `server/.env.example` to `server/.env`.
4. Set a strong `JWT_SECRET`.
5. From `server/`: `npm install`
6. Initialize schema: `npm run db:init`
7. Import the supplied Elliptic predictions: `npm run db:import` (or `npm run db:seed`, which also creates the local analyst account).
8. Start API: `npm run dev`
9. Start frontend from the project root with `npm install && npm run dev`.

The live Bitcoin feed is available at `GET /api/live/bitcoin` after authentication.
