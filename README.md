# BudgetBox

A Local-First Personal Budgeting App built with Next.js 15, TypeScript, and Zustand.
link to portal :- https://budget-box-delta.vercel.app/

## Features

- 🏠 **Offline-First Architecture**: Works fully without internet. Data persists in IndexedDB using Zustand.
- 💾 **Auto-Save**: Budget inputs auto-save on blur or Enter key press.
- 📊 **Dashboard**: Real-time metrics, pie charts, and budget anomaly warnings.
- 🔄 **Sync Status**: Clear indicators for Local Only, Sync Pending, and Synced states.
- 🔐 **Authentication**: Login/Signup with local user storage.
- ☁️ **Cloud Sync**: Optional sync to PostgreSQL server with Last Write Wins conflict resolution.
- 📱 **Responsive**: Mobile-friendly design with Tailwind CSS.
- 🌙 **Dark Mode**: Automatic dark mode support.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand with IndexedDB persistence (idb-keyval)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture diagrams including:
- System architecture overview
- Data flow diagrams
- Component hierarchy
- State management flow
- Sync strategy sequence
- Technology stack visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm (comes with Node) or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Jayasuryanarayana/BudgetBox.git
cd BudgetBox
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

### 4. Build for production (optional)

```bash
npm run build
npm start
```

### 5. Lint the project (optional)

```bash
npm run lint
```

## Project Structure

```
ansumat/
├── app/
│   ├── api/
│   │   └── budget/          # REST API endpoints
│   ├── components/          # React components
│   ├── login/               # Login page
│   └── signup/              # Signup page
├── lib/
│   ├── auth/                # Authentication utilities
│   ├── db/                  # Database layer (mock/PostgreSQL)
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand store
│   └── types.ts             # TypeScript types
└── docs/                    # Documentation
```

## API Endpoints

- `POST /api/budget/sync` - Sync local data to server
- `GET /api/budget/latest` - Fetch latest server version

See [docs/API.md](docs/API.md) for detailed API documentation.

## Database

- **Local**: IndexedDB (via Zustand Persist + idb-keyval)
- **Server**: Supabase (PostgreSQL) or PostgreSQL (configurable via `USE_POSTGRES=true`)

## Sync Strategy

**Last Write Wins**: Based on `lastUpdated` timestamp comparison.

## Testing Offline Mode

You can verify the offline-first behavior of BudgetBox using your browser DevTools:

### 1. Prepare some data

1. Start the dev server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in your browser.
3. Enter values in **Income** and a few **expense** fields (Bills, Food, etc.).
4. Blur the inputs or press **Enter** to trigger auto-save (you’ll see the green checkmark).

### 2. Confirm local persistence (IndexedDB)

1. Refresh the page (Ctrl+R / Cmd+R).
2. Your previously entered values should still be there — they are loaded from **IndexedDB via Zustand persist**.

### 3. Simulate offline mode

1. Open **DevTools** (F12 or Ctrl+Shift+I).
2. Go to the **Network** tab.
3. Enable **Offline**:
   - In Chrome: Network → Throttling dropdown → select `Offline`.
4. Observe:
   - The **Sync Status** card shows **Offline** with a red indicator.
   - A **toast notification** appears: “You're currently offline. Changes will sync when connection is restored.”

### 4. Edit data while offline

1. Change some values in **BudgetForm** (e.g., increase Food, Bills, etc.).
2. Blur the field or press **Enter**:
   - Values update in the UI.
   - Sync status changes to **Local Only** or **Sync Pending** (depending on previous sync history).
3. Refresh the page **while still offline**:
   - Data should still persist — it is served entirely from **IndexedDB**, no network required.

### 5. Come back online and sync

1. In DevTools → Network, turn **Offline** off (back to `Online` or `No throttling`).
2. A success toast appears: “Connection restored. You're back online!”
3. Click **“Sync Now”** in the **Sync Status** card:
   - If you are logged in, the app calls `POST /api/budget/sync`.
   - On success, the status changes to **Synced**.
   - If the server has newer data, the client updates with server data (Last Write Wins).

### 6. Optional: Inspect IndexedDB

1. In DevTools, go to **Application** (or “Storage”) tab.
2. Under **IndexedDB**, find the entry used by the app (Zustand persist + idb-keyval).
3. You can see the stored budget data object reflecting your latest local changes.

## Deployment

BudgetBox can be deployed to:
- **Frontend**: Vercel (recommended for Next.js)
- **Backend**: Supabase (PostgreSQL database)

### Quick Deploy to Vercel + Supabase

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Jayasuryanarayana/BudgetBox)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment overview, or [docs/DEPLOYMENT_STEPS.md](docs/DEPLOYMENT_STEPS.md) for a step-by-step walkthrough.

Quick reference:
- Supabase database setup
- Vercel configuration
- Environment variables
- Database schema migration
- Troubleshooting guide

### Environment Variables

Required for production:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## License

MIT

