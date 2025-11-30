import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  StripeErrorResponse,
  PLATFORM_FEE_PERCENTAGE,
  STRIPE_API_VERSION,
  PaymentRecord,
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

export async function POST(
  req: NextRequest
): Promise<NextResponse<CheckoutSessionResponse | StripeErrorResponse>> {
  try {
    const stripe = getStripeClient()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body: CheckoutSessionRequest = await req.json()
    const { bookingId, amount, bartenderId } = body

    if (!bookingId || !amount || !bartenderId) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, amount, bartenderId' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Verify booking exists and belongs to the user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, client_id, bartender_id, status, total_amount')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.client_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to create payment for this booking' },
        { status: 403 }
      )
    }

    if (booking.bartender_id !== bartenderId) {
      return NextResponse.json(
        { error: 'Bartender ID mismatch with booking' },
        { status: 400 }
      )
    }

    // Get bartender's Stripe account ID
    const { data: bartenderDetails, error: bartenderError } = await supabase
      .from('bartender_details')
      .select('stripe_account_id, approval_status')
      .eq('user_id', bartenderId)
      .single()

    if (bartenderError || !bartenderDetails) {
      return NextResponse.json(
        { error: 'Bartender details not found' },
        { status: 404 }
      )
    }

    if (!bartenderDetails.stripe_account_id) {
      return NextResponse.json(
        { error: 'Bartender payment account not configured' },
        { status: 400 }
      )
    }

    if (bartenderDetails.approval_status !== 'approved') {
      return NextResponse.json(
        { error: 'Bartender is not approved for bookings' },
        { status: 400 }
      )
    }

    const amountInCents = Math.round(amount * 100)
    const platformFeeInCents = Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100)

    // Create checkout session with Stripe Connect
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Black Orchid Bartending Service',
              description: 'Professional bartending service for your event',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeInCents,
        transfer_data: {
          destination: bartenderDetails.stripe_account_id,
        },
        metadata: {
          booking_id: bookingId,
          client_id: user.id,
          bartender_id: bartenderId,
        },
      },
      metadata: {
        booking_id: bookingId,
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/${bookingId}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    })

    // Create initial payment record in database
    const paymentRecord: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'> = {
      booking_id: bookingId,
      stripe_payment_intent_id: session.payment_intent as string,
      amount_cents: amountInCents,
      currency: 'usd',
      status: 'pending',
      metadata: {
        session_id: session.id,
        client_id: user.id,
        bartender_id: bartenderId,
        platform_fee_cents: platformFeeInCents,
      },
    }

    const { error: paymentError } = await supabase
      .from('payments')
      .insert(paymentRecord)

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      // Don't fail the entire request if payment logging fails
      // The webhook will handle updates when payment completes
    }

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error)

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    const isStripeError = error && typeof error === 'object' && 'type' in error

    return NextResponse.json(
      {
        error: errorMessage,
        type: isStripeError ? (error as any).type : 'api_error'
      },
      { status: 500 }
    )
  }
}
