# Workspace

## Overview

pnpm workspace monorepo using TypeScript. SaaS website with authentication, dashboard, pricing, and NOWPayments crypto payment integration.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Session-based (express-session + bcryptjs)
- **Payments**: NOWPayments API (crypto payments)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server (auth, payments, user routes)
│   └── saas-website/       # React + Vite frontend
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

- **Landing page**: Hero, pricing section, Telegram contact (@naylou)
- **Signup / Login**: Session-based auth with bcryptjs password hashing
- **Dashboard**: Current plan display, buy buttons for Daily/Weekly/Monthly/Lifetime plans
- **Settings**: Change username and/or password
- **NOWPayments**: Server-side invoice creation via `/api/payments/create`
- **Webhook**: `/api/payments/callback` activates user plans on confirmed payment

## Plans & Pricing

| Plan     | Price  | Duration  |
|----------|--------|-----------|
| Daily    | $65    | 1 day     |
| Weekly   | $455   | 7 days    |
| Monthly  | $1,300 | 30 days   |
| Lifetime | $2,400 | Forever   |

## Environment Variables Required

- `NOWPAYMENTS_API_KEY` — NOWPayments API key (server-side only)
- `SESSION_SECRET` — Secret for session signing
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned by Replit)

## Database Tables

- `users` — id, username, password (hashed), plan, plan_expires_at, created_at
- `payments` — id, user_id, plan, payment_id, status, amount, created_at, updated_at

## API Routes

- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user
- `PUT /api/user/settings` — Update username/password
- `POST /api/payments/create` — Create NOWPayments invoice
- `POST /api/payments/callback` — NOWPayments webhook

## Running

- `pnpm --filter @workspace/api-server run dev` — API server
- `pnpm --filter @workspace/saas-website run dev` — Frontend
- `pnpm --filter @workspace/db run push` — Push DB schema
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API client
