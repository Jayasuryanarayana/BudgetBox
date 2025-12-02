## Backend (BudgetBox Data & Sync)

This directory documents the **backend** of the BudgetBox application.

BudgetBox uses:

- **Supabase (PostgreSQL)** as the primary remote data store
- **Next.js API routes** as the sync API layer

### Backend Components

- **Supabase** (hosted DB)
  - SQL schema and RLS policy files in `../supabase/`
  - Tables:
    - `budgets` – stores `user_id`, `data` (JSONB), `last_updated`, timestamps
- **Next.js API Routes**
  - `app/api/budget/sync/route.ts` – `POST /api/budget/sync`
  - `app/api/budget/latest/route.ts` – `GET /api/budget/latest`

### Sync Strategy

- **Local-first**: Client always works from local IndexedDB + Zustand.
- **Last Write Wins**: Conflict resolution based on `lastUpdated` timestamp.
- **Endpoints**:
  - `POST /api/budget/sync` – Push local budget to server, resolve conflicts.
  - `GET /api/budget/latest` – Fetch latest server-side budget for a user.

### Supabase Setup

See:

- `../supabase/schema.sql` – DB schema & RLS
- `../supabase/fix-rls-policy.sql` – helper to fix RLS for this app
- `../docs/DEPLOYMENT.md` and `../docs/DEPLOYMENT_STEPS.md` – full setup guide

### Running Endpoints Locally

From the repository root:

```bash
npm install
npm run dev
```

API will be available at:

- `http://localhost:3000/api/budget/sync`
- `http://localhost:3000/api/budget/latest?userId=...`


