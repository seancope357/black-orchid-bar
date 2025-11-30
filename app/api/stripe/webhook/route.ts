import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import {
  PaymentStatus,
  PaymentRecord,
  STRIPE_API_VERSION,
  PaymentIntentMetadata,
} from '@/lib/types/stripe'

export const dynamic = 'force-dynamic'

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  })
}

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration is missing')
  }
  // Use service role key for webhook operations (bypasses RLS)
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function mapStripeStatusToPaymentStatus(status: string): PaymentStatus {
  switch (status) {
    case 'processing':
      return 'processing'
    case 'requires_action':
    case 'requires_confirmation':
    case 'requires_payment_method':
      return 'requires_action'
    case 'succeeded':
      return 'succeeded'
    case 'canceled':
      return 'canceled'
    default:
      return 'failed'
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof getSupabaseClient>
) {
  const metadata = paymentIntent.metadata as unknown as PaymentIntentMetadata
  // Retrieve the full payment intent with charges expanded
  const stripe = getStripeClient()
  const fullPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
    expand: ['charges'],
  })
  const charge = (fullPaymentIntent.charges as Stripe.ApiList<Stripe.Charge>)?.data[0]

  // Update payment record
  const { error: updateError } = await supabase
    .from('payments')
    .update({
      status: 'succeeded',
      stripe_charge_id: charge?.id,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (updateError) {
    console.error('Failed to update payment record:', updateError)
    throw new Error('Database update failed')
  }

  // Update booking status to confirmed if payment succeeded
  if (metadata.booking_id) {
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', metadata.booking_id)
      .eq('status', 'inquiry') // Only update if still in inquiry state

    if (bookingError) {
      console.error('Failed to update booking status:', bookingError)
    }
  }

  console.log(`Payment succeeded for intent: ${paymentIntent.id}`)
}

async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof getSupabaseClient>
) {
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'failed',
      metadata: {
        last_payment_error: paymentIntent.last_payment_error,
      },
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Failed to update payment record:', error)
    throw new Error('Database update failed')
  }

  console.log(`Payment failed for intent: ${paymentIntent.id}`)
}

async function handlePaymentIntentCanceled(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof getSupabaseClient>
) {
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Failed to update payment record:', error)
    throw new Error('Database update failed')
  }

  console.log(`Payment canceled for intent: ${paymentIntent.id}`)
}

async function handlePaymentIntentProcessing(
  paymentIntent: Stripe.PaymentIntent,
  supabase: ReturnType<typeof getSupabaseClient>
) {
  const { error } = await supabase
    .from('payments')
    .update({
      status: 'processing',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  if (error) {
    console.error('Failed to update payment record:', error)
  }

  console.log(`Payment processing for intent: ${paymentIntent.id}`)
}

async function handleAccountUpdated(
  account: Stripe.Account,
  supabase: ReturnType<typeof getSupabaseClient>
) {
  // Check if account is fully onboarded
  const isOnboarded = account.charges_enabled && account.payouts_enabled

  if (isOnboarded) {
    console.log(`Stripe account ${account.id} is fully onboarded`)

    // Update bartender_details if we have user_id in metadata
    if (account.metadata?.user_id) {
      const { error } = await supabase
        .from('bartender_details')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', account.metadata.user_id)
        .eq('stripe_account_id', account.id)

      if (error) {
        console.error('Failed to update bartender details:', error)
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const stripe = getStripeClient()
  const supabase = getSupabaseClient()

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    const error = err as Error
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }

  console.log(`Processing webhook event: ${event.type}`)

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          supabase
        )
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent,
          supabase
        )
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(
          event.data.object as Stripe.PaymentIntent,
          supabase
        )
        break

      case 'payment_intent.processing':
        await handlePaymentIntentProcessing(
          event.data.object as Stripe.PaymentIntent,
          supabase
        )
        break

      case 'account.updated':
        await handleAccountUpdated(
          event.data.object as Stripe.Account,
          supabase
        )
        break

      case 'charge.refunded':
        const charge = event.data.object as Stripe.Charge
        if (charge.payment_intent) {
          const { error } = await supabase
            .from('payments')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_payment_intent_id', charge.payment_intent as string)

          if (error) {
            console.error('Failed to update refunded payment:', error)
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
