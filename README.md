# LAN System — Barbershop & Salon Management

> **Launched, Noted, Never Forgotten**

A full-featured web management system for barbershops and salons, covering the entire business cycle — from client registration to revenue analytics.

---

## Features

- **Authentication** — Sign up, login, automatic token refresh, and route protection
- **Dashboard** — Monthly revenue chart, KPIs and service revenue breakdown, filterable by year/month
- **Clients** — Full CRUD with WhatsApp/Instagram contacts, loyalty tier analysis (VIP GOLD, FREQUENT, ACTIVE), and detailed client profile modal
- **Professionals** — Staff management with multi-service authorization per professional
- **Services** — Service catalog with pricing
- **Appointments** — Smart scheduling with real-time professional filtering by service, duplicate service prevention, discount calculation and payment tracking
- **Activities** — Appointment history with filters, inline mark-as-paid and full edit support
- **Settings** — Profile management and language preferences
- **Support** — FAQ and contact form
- **Internationalization** — Full PT/EN support via `next-intl`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack React Query v5 |
| HTTP Client | Axios (with interceptors) |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Charts | Recharts |
| i18n | next-intl |
| Icons | Lucide React |
| Notifications | react-hot-toast |

---

## Project Structure

```
src/
├── app/
│   ├── (app)/               # Authenticated routes (with sidebar + AuthGuard)
│   │   ├── activities/
│   │   ├── appointments/
│   │   ├── clients/
│   │   ├── dashboard/
│   │   ├── professionals/
│   │   ├── services/
│   │   ├── settings/
│   │   └── support/
│   └── (auth)/              # Public routes
│       ├── login/
│       └── signup/
├── components/
│   ├── charts/              # Recharts wrappers
│   ├── layout/              # AppShell, Sidebar, Topbar, AuthGuard, GuestGuard
│   └── ui/                  # Button, Card, Badge, Input, Modal, Select, Textarea, Display
├── features/                # Feature-based modules
│   ├── activities/
│   ├── appointments/
│   ├── auth/
│   ├── customers/
│   ├── dashboard/
│   ├── professionals/
│   ├── services/
│   ├── settings/
│   └── support/
├── hooks/                   # Global hooks (useDebounce)
├── i18n/                    # next-intl server config
├── lib/                     # axios instance (api.ts), utilities (utils.ts)
├── providers/               # QueryProvider (React Query + Toaster)
├── stores/                  # Zustand stores (auth, ui, locale)
├── constants/               # Routes, avatar colors
└── types/                   # Shared TypeScript types
```

Each feature follows a consistent internal structure:

```
features/<name>/
├── api/          # Axios calls (*.api.ts)
├── hooks/        # React Query hooks (use*.ts)
├── components/   # UI components scoped to this feature
└── schemas/      # Zod validation schemas
```

---

## Architecture Decisions

**Authentication flow**
- `accessToken` stored in `sessionStorage` (cleared on tab close)
- `refreshToken` stored in `localStorage` (persists across sessions)
- Axios interceptor automatically refreshes the access token on 401 responses
- `AuthGuard` protects all dashboard routes; `GuestGuard` redirects logged-in users away from auth pages

**Error handling**
- Centralized in the Axios response interceptor
- API error codes (e.g. `INVALID_CREDENTIALS`, `PROFESSIONAL_SERVICE_MISMATCH`) mapped to user-friendly toast messages
- `VALIDATION_ERROR` responses are mapped field-by-field into React Hook Form errors

**Smart appointment booking**
- When a service is selected, only professionals authorized for that service are fetched (`GET /professionals/service/:id`)
- Services already added to the appointment are filtered out of the selector to prevent duplicates

**Data formatting**
- Phone numbers are displayed with BR mask `(11) 99999-9999` but sent to the API as raw digits with DDI (`+5511999999999`)
- Instagram handles are stripped of `@` before being sent to the API

---

## Getting Started

### Prerequisites

- Node.js 18+
- The backend API running (see backend repo)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd lan-system

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Running

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The app will be available at `http://localhost:3000`.

---

## API

This frontend connects to a REST API. All routes except login (`POST /sessions/`) and signup (`POST /users`) require a Bearer token.

Base URL is configured via `NEXT_PUBLIC_API_URL` in your `.env.local`.
