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

    // Check if user is a bartender
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'bartender') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    // Get or create Stripe Connect account
    let { data: bartenderDetails } = await supabase
      .from('bartender_details')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .single()

    let accountId = bartenderDetails?.stripe_account_id

    // Create new Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
        },
        business_type: 'individual',
      })

      accountId = account.id

      // Update database with new account ID
      await supabase
        .from('bartender_details')
        .upsert({
          user_id: user.id,
          stripe_account_id: accountId,
        })
    }

    // Create account session for embedded onboarding
    const accountSession = await stripe.accountSessions.create({
      account: accountId,
      components: {
        account_onboarding: { enabled: true },
      },
    })

    return NextResponse.json({ clientSecret: accountSession.client_secret })
  } catch (error: any) {
    console.error('Stripe account session error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
