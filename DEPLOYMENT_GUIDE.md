# Black Orchid Bar - Deployment & Testing Guide

This guide will help you set up, test, and deploy the Black Orchid Bar marketplace platform.

## 🚀 Quick Start (Local Development)

### 1. Environment Setup

Ensure your `.env.local` file has all required variables:

```bash
# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (Need to add real keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Replace with your test key
STRIPE_SECRET_KEY=sk_test_...                   # Replace with your test key
STRIPE_WEBHOOK_SECRET=whsec_...                 # Get from Stripe CLI

# OpenAI (Already configured)
OPENAI_API_KEY=your_openai_api_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Update `.env.local` with these keys

### 3. Database Setup

Deploy the database schema to Supabase:

```bash
# Option 1: Copy the SQL to Supabase SQL Editor
# Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
# Paste the contents of: supabase/schema.sql
# Click "Run"

# Option 2: Use Supabase CLI (if installed)
supabase db push
```

### 4. Seed Sample Data (Optional)

Create some test data for development:

```sql
-- In Supabase SQL Editor:

-- Create a test admin user (after signing up via the app)
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Add sample service add-ons
INSERT INTO service_addons (name, description, price, unit, category, is_active)
VALUES
  ('Gold Standard Mixer Package', 'Premium mixers, garnishes, and syrups', 8.00, 'per_guest', 'mixers', true),
  ('Luxury Garnish Kit', 'Fresh herbs, specialty garnishes, and premium fruits', 5.00, 'per_guest', 'garnishes', true),
  ('Clear Ice Service', 'Professional clear ice blocks for premium cocktails', 150.00, 'per_event', 'equipment', true),
  ('Mobile Bar Setup', 'Professional portable bar with backlit shelving', 300.00, 'per_event', 'equipment', true);
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

## 🧪 Testing the Application

### Test User Flows

#### 1. Client Flow

```bash
# Create a client account
1. Go to http://localhost:3000/auth/signup
2. Fill in details and select "Client" role
3. Sign up
4. You'll be redirected to the home page

# Create a booking
5. Click "Book Now" or go to /booking
6. Complete all 6 steps of the booking wizard:
   - Event details (date, guests, duration)
   - Safety check (automatic)
   - Select a bartender (needs approved bartenders in DB)
   - Review shopping list (AI-calculated)
   - Select add-ons (optional)
   - Complete payment (use Stripe test card: 4242 4242 4242 4242)

# View dashboard
7. Go to /dashboard/client
8. See your bookings
9. Click on a booking to view details
```

#### 2. Bartender Flow

```bash
# Create a bartender account
1. Go to http://localhost:3000/auth/signup
2. Fill in details and select "Bartender" role
3. Sign up
4. You'll be redirected to /bartender/onboarding

# Complete onboarding
5. Fill in profile details:
   - Hourly rate
   - Years of experience
   - Service area
   - Specialties
   - TABC certification
6. Click "Continue to Stripe Setup"
7. Complete Stripe Connect onboarding
8. You'll be redirected to /bartender/dashboard

# Dashboard
9. View approval status (will be "pending")
10. See bookings section (will be empty until approved)

# Get approved (as admin)
11. Log out and log in as admin
12. Go to /admin
13. Approve the bartender

# Back as bartender
14. Log back in as bartender
15. Dashboard now shows full features
```

#### 3. Admin Flow

```bash
# Set admin role (in Supabase SQL Editor)
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

# Access admin dashboard
1. Log in as admin user
2. Go to /admin
3. View pending bartender applications
4. Approve or reject bartenders
```

### Stripe Testing

#### Test Cards

Use these cards in the payment step:

- **Success:** `4242 4242 4242 4242` (any future date, any CVC)
- **Decline:** `4000 0000 0000 0002`
- **Requires authentication:** `4000 0025 0000 3155`

#### Webhook Testing (Local)

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# This will output a webhook signing secret (whsec_...)
# Copy it to STRIPE_WEBHOOK_SECRET in .env.local

# In another terminal, restart your dev server
npm run dev

# Now test a payment - you'll see webhook events in the Stripe CLI
```

#### Trigger Test Events

```bash
# Trigger a successful payment event
stripe trigger payment_intent.succeeded

# Trigger a failed payment event
stripe trigger payment_intent.payment_failed
```

### AI Concierge Testing

```bash
# Open the AI chat widget (bottom-right corner)
# Try these prompts:

