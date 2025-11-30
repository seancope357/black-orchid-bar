# Black Orchid Bar Co. - MVP

> **Your Digital Speakeasy** - Ultra-luxury bartending marketplace connecting clients with professional bartenders for exclusive events.

## 🌟 Overview

Black Orchid operates on the **Dry Hire** business model: clients provide the alcohol, we provide world-class bartending services, premium mixers, and unforgettable experiences.

**Key Features:**
- 🤖 AI Concierge for event planning and shopping lists
- 💳 Stripe Connect for seamless payments
- 🍸 Curated cocktail knowledge base
- 👔 Vetted, approved bartender network
- ✨ Premium service add-ons (mixers, garnishes, clear ice, mobile bars)

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS with OKLCH color system
- **Database:** Supabase (PostgreSQL + Row Level Security)
- **Auth:** Supabase Auth
- **Payments:** Stripe Connect (Embedded Components)
- **AI:** Vercel AI SDK with OpenAI (GPT-4 Turbo)
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd black-orchid-bar
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.local` and fill in your credentials:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # App Config
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Set up Supabase database:**
   
   Run the SQL script in your Supabase SQL Editor:
   ```bash
   supabase/schema.sql
   ```
   
   This creates:
   - Core tables (profiles, bartender_details, bookings, payments)
   - Knowledge base tables (cocktails, shopping_guides, safety_rules, service_addons)
   - Row Level Security policies
   - Performance indexes

4. **Enable Stripe Connect:**
   
   In your Stripe Dashboard:
   - Enable Connect
   - Set up Express accounts for bartenders
   - Configure webhooks (if needed for production)

5. **Run development server:**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
black-orchid-bar/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI Concierge API
│   │   └── stripe/
│   │       ├── checkout/route.ts  # Embedded checkout
│   │       └── account-session/route.ts  # Stripe Connect onboarding
│   ├── auth/
│   │   ├── login/page.tsx         # Login page
│   │   └── signup/page.tsx        # Signup with role selection
│   ├── admin/page.tsx             # Bartender approval dashboard
│   ├── bartender/
│   │   └── onboarding/page.tsx    # Bartender profile + Stripe setup
│   ├── layout.tsx
│   ├── page.tsx                   # Home page
│   └── globals.css                # OKLCH design system
├── components/
│   ├── chat/ConciergeChat.tsx     # Floating AI chat widget
│   └── admin/ApprovalList.tsx     # Admin approval component
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser client
│   │   └── server.ts              # Server client
│   └── data/                      # AI knowledge base
│       ├── rules.json             # Brand rules & compliance
│       ├── dry_hire_logic.json    # Shopping calculator logic
│       └── cocktails.json         # Cocktail recipes
├── supabase/
│   └── schema.sql                 # Complete database schema
├── middleware.ts                  # Auth & route protection
├── tailwind.config.js             # Tailwind with OKLCH colors
└── .env.local                     # Environment variables
```

## 🎨 Design System

**Color Palette (OKLCH):**
- **Primary (Gold):** `oklch(0.7318 0.1106 94.0877)` - Luxury metallic gold
- **Secondary (Charcoal):** `oklch(0.3715 0 0)` - Deep charcoal
- **Background (Dark):** `oklch(0.1496 0 0)` - Deepest black
- **Foreground (Light):** `oklch(0.8109 0 0)` - Marble white

**Typography:** Geist Sans (default), Geist Mono (code)

**Theme:** Noir, exclusive, ultra-luxury "Digital Speakeasy" aesthetic

## 🔐 Security & Compliance

- **Row Level Security (RLS)** enforced on all tables
- **TABC compliance** built into AI recommendations
- **Role-based access control** (client, bartender, admin)
- **Stripe Connect** for secure payment processing
- **Middleware protection** for admin/bartender routes

## 🤖 AI Concierge Tools

The AI Concierge uses the Vercel AI SDK with tool calling:

1. **get_recipe** - Search cocktails by name/type
2. **estimate_shopping_list** - Calculate bottles needed
3. **check_safety** - Verify TABC compliance (bartender-to-guest ratio)
4. **search_talent** - Find available bartenders by date/location
5. **get_upsells** - Display premium service packages

## 📊 Database Schema

**Core Tables:**
- `profiles` - User accounts (client/bartender/admin)
- `bartender_details` - Bartender profiles, rates, Stripe Connect accounts
- `bookings` - Event bookings with status tracking
- `payments` - Stripe payment logs

**Knowledge Base:**
- `cocktails` - Recipe database
- `shopping_guides` - Spirit recommendations
- `safety_rules` - TABC compliance rules
- `service_addons` - Premium upsells

## 🚢 Deployment

**Vercel (Recommended):**
```bash
vercel deploy
```

Configure environment variables in Vercel dashboard.

**Supabase:**
- Already hosted as part of setup

**Stripe Connect:**
- Webhook endpoints must be configured for production

## 📝 Key Workflows

### Client Flow
1. Sign up as client
2. Use AI Concierge to plan event
3. Search for bartenders
4. Create booking
5. Pay via Stripe Embedded Checkout

### Bartender Flow
1. Sign up as bartender
2. Complete profile (rate, experience, specialties)
3. Stripe Connect onboarding
4. Wait for admin approval
5. Receive bookings and payouts

### Admin Flow
1. Access /admin dashboard
2. Review pending bartender applications
3. Approve or reject based on qualifications

## 🔧 Development

**Run linter:**
```bash
npm run lint
```

**Build for production:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

## 📄 License

Proprietary - Black Orchid Bar Co.

## 🙏 Credits

Built with Next.js, Supabase, Stripe, and OpenAI.

---

**Need help?** Check the `/lib/data/` knowledge base files to understand the Dry Hire model and AI agent logic.
