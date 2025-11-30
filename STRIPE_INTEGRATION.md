# Stripe Integration Guide

This document provides a comprehensive guide to the Stripe integration for the Black Orchid Bar platform.

## Overview

The Black Orchid Bar platform uses Stripe for:
- **Stripe Connect Express** - Bartender payouts via Connect accounts
- **Stripe Embedded Checkout** - Client payments for bookings
- **Automatic payment processing** - 15% platform fee with direct transfers to bartenders

## Architecture

### Payment Flow

1. **Client initiates booking** - Creates a booking record (status: `inquiry`)
2. **Client proceeds to checkout** - Calls `/api/stripe/checkout` to create checkout session
3. **Payment processing** - Stripe processes payment with Connect transfer
4. **Webhook notification** - Stripe webhook updates payment status
5. **Booking confirmation** - Booking status changes to `confirmed` on payment success

### Bartender Onboarding Flow

1. **Bartender signs up** - Creates profile with role: `bartender`
2. **Onboarding initiation** - Calls `/api/stripe/account-session`
3. **Stripe Connect account creation** - Express account created if doesn't exist
4. **Complete onboarding** - Bartender completes Stripe Connect embedded onboarding
5. **Account activated** - `stripe_account_id` saved to `bartender_details` table

## API Routes

### POST /api/stripe/checkout

Creates a Stripe Checkout session for a booking payment.

**Authentication**: Required (client must be authenticated)

**Request Body**:
```typescript
{
  bookingId: string      // UUID of the booking
  amount: number         // Total amount in dollars (e.g., 500.00)
  bartenderId: string    // UUID of the bartender
}
```

**Response**:
```typescript
{
  clientSecret: string   // Checkout session client secret
}
```

**Validations**:
- User must be authenticated
- Booking must exist and belong to the authenticated user
- Bartender must be approved (`approval_status: 'approved'`)
- Bartender must have a valid `stripe_account_id`
- Amount must be greater than 0

**Database Operations**:
- Creates a record in `payments` table with status: `pending`
- Stores payment metadata (session_id, client_id, bartender_id, platform fee)

**Platform Fee**: 15% of total amount

