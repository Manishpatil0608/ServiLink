# Local Services Finder Platform

End-to-end platform enabling customers to discover, book, and pay for local services with provider onboarding, role-based administration, and comprehensive support tooling.

## Structure

- backend: Node.js (Express) API with Knex/MySQL, JWT auth, modular architecture.
- frontend: Vite + React SPA with Tailwind CSS, React Query, role-aware routing.

## Getting Started

1. Copy backend/.env.example to backend/.env and update secrets.
2. Run `docker-compose up -d` to start MySQL and Redis.
3. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
4. Apply database migrations: `npm run migrate:latest` inside backend directory.
5. Start development servers:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`

### Google Sign-In

- Set `GOOGLE_CLIENT_ID` in `backend/.env` to enable token verification on the API.
- Create or update `frontend/.env` with `VITE_GOOGLE_CLIENT_ID` so the login page can render the Google button.
- The same OAuth client ID should be used for both the backend audience check and the frontend Google Identity Services SDK.

## Testing

- Backend: `npm test`
- Frontend lint: `npm run lint`

## Additional Notes

- Use dedicated feature branches for module development.
- Keep .env files out of version control.
- Password reset endpoints exist at `/auth/password/forgot` and `/auth/password/reset`; in development the API returns the raw reset token to simplify testing before SMTP is configured.
- Services now include a tax rate column; re-run the latest migrations before seeding so dev data backfills automatically.