1. "I'm planning a wedding for 150 guests. How many bartenders do I need?"
2. "Show me a margarita recipe"
3. "How much alcohol should I buy for 100 guests over 4 hours?"
4. "What premium add-ons do you offer?"
5. "Find me bartenders in Austin"
```

## 🔍 Verification Checklist

Before deploying to production, verify:

- [ ] All pages load without errors
- [ ] Authentication works (signup, login, logout)
- [ ] Role-based access control works (admin, bartender, client)
- [ ] Booking wizard completes all 6 steps
- [ ] Stripe checkout creates payment sessions
- [ ] Webhooks update booking status to "confirmed"
- [ ] Bartender onboarding saves profile and Stripe account ID
- [ ] Admin can approve/reject bartenders
- [ ] Dashboards show real data from database
- [ ] Talent search filters and displays approved bartenders
- [ ] AI Concierge responds with correct information
- [ ] Mobile responsive design works

## 📦 Production Deployment

### 1. Prepare Stripe for Production

```bash
# In Stripe Dashboard:
1. Switch to "Live mode" (toggle in top-left)
2. Get live API keys (pk_live_... and sk_live_...)
3. Enable Stripe Connect
4. Configure production webhook endpoint
   - URL: https://your-domain.com/api/stripe/webhook
   - Events: payment_intent.succeeded, payment_intent.payment_failed,
            charge.refunded, account.updated
5. Copy webhook signing secret
```

### 2. Configure Production Environment Variables

In your deployment platform (Vercel):

```bash
# Supabase (production instance)
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Stripe (LIVE keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From production webhook

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Or connect GitHub repo in Vercel Dashboard for auto-deploys
```

### 4. Deploy Supabase Schema

```bash
# In production Supabase SQL Editor:
1. Go to your production project
2. Navigate to SQL Editor
3. Run the schema from supabase/schema.sql
4. Verify all tables and policies are created
```

### 5. Post-Deployment Verification

- [ ] Test signup/login on production
- [ ] Create a test booking end-to-end
- [ ] Verify Stripe webhook receives events
- [ ] Check database for created records
- [ ] Test all user flows (client, bartender, admin)
- [ ] Verify email confirmations work (if configured)

## 🛠️ Common Issues & Solutions

### Issue: "Supabase client error"
**Solution:** Check that environment variables are set correctly. Ensure the Supabase URL and anon key match your project.

### Issue: "Stripe publishable key must begin with pk_"
**Solution:** Replace the placeholder Stripe keys in `.env.local` with real test keys from Stripe Dashboard.

### Issue: "No bartenders found"
**Solution:** Create a bartender account, complete onboarding, then approve them via the admin dashboard.

### Issue: "Payment fails immediately"
**Solution:**
- Check Stripe keys are correct
- Ensure bartender has completed Stripe Connect onboarding
- Verify `stripe_account_id` is saved in database

### Issue: "Webhooks not working"
**Solution:**
- Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Copy the webhook secret to `.env.local`
- Restart dev server

### Issue: "Admin dashboard shows 403 error"
**Solution:** Update user role in database:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Issue: "Booking wizard step 3 is empty"
**Solution:** Ensure you have approved bartenders. Check:
```sql
SELECT * FROM bartender_details WHERE approval_status = 'approved';
```

## 📊 Monitoring & Analytics

### Database Monitoring

```sql
-- Check booking status distribution
SELECT status, COUNT(*)
FROM bookings
GROUP BY status;

-- Check payment success rate
SELECT status, COUNT(*)
FROM payments
GROUP BY status;

-- List pending bartender approvals
SELECT COUNT(*)
FROM bartender_details
WHERE approval_status = 'pending';
```

### Stripe Dashboard

Monitor in Stripe Dashboard:
- Payment volume and success rates
- Failed payments and reasons
- Connect account statuses
- Refunds and disputes

### Application Logs

Check Vercel logs for:
- API errors
- Webhook processing
- Database query failures
- Authentication issues

## 🎯 Next Steps

After deployment, consider:

1. **Email Notifications**
   - Booking confirmations
   - Bartender approval notifications
   - Payment receipts

2. **Enhanced Features**
   - Bartender availability calendar
   - Booking cancellation/modification
   - Review and rating system
   - Messaging between clients and bartenders

3. **Business Operations**
   - Set up customer support email
   - Create terms of service and privacy policy
   - Configure domain and branding
   - Set up analytics (Google Analytics, Mixpanel)

4. **Marketing**
   - SEO optimization
   - Social media integration
   - Referral program
   - Email marketing campaigns

## 📞 Support Resources

- **Stripe Documentation:** https://stripe.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support

---

**Built with Claude Code** - For questions or issues, refer to the documentation files:
- `CLAUDE.md` - Development guide
- `STRIPE_INTEGRATION.md` - Stripe setup details
- `DASHBOARD_UPDATES.md` - Dashboard architecture
- `README.md` - Project overview
