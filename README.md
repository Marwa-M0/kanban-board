# Kanban Board

A production-grade Kanban-style task management dashboard built with Next.js 14, Zustand, React Query, and dnd-kit.


## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI Components | **Material UI (MUI)** |
| State (server) | TanStack React Query v5 |
| State (UI/client) | Zustand v4 |
| Drag & Drop | dnd-kit |
| HTTP Client | Axios |
| Live API | **MockAPI.io** (with Transformation Layer) |
| Styling | Vanilla CSS + Design Tokens |
| Language | TypeScript |

## Features

- **4-Column Kanban** — Backlog, In Progress, In Review, Done
- **MUI Dialogs** — Premium Create/Edit/Delete modals using Material UI
- **Drag & Drop** — Seamless cross-column movement with dnd-kit
- **Infinite Scroll** — Smooth loading with IntersectionObserver
- **Smart Search** — Highlights matches by dimming non-matching tasks
- **Transformation Layer** — Maps custom API structures to internal models
- **Optimistic Updates** — Instant feedback on all board actions
- **React Query Caching** — Robust server-state management
- **Priority Badges** — Visual coding for task urgency
- **Error Boundary** — Graceful failure handling

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles + design tokens
├── components/
│   ├── board/
│   │   ├── KanbanBoard.tsx # DndContext, drag orchestration
│   │   └── KanbanColumn.tsx# Droppable column + infinite scroll
│   ├── tasks/
│   │   ├── TaskCard.tsx    # Sortable task card
│   │   └── TaskModal.tsx   # Create/edit modal (native <dialog>)
│   └── ui/
│       ├── Header.tsx      # App header + search bar
│       ├── ApiStatusBanner.tsx
│       └── ErrorBoundary.tsx
├── hooks/
│   ├── useTasks.ts         # React Query CRUD hooks
│   └── usePagination.ts    # Client-side pagination/infinite scroll
├── lib/
│   ├── api.ts              # Axios API client
│   ├── queryKeys.ts        # React Query key factory
│   └── QueryProvider.tsx   # QueryClient provider
├── store/
│   └── uiStore.ts          # Zustand store for UI state
└── types/
    └── index.ts            # TypeScript types + constants
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd kanban-board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

The default API URL is `http://localhost:4000`.

### 4. Start the mock API

In a separate terminal:

```bash
npm run mock-api
```

This starts `json-server` on port 4000 using `db.json` as the database. All task CRUD operations persist to this file.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

The app is connected to a live **MockAPI.io** endpoint. Data is automatically transformed in `lib/api.ts` to bridge the gap between the server model and UI types.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Fetch all tasks |
| GET | `/tasks/:id` | Fetch task by ID |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Replace/Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Design Decisions

### React Query vs Zustand

- **React Query** manages all server state (tasks data, loading, errors, caching, invalidation, and optimistic updates)
- **Zustand** manages pure UI state (search query, modal open/closed, which task is being edited) — state that doesn't need to be synced with a server

### Optimistic Updates

`useUpdateTask` and `useDeleteTask` apply changes to the React Query cache immediately via `onMutate`, then roll back on error. This makes drag-and-drop feel instant.

### Pagination

Each column implements client-side infinite scroll. The full list of tasks is fetched once (and cached by React Query), then each column slices its local array with `usePagination`. An `IntersectionObserver` triggers `loadMore` when the bottom sentinel scrolls into view.

### Drag and Drop

`@dnd-kit/core` is used with `PointerSensor` (8px activation distance to avoid accidental drags) and `KeyboardSensor` for accessibility. Tasks can be dragged to any column. The `DragOverlay` renders a floating copy of the dragged card.

## Building for Production

```bash
npm run build
npm start
```
