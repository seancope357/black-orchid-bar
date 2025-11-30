import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import {
  AccountSessionResponse,
  StripeErrorResponse,
  STRIPE_API_VERSION,
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
): Promise<NextResponse<AccountSessionResponse | StripeErrorResponse>> {
  try {
    const stripe = getStripeClient()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a bartender
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    if (profile.role !== 'bartender') {
      return NextResponse.json(
        { error: 'Only bartenders can access Stripe Connect onboarding' },
        { status: 403 }
      )
    }

    // Get or create Stripe Connect account
    const { data: bartenderDetails, error: detailsError } = await supabase
      .from('bartender_details')
      .select('stripe_account_id, user_id')
      .eq('user_id', user.id)
      .single()

    let accountId = bartenderDetails?.stripe_account_id

    // Create new Connect account if doesn't exist
    if (!accountId) {
      console.log(`Creating new Stripe Connect account for user: ${user.id}`)

      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          user_id: user.id,
        },
      })

      accountId = account.id

      // Update or insert bartender_details with new account ID
      const { error: upsertError } = await supabase
        .from('bartender_details')
        .upsert({
          user_id: user.id,
          stripe_account_id: accountId,
        }, {
          onConflict: 'user_id',
        })

      if (upsertError) {
        console.error('Failed to save Stripe account ID:', upsertError)
        // Attempt to delete the Stripe account if DB update fails
        try {
          await stripe.accounts.del(accountId)
        } catch (deleteError) {
          console.error('Failed to cleanup Stripe account:', deleteError)
        }
        return NextResponse.json(
          { error: 'Failed to save account information' },
          { status: 500 }
        )
      }
    } else {
      // Verify the Stripe account still exists
      try {
        await stripe.accounts.retrieve(accountId)
      } catch (retrieveError) {
        console.error('Stripe account no longer exists:', retrieveError)
        return NextResponse.json(
          { error: 'Stripe account configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }

    // Create account session for embedded onboarding
    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: { enabled: true },
        payments: { enabled: true },
        payouts: { enabled: true },
      },
    })

    return NextResponse.json({ clientSecret: accountSession.client_secret })
  } catch (error: unknown) {
    console.error('Stripe account session error:', error)

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
