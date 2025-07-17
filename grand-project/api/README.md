# Grand Project API

This folder contains all backend logic for the AI‑Powered Resume Tailor.

## Structure

- `schema.sql`  
  Database schema for Supabase Postgres.

- `routes/`  
  Next.js API routes.  
  - `tailor-resume.ts` – handles AI‑driven resume tailoring.

## Getting Started

1. **Database**  
   - Run `psql $DATABASE_URL -f schema.sql` to create tables.
2. **Environment**  
DATABASE_URL=postgres://...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
3. **Dev**  

```bash
pnpm install
pnpm dev
```

4. Deploy Push to main → Vercel auto‑deploy.
