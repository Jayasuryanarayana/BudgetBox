## Frontend (BudgetBox UI)

This directory documents the **frontend** of the BudgetBox application.

> Note: The actual Next.js 15 app currently lives at the repository root (`app/`, `lib/`, etc.) for Vercel compatibility. This `frontend/` folder is an organisational entrypoint for reviewers.

### Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand + IndexedDB (idb-keyval)
- Recharts
- Lucide React

### Frontend Source Layout

The core frontend source currently lives in:

- `app/` – Next.js app router pages, API routes, and components
- `lib/` – Shared TypeScript types, Zustand store, hooks, db adapters
- `public/` – Static assets and `sw.js` service worker

### Local Development

From the repository root:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Offline Mode & Local-First

- UI reads/writes from a **Zustand store** persisted to **IndexedDB**.
- **Service worker** (`public/sw.js`) caches the app shell and static assets.
- Detailed offline testing steps are in the root `README.md` under **“Testing Offline Mode”**.


