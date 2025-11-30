# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Black Orchid Bar is a Next.js 16 application for a bartender booking marketplace platform. It connects clients with bartenders for events, handles bookings, payments via Stripe, and includes knowledge base features for cocktails, shopping guides, and safety information.

**Tech Stack:**
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with custom OKLCH color system (gold and dark theme)
- **Backend**: Supabase (PostgreSQL with Row Level Security)
- **Payments**: Stripe (with Stripe Connect for bartender payouts)
- **AI**: OpenAI integration via Vercel AI SDK
- **Deployment**: Vercel

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Production server
npm run start

# Linting
npm run lint
# Or directly:
eslint
```

## Project Architecture

### Database Schema (Supabase)

The application uses a multi-table PostgreSQL schema with comprehensive Row Level Security (RLS) policies:

**Core Tables:**
- `profiles` - User profiles linked to Supabase Auth with role-based access (client, bartender, admin)
- `bartender_details` - Extended bartender info including Stripe Connect account, hourly rate, certifications, approval status
- `bookings` - Event bookings with status tracking (inquiry → confirmed → completed/cancelled)
- `payments` - Stripe payment tracking linked to bookings

**Knowledge Base Tables:**
- `service_addons` - Dry hire equipment and add-on services
- `shopping_guides` - Spirit recommendations and serving calculations
- `cocktails` - Cocktail recipes with ingredients and difficulty levels
- `safety_rules` - Safety guidelines categorized by severity

**Key Database Features:**
- UUID-based primary keys using `uuid-ossp` extension
- Automatic `updated_at` triggers on core tables
- Performance indexes on foreign keys and frequently queried columns
- RLS policies enforce:
  - Users can only view/edit their own profiles
  - Only approved bartenders are publicly viewable
  - Booking participants can view/update their bookings
  - Knowledge base is publicly readable

### Application Structure

**Next.js App Router (Next.js 16):**
- Uses React 19 with new `react-jsx` transform
- Path alias: `@/*` maps to project root
- Font optimization via `next/font` (Geist Sans & Geist Mono)
- TypeScript paths configured in `tsconfig.json`

**Implementation Status:**
- ✅ Supabase client utilities (`lib/supabase/client.ts` and `lib/supabase/server.ts`)
- ✅ Middleware with auth & role-based route protection (`middleware.ts`)
- ✅ AI Concierge API with 5 tools (`app/api/chat/route.ts`)
- ✅ Stripe API routes for checkout and Connect onboarding
- ✅ Auth pages (login/signup with role selection)
- ✅ Admin approval dashboard (`app/admin/page.tsx`)
- ✅ Bartender onboarding flow (`app/bartender/onboarding/page.tsx`)
- ✅ Core UI components (ConciergeChat, ApprovalList)
- ✅ AI knowledge base JSON files (`lib/data/`)

### Styling System

Custom OKLCH color palette in `globals.css`:
- Primary: Metallic gold (`--primary`)
- Secondary: Deep charcoal (`--secondary`)
- Automatic dark mode support with adjusted OKLCH values
- Tailwind v4 with PostCSS configuration

## Integration Points

### Supabase Setup

When creating Supabase utilities:
- Use `@supabase/ssr` for server-side rendering compatibility
- Create separate client instances for:
  - Server Components (using cookies)
  - Client Components (using browser storage)
  - Server Actions (using cookies)
  - Route Handlers (using cookies)
- Reference the schema at `supabase/schema.sql` for table structures

### Stripe Integration

Stripe is used for:
- Client payments for bookings
- Stripe Connect for bartender payouts
- `bartender_details.stripe_account_id` stores Connect account ID

### Environment Variables

Required environment variables (configured in `.env.local`):
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Stripe: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- OpenAI: `OPENAI_API_KEY`
- App: `NEXT_PUBLIC_APP_URL`

## Development Guidelines

### Code Organization

- Follow Next.js App Router conventions
- Server Components by default, use `'use client'` only when necessary
- Place shared utilities in appropriately named directories (e.g., `lib/`, `utils/`)
- Type definitions should mirror database schema enums and types

### Database Interaction

- Always respect RLS policies - use authenticated Supabase clients
- Check `approval_status` when querying bartenders
- Booking workflow: inquiry → confirmed → completed/cancelled
- Log all Stripe transactions in the `payments` table

### TypeScript

- Strict mode is enabled - no implicit any
- Target ES2017 for compatibility
- Use React 19 JSX transform
- Generate types from Supabase schema when possible

### Styling

- Use Tailwind utility classes
- Reference CSS custom properties for colors (e.g., `bg-primary`, `text-foreground`)
- Dark mode classes automatically apply via `.dark` selector
- Border radius defaults to `--radius: 0.75rem`

## AI Concierge Architecture

The AI Concierge (`app/api/chat/route.ts`) uses Vercel AI SDK with OpenAI (gpt-4-turbo) and includes 5 function tools:

1. **get_recipe** - Searches cocktail database by name, type, or flavor profile
2. **estimate_shopping_list** - Calculates bottle quantities using dry hire formulas (light/moderate/heavy drinking levels)
3. **check_safety** - Validates TABC compliance (1 bartender per 50-75 guests)
4. **search_talent** - Queries approved bartenders from `bartender_details` table
5. **get_upsells** - Returns premium service add-ons from knowledge base

**Knowledge Base Files:**
- `lib/data/cocktails.json` - Cocktail recipes with ingredients, glassware, difficulty
- `lib/data/dry_hire_logic.json` - Serving calculations, bottle math, upsell packages
- `lib/data/rules.json` - Brand compliance rules (TABC, last call, staff ratios)

The AI system prompt enforces a "Digital Speakeasy" brand voice - sophisticated, noir, and ultra-luxury.

## Key Workflows

### Booking Flow
- Client creates booking (inquiry status) → assigned to bartender
- Status progression: `inquiry` → `confirmed` → `completed`/`cancelled`
- All Stripe payment transactions must be logged in `payments` table

### Bartender Approval Flow
- Bartenders sign up → complete profile + Stripe Connect onboarding
- Admin reviews via `/admin` dashboard
- Only `approval_status: 'approved'` bartenders are publicly searchable
- RLS policies enforce: bartenders see own pending details, public sees only approved

### Middleware Protection
- `/admin/*` routes require `role: 'admin'`
- `/bartender/*` routes require `role: 'bartender'`
- Unauthenticated users redirected to `/auth/login`
- Session refresh handled automatically via Supabase SSR

## Database Initialization

Run the complete schema setup:
```bash
# In Supabase SQL Editor, execute:
supabase/schema.sql
```

This creates:
- All tables with UUID primary keys
- RLS policies for role-based access
- Performance indexes on foreign keys and query columns
- `updated_at` triggers on core tables
- Enum types: `app_role`, `approval_status`, `booking_status`
