# BudgetBox

A Local-First Personal Budgeting App built with Next.js 15, TypeScript, and Zustand.

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

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- **Server**: PostgreSQL (configurable via `USE_POSTGRES=true`)

## Sync Strategy

**Last Write Wins**: Based on `lastUpdated` timestamp comparison.

## License

MIT

