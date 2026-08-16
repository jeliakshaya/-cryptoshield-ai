# Deployment

## Recommended first deployment

- Frontend: Vercel
- Backend: Render/Railway/Cloud Run
- PostgreSQL: Neon/Supabase/managed PostgreSQL

## Backend environment variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<managed-postgresql-connection-string>
JWT_SECRET=<long-random-secret>
FRONTEND_URL=https://<your-frontend-domain>
```

After deploying the backend, initialize the production database once:

```bash
npm run db:init
npm run db:seed
```

For a real production system, seed only non-sensitive test data and run migrations through your CI/CD pipeline.

## Frontend environment variable

```env
VITE_API_URL=https://<your-backend-domain>/api
```

Then deploy the Vite application.

## Docker

The backend includes `server/Dockerfile` and can be deployed to any container platform.