**Error Responses**:
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (booking doesn't belong to user)
- `404` - Booking or bartender not found
- `400` - Invalid request (missing fields, bartender not configured, etc.)
- `500` - Server error

---

### POST /api/stripe/account-session

Creates a Stripe Account Session for bartender onboarding.

**Authentication**: Required (user must have role: `bartender`)

**Request Body**: None

**Response**:
```typescript
{
  clientSecret: string   // Account session client secret
}
```

**Validations**:
- User must be authenticated
- User role must be `bartender`

**Database Operations**:
- Creates or retrieves Stripe Connect Express account
- Upserts `bartender_details` with `stripe_account_id`

**Account Components Enabled**:
- `account_onboarding` - Complete account setup
- `payments` - View payment information
- `payouts` - Manage payout settings

**Error Responses**:
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (user is not a bartender)
- `404` - Profile not found
- `500` - Server error

---

### POST /api/stripe/webhook

Handles Stripe webhook events and updates database accordingly.

**Authentication**: Validated via Stripe webhook signature

**Handled Events**:

#### `payment_intent.succeeded`
- Updates `payments` table: status → `succeeded`
- Updates `bookings` table: status → `confirmed` (if currently `inquiry`)
- Records `stripe_charge_id`

#### `payment_intent.payment_failed`
- Updates `payments` table: status → `failed`
- Stores error details in metadata

#### `payment_intent.canceled`
- Updates `payments` table: status → `canceled`

#### `payment_intent.processing`
- Updates `payments` table: status → `processing`

#### `account.updated`
- Logs account onboarding completion
- Updates `bartender_details` when account is fully activated

#### `charge.refunded`
- Updates `payments` table: status → `refunded`

**Security**:
- Validates webhook signature using `STRIPE_WEBHOOK_SECRET`
- Uses Supabase service role key to bypass RLS policies
- Returns 400 for invalid signatures

**Error Handling**:
- Returns `received: true` even if database update fails (prevents webhook retry storms)
- Logs all errors for manual investigation

## Database Schema

### payments table

```sql
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete set null,
  stripe_payment_intent_id text unique,
  stripe_charge_id text,
  amount_cents integer not null,
  currency text default 'usd',
  status text not null,
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

**Status Values**:
- `pending` - Payment initiated but not yet processed
- `processing` - Payment is being processed
- `requires_action` - Payment requires additional user action
- `succeeded` - Payment completed successfully
- `failed` - Payment failed
- `canceled` - Payment was canceled
- `refunded` - Payment was refunded
- `partially_refunded` - Payment was partially refunded

### bartender_details table

Stores Stripe Connect account IDs:
```sql
create table public.bartender_details (
  user_id uuid references public.profiles(id) primary key,
  stripe_account_id text,
  approval_status approval_status default 'pending',
  -- ... other fields
);
```

## Environment Variables

Required environment variables in `.env.local`:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## TypeScript Types

All Stripe-related types are defined in `/lib/types/stripe.ts`:

```typescript
// Request/Response types
export interface CheckoutSessionRequest { ... }
export interface CheckoutSessionResponse { ... }
export interface AccountSessionResponse { ... }

// Database types
export interface PaymentRecord { ... }
export interface BartenderDetails { ... }
export interface BookingRecord { ... }

// Status types
export type PaymentStatus = 'pending' | 'processing' | ...
export type BookingStatus = 'inquiry' | 'confirmed' | ...

// Configuration
export const PLATFORM_FEE_PERCENTAGE = 0.15
export const STRIPE_API_VERSION = '2024-11-20.acacia'
```

## Utility Functions

Located in `/lib/stripe/utils.ts`:

```typescript
// Client initialization
getStripeClient(): Stripe

// Account management
isStripeAccountOnboarded(accountId: string): Promise<boolean>
createExpressAccount(userId: string): Promise<string>
deleteExpressAccount(accountId: string): Promise<boolean>
getAccountOnboardingStatus(accountId: string): Promise<object>

// Amount formatting
calculatePlatformFee(amountInCents: number): number
formatStripeAmount(amountInCents: number): string
dollarsToStripeAmount(dollars: number): number

// Webhook validation
validateWebhookSignature(body, signature, secret): Stripe.Event | null
```

## Testing

### Stripe Test Cards

Use these test card numbers in development:

- **Success**: `4242 4242 4242 4242`
- **Requires Authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

All test cards:
- Any future expiration date (e.g., 12/34)
- Any 3-digit CVC
- Any 5-digit ZIP code

### Testing Webhooks Locally

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the webhook signing secret from the output and update `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. Trigger test events:
```bash
stripe trigger payment_intent.succeeded
```

## Production Setup

### 1. Stripe Dashboard Configuration

1. Navigate to [Stripe Dashboard](https://dashboard.stripe.com)
2. Enable Connect:
   - Go to **Connect → Settings**
   - Set up Connect platform
   - Choose **Express** as account type

3. Configure webhooks:
   - Go to **Developers → Webhooks**
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events to listen to:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `payment_intent.processing`
     - `account.updated`
     - `charge.refunded`

4. Get API keys:
   - Go to **Developers → API keys**
   - Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy **Secret key** → `STRIPE_SECRET_KEY`
   - Copy **Webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

### 2. Environment Variables

Update production environment variables in Vercel or your hosting platform:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Database Migration

Ensure the `payments` table exists in production:

```bash
# Run the schema migration
psql $DATABASE_URL -f supabase/schema.sql
```

## Security Best Practices

1. **Never expose secret keys** - Keep `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` server-side only
2. **Validate webhook signatures** - Always verify webhook signatures before processing
3. **Use HTTPS in production** - Stripe requires HTTPS for webhooks
4. **Implement idempotency** - Handle duplicate webhook events gracefully
5. **Use RLS policies** - Ensure proper Row Level Security on all tables
6. **Audit platform fees** - Regularly verify platform fee calculations
7. **Monitor failed payments** - Set up alerts for payment failures
8. **Secure metadata** - Don't store sensitive data in Stripe metadata

## Troubleshooting

### Common Issues

**Issue**: Checkout session creation fails with "account not found"
- **Solution**: Ensure bartender has completed Stripe Connect onboarding
- Check `bartender_details.stripe_account_id` is populated

**Issue**: Webhook returns 400 "signature verification failed"
- **Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret
- In development, use `stripe listen` to get the correct secret

**Issue**: Payment succeeds but booking status doesn't update
- **Solution**: Check webhook logs in Stripe Dashboard
- Verify webhook endpoint is accessible from Stripe servers (must be public)
- Check Supabase logs for database errors

**Issue**: Bartender can't receive payouts
- **Solution**: Check Connect account status in Stripe Dashboard
- Verify account has completed onboarding (`charges_enabled` and `payouts_enabled`)
- Review required fields in account requirements

**Issue**: Platform fee calculation is incorrect
- **Solution**: Verify `PLATFORM_FEE_PERCENTAGE` constant (should be 0.15)
- Check rounding logic in amount calculations
- Ensure amounts are in cents before fee calculation

## Monitoring

### Key Metrics to Track

1. **Payment Success Rate** - Track ratio of succeeded vs failed payments
2. **Average Payment Processing Time** - Monitor checkout to confirmation time
3. **Webhook Delivery Rate** - Ensure webhooks are being received
4. **Failed Onboardings** - Track bartenders who don't complete Connect setup
5. **Platform Fee Revenue** - Monitor total platform fees collected

### Logging

All Stripe operations log to console with appropriate context:
```typescript
console.log(`Payment succeeded for intent: ${paymentIntent.id}`)
console.error('Stripe checkout error:', error)
```

Set up log aggregation (e.g., Datadog, LogRocket) to monitor production errors.

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe Support](https://support.stripe.com)

For platform-specific issues:
- Review this documentation
- Check Supabase logs
- Inspect Stripe Dashboard for payment details
