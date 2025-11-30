import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, amount, bartenderId } = await req.json()

    // Get bartender's Stripe account ID
    const { data: bartenderDetails } = await supabase
      .from('bartender_details')
      .select('stripe_account_id')
      .eq('user_id', bartenderId)
      .single()

    if (!bartenderDetails?.stripe_account_id) {
      return NextResponse.json(
        { error: 'Bartender payment account not configured' },
        { status: 400 }
      )
    }

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
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: Math.round(amount * 0.15 * 100), // 15% platform fee
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

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
