# BudgetBox Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client - Browser"
        UI[Next.js 15 App Router]
        Components[React Components]
        Store[Zustand Store]
        IDB[(IndexedDB<br/>idb-keyval)]
        Toast[Toast Notifications]
    end

    subgraph "State Management"
        Store --> IDB
        Store -->|Persist| IDB
        IDB -->|Hydrate| Store
    end

    subgraph "Components Layer"
        UI --> Components
        Components --> BudgetForm[BudgetForm]
        Components --> Dashboard[Dashboard]
        Components --> SyncStatus[SyncStatus]
        Components --> Header[Header]
        Components --> Toast
    end

    subgraph "Hooks Layer"
        useSync[useSync Hook]
        useFetchLatest[useFetchLatest Hook]
        useOfflineDetection[useOfflineDetection Hook]
    end

    subgraph "API Layer"
        APISync[POST /api/budget/sync]
        APILatest[GET /api/budget/latest]
    end

    subgraph "Database Layer"
        DBIndex[lib/db/index.ts]
        MockDB[Mock Database<br/>In-Memory]
        PostgresDB[(PostgreSQL<br/>Production)]
    end

    subgraph "External Services"
        CloudSync[Cloud Sync<br/>Optional]
    end

    %% Component to Store connections
    BudgetForm --> Store
    Dashboard --> Store
    SyncStatus --> Store
    SyncStatus --> useSync

    %% Hooks connections
    useSync --> APISync
    useFetchLatest --> APILatest
    useOfflineDetection --> Toast

    %% API to Database
    APISync --> DBIndex
    APILatest --> DBIndex
    DBIndex -->|Development| MockDB
    DBIndex -->|Production| PostgresDB

    %% Sync flow
    Store -->|Sync Request| useSync
    useSync -->|POST| APISync
    APISync -->|Update| DBIndex
    DBIndex -->|Response| useSync
    useSync -->|Update Store| Store

    %% Offline detection
    useOfflineDetection -->|Monitor| Navigator[Browser Navigator]
    Navigator -->|Online/Offline Events| useOfflineDetection

    style Store fill:#3b82f6,color:#fff
    style IDB fill:#10b981,color:#fff
    style PostgresDB fill:#8b5cf6,color:#fff
    style MockDB fill:#f59e0b,color:#fff
    style Toast fill:#ef4444,color:#fff
```

## Data Flow

### 1. User Input Flow
```
User Input → BudgetForm → Zustand Store → IndexedDB
                                    ↓
                            Auto-save (onBlur/Enter)
```

### 2. Sync Flow (Online)
```
Local Store → useSync Hook → POST /api/budget/sync
                                    ↓
                            Conflict Resolution
                                    ↓
                            PostgreSQL/Mock DB
                                    ↓
                            Response → Update Store
```

### 3. Offline Detection Flow
```
Browser Navigator → useOfflineDetection → Toast Notification
                                              ↓
                                    Persistent Warning
```

## Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
│   ├── ToastProvider (Global Toast Context)
│   └── Header (Navigation)
│
└── page.tsx (Home Page)
    ├── useOfflineDetection (Global Hook)
    ├── SyncStatus
    │   └── useSync Hook
    ├── BudgetForm
    │   └── useBudgetStore (Zustand)
    └── Dashboard
        └── useBudgetStore (Zustand)
```

## State Management Architecture

```mermaid
graph LR
    A[User Action] --> B[Zustand Store]
    B --> C{Is Synced?}
    C -->|No| D[Set isSynced = false]
    C -->|Yes| E[Keep isSynced = true]
    D --> F[Persist to IndexedDB]
    E --> F
    F --> G[Auto-save Complete]
    
    H[Sync Action] --> I[useSync Hook]
    I --> J[POST /api/budget/sync]
    J --> K{Server Response}
    K -->|Success| L[Set isSynced = true]
    K -->|Conflict| M[Update with Server Data]
    L --> N[Update Store]
    M --> N
```

## Sync Strategy Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /api/budget/sync<br/>{budget, userId}
    API->>DB: Fetch existing record
    DB-->>API: existingRecord
    
    alt Server has newer data
        API-->>Client: Return serverData<br/>(Server Wins)
        Client->>Client: Update local store
    else Client has newer data
        API->>DB: Upsert budget data
        DB-->>API: Success
        API-->>Client: Success + timestamp
        Client->>Client: Set isSynced = true
    else Timestamps equal
        API-->>Client: Already up to date
    end
```

## Technology Stack Diagram

```mermaid
graph TB
    subgraph "Frontend"
        NextJS[Next.js 15<br/>App Router]
        React[React 18]
        TS[TypeScript]
        Tailwind[Tailwind CSS]
    end

    subgraph "State & Storage"
        Zustand[Zustand Store]
        IDB[idb-keyval<br/>IndexedDB]
    end

    subgraph "Backend"
        APIRoutes[Next.js API Routes]
        Zod[Zod Validation]
    end

    subgraph "Database"
        Mock[Mock DB<br/>Development]
        PG[PostgreSQL<br/>Production]
    end

    subgraph "UI Libraries"
        Recharts[Recharts]
        Lucide[Lucide Icons]
    end

    NextJS --> React
    NextJS --> TS
    NextJS --> Tailwind
    NextJS --> APIRoutes
    
    Zustand --> IDB
    APIRoutes --> Zod
    APIRoutes --> Mock
    APIRoutes --> PG
    
    NextJS --> Recharts
    NextJS --> Lucide

    style NextJS fill:#000,color:#fff
    style Zustand fill:#3b82f6,color:#fff
    style IDB fill:#10b981,color:#fff
    style PG fill:#8b5cf6,color:#fff
```

## Key Architectural Decisions

1. **Offline-First**: All data is stored locally first, then synced when online
2. **Last Write Wins**: Conflict resolution based on timestamps
3. **Local Storage**: IndexedDB for better performance and capacity than localStorage
4. **Type Safety**: Strict TypeScript with Zod validation
5. **Component-Based**: Modular React components for maintainability
6. **Hook Pattern**: Custom hooks for reusable logic (sync, offline detection)

