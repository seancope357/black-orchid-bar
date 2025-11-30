# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Black Orchid Bar Co. is a luxury bartender booking marketplace built on the **Dry Hire** business model (clients provide alcohol, we provide bartending services). The platform features an AI Concierge for event planning, Stripe Connect for payments, and a vetted bartender network.

**Tech Stack:**
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode, ES2017 target)
- **Styling**: Tailwind CSS v4 with custom OKLCH color system
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Payments**: Stripe Connect for bartender payouts
- **AI**: Vercel AI SDK with OpenAI (GPT-4 Turbo)
- **Deployment**: Vercel

## Development Commands

```bash
# Development server (runs on http://localhost:3000)
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## Architecture

### Database Schema (Supabase)

The database uses PostgreSQL with comprehensive Row Level Security policies:

**Core Tables:**
- `profiles` - User accounts with role-based access (client/bartender/admin), linked to Supabase Auth
- `bartender_details` - Extended bartender info including Stripe Connect account ID, hourly rate, certifications, and approval status
- `bookings` - Event bookings with status tracking (inquiry → confirmed → completed/cancelled)
- `payments` - Stripe payment transaction logs linked to bookings

**Knowledge Base Tables:**
- `cocktails` - Recipe database with ingredients, glassware, difficulty levels
- `shopping_guides` - Spirit recommendations and serving calculations
- `safety_rules` - TABC compliance rules categorized by severity
- `service_addons` - Premium upsell packages (mixers, garnishes, clear ice, mobile bars)

**Key Database Features:**
- Schema located at: `supabase/schema.sql`
- UUID-based primary keys using `uuid-ossp` extension
- Automatic `updated_at` triggers on core tables
- Performance indexes on foreign keys and frequently queried columns
- RLS policies enforce: users can only view/edit their own profiles; only approved bartenders are publicly viewable; booking participants can view/update their bookings; knowledge base is publicly readable

### Application Structure

**Path Alias:**
- `@/*` maps to project root (configured in `tsconfig.json`)

**Key Directories:**
- `app/` - Next.js App Router pages and API routes
- `app/api/chat/` - AI Concierge API with tool calling
- `app/api/stripe/` - Stripe checkout and Connect onboarding endpoints
- `components/ui/` - Reusable UI primitives (GoldButton, GlassCard, Input, Label)
- `components/` - Functional components (Navbar, AIChatWidget, BartenderCard, BookingWizard)
- `lib/supabase/` - Supabase client utilities (client.ts for browser, server.ts for server)
- `lib/data/` - AI knowledge base JSON files (cocktails, dry hire logic, compliance rules)
- `middleware.ts` - Auth and role-based route protection

**Route Structure:**
- `/` - Landing page with hero, how it works, featured talent
- `/auth/login` - Login page
- `/auth/signup` - Signup with role selection (client/bartender)
- `/admin` - Bartender approval dashboard (admin only)
- `/bartender/onboarding` - Bartender profile + Stripe Connect setup (bartender only)
- `/booking` - Multi-step booking wizard
- `/talent` - Bartender search and filtering
- `/dashboard/client` - Client dashboard with upcoming bookings

### Middleware Protection

The middleware (`middleware.ts`) enforces:
- `/admin/*` routes require `role: 'admin'`
- `/bartender/*` routes require `role: 'bartender'`
- Unauthenticated users redirected to `/auth/login`
- Session refresh handled automatically via Supabase SSR

### AI Concierge Architecture

The AI Concierge (`app/api/chat/route.ts`) uses Vercel AI SDK with 5 function tools:

1. **get_recipe** - Searches cocktail database by name, type, or flavor profile
2. **estimate_shopping_list** - Calculates bottle quantities using dry hire formulas (light/moderate/heavy drinking levels)
3. **check_safety** - Validates TABC compliance (1 bartender per 50-75 guests)
4. **search_talent** - Queries approved bartenders by date, location, experience
5. **get_upsells** - Returns premium service add-on packages

**Knowledge Base Files:**
- `lib/data/cocktails.json` - Cocktail recipes
- `lib/data/dry_hire_logic.json` - Serving calculations, bottle math, upsell packages
- `lib/data/rules.json` - Brand compliance rules (TABC, last call, staff ratios)

The system prompt enforces a "Digital Speakeasy" brand voice - sophisticated, noir, ultra-luxury.

### Supabase Client Pattern

When working with Supabase:
- Use `@supabase/ssr` for SSR compatibility
- **Server Components**: Use `lib/supabase/server.ts` (creates client with cookies)
- **Client Components**: Use `lib/supabase/client.ts` (creates client with browser storage)
- **Route Handlers/Server Actions**: Use server client with cookies
- Always respect RLS policies - use authenticated clients
- Check `approval_status: 'approved'` when querying bartenders publicly

### Stripe Integration

Stripe is used for:
- Client payments for bookings via Embedded Checkout
- Stripe Connect Express accounts for bartender payouts
- `bartender_details.stripe_account_id` stores Connect account ID
- API routes: `app/api/stripe/checkout/route.ts` and `app/api/stripe/account-session/route.ts`

### Environment Variables

Required in `.env.local`:
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Stripe**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **OpenAI**: `OPENAI_API_KEY`
- **App**: `NEXT_PUBLIC_APP_URL`

## Design System

### Color Palette (OKLCH)

The design uses a luxury noir aesthetic with OKLCH colors:

**Primary Colors:**
- **Background**: `oklch(0.1496 0 0)` - Deep black
- **Foreground**: `oklch(0.8109 0 0)` - Off-white marble
- **Primary (Gold)**: `oklch(0.7318 0.1106 94.0877)` - Metallic gold
- **Secondary (Charcoal)**: `oklch(0.3715 0 0)` - Deep charcoal

**Usage:**
- Use CSS custom properties: `bg-primary`, `text-foreground`, `border-primary`
- Gold is sparingly used for CTAs and highlights
- All cards use glassmorphism with `backdrop-blur` and `bg-white/5`
- Border radius default: `--radius: 0.75rem` (12px)

### Typography

- **Primary Font**: Geist Sans (variable font)
- **Monospace**: Geist Mono
- **Display**: 6xl-8xl for hero headlines
- **Headings**: 2xl-4xl
- **Body**: base (16px)

See `DESIGN_SYSTEM.md` and `FRONTEND_GUIDE.md` for comprehensive design documentation.

## Key Workflows

### Booking Flow
1. Client creates booking (inquiry status) → assigned to bartender
2. Status progression: `inquiry` → `confirmed` → `completed`/`cancelled`
3. All Stripe payment transactions must be logged in `payments` table

### Bartender Approval Flow
1. Bartender signs up → completes profile + Stripe Connect onboarding
2. Admin reviews via `/admin` dashboard
3. Only `approval_status: 'approved'` bartenders are publicly searchable
4. RLS policies enforce: bartenders see own pending details, public sees only approved

### Database Interaction
- Always respect RLS policies when querying
- Booking workflow follows status transitions
- Log all Stripe transactions in `payments` table
- Check `approval_status` when displaying bartenders to clients

## TypeScript Configuration

- Strict mode enabled - no implicit any
- Target: ES2017
- JSX: `react-jsx` (React 19 transform)
- Module resolution: bundler
- Paths: `@/*` maps to root

## Code Organization Guidelines

- Server Components by default, use `'use client'` only when necessary (state, effects, browser APIs)
- Place shared utilities in `lib/` directory
- Type definitions should mirror database schema enums
- Follow Next.js App Router conventions
- Use Tailwind utility classes, reference CSS custom properties for theme colors
- Components in `components/ui/` should be reusable primitives
- Business logic components go in `components/`

## Component Library

**Core UI Primitives (`components/ui/`):**
- `GoldButton` - Premium CTA with metallic gold gradient and hover animations
- `GlassCard` - Glassmorphic container with backdrop blur (variants: default, active, subtle)
- `Input` - Glass-styled form input with label and error state support
- `Label` - Form label component

**Functional Components:**
- `Navbar` - Fixed navigation with scroll-triggered transparency
- `AIChatWidget` - Collapsible AI Concierge chat interface (connects to `/api/chat`)
- `BartenderCard` - Profile card displaying avatar, rating, rate, certifications
- `BookingWizard` (`components/booking/`) - 6-step booking flow with progress tracking

## Database Initialization

To set up the database:
```bash
# Execute in Supabase SQL Editor:
supabase/schema.sql
```

This creates all tables, RLS policies, indexes, triggers, and enum types.
