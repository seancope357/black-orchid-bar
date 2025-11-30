import Stripe from 'stripe'

// Request/Response Types for Stripe API Routes
export interface CheckoutSessionRequest {
  bookingId: string
  amount: number
  bartenderId: string
}

export interface CheckoutSessionResponse {
  clientSecret: string
}

export interface AccountSessionResponse {
  clientSecret: string
}

export interface StripeErrorResponse {
  error: string
}

// Database Types
export interface PaymentRecord {
  id?: string
  booking_id: string
  stripe_payment_intent_id: string
  stripe_charge_id?: string
  amount_cents: number
  currency: string
  status: PaymentStatus
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'requires_action'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'
  | 'partially_refunded'

export interface BartenderDetails {
  user_id: string
  stripe_account_id: string | null
  approval_status: 'pending' | 'approved' | 'rejected'
  hourly_rate: number | null
  years_experience: number | null
  is_tabc_certified: boolean
  specialties: string[] | null
  service_area: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface BookingRecord {
  id: string
  client_id: string
  bartender_id: string
  event_date: string
  event_duration_hours: number
  guest_count: number
  event_type: string | null
  special_requests: string | null
  status: BookingStatus
  total_amount: string | null
  created_at: string
  updated_at: string
}

export type BookingStatus = 'inquiry' | 'confirmed' | 'completed' | 'cancelled'

// Stripe Webhook Event Types
export type StripeWebhookEvent = Stripe.Event

export interface PaymentIntentMetadata {
  booking_id: string
  client_id: string
  bartender_id: string
}

// Platform Fee Configuration
export const PLATFORM_FEE_PERCENTAGE = 0.15 // 15% platform fee
export const STRIPE_API_VERSION = '2024-11-20.acacia' as const

// Helper function types
export type CreatePaymentRecordFn = (
  paymentIntent: Stripe.PaymentIntent
) => Promise<PaymentRecord>

export type UpdatePaymentStatusFn = (
  paymentIntentId: string,
  status: PaymentStatus,
  chargeId?: string
) => Promise<void>
