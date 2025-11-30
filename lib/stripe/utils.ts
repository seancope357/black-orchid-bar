import Stripe from 'stripe'
import { STRIPE_API_VERSION } from '@/lib/types/stripe'

/**
 * Creates a Stripe client instance with proper configuration
 * @throws {Error} if STRIPE_SECRET_KEY is not configured
 */
export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  })
}

/**
 * Validates if a Stripe account is fully onboarded and can receive payments
 * @param accountId - Stripe Connect account ID
 * @returns Promise<boolean> - true if account can receive payments
 */
export async function isStripeAccountOnboarded(accountId: string): Promise<boolean> {
  try {
    const stripe = getStripeClient()
    const account = await stripe.accounts.retrieve(accountId)
    return account.charges_enabled && account.payouts_enabled
  } catch (error) {
    console.error('Error checking Stripe account status:', error)
    return false
  }
}

/**
 * Calculates the platform fee amount in cents
 * @param amountInCents - Total transaction amount in cents
 * @param feePercentage - Platform fee percentage (default 0.15 for 15%)
 * @returns Platform fee amount in cents
 */
export function calculatePlatformFee(
  amountInCents: number,
  feePercentage: number = 0.15
): number {
  return Math.round(amountInCents * feePercentage)
}

/**
 * Formats a Stripe amount (in cents) to dollars for display
 * @param amountInCents - Amount in cents
 * @returns Formatted dollar amount string (e.g., "$125.00")
 */
export function formatStripeAmount(amountInCents: number): string {
  const dollars = amountInCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars)
}

/**
 * Converts a dollar amount to cents for Stripe
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function dollarsToStripeAmount(dollars: number): number {
  return Math.round(dollars * 100)
}

/**
 * Validates a Stripe webhook signature
 * @param body - Raw request body as string
 * @param signature - Stripe signature from header
 * @param webhookSecret - Webhook secret key
 * @returns Parsed Stripe Event or null if validation fails
 */
export function validateWebhookSignature(
  body: string,
  signature: string,
  webhookSecret: string
): Stripe.Event | null {
  try {
    const stripe = getStripeClient()
    return stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature validation failed:', error)
    return null
  }
}

/**
 * Gets the onboarding status of a Stripe Connect account
 * @param accountId - Stripe Connect account ID
 * @returns Object with onboarding completion details
 */
export async function getAccountOnboardingStatus(accountId: string) {
  try {
    const stripe = getStripeClient()
    const account = await stripe.accounts.retrieve(accountId)

    return {
      isOnboarded: account.charges_enabled && account.payouts_enabled,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      currentlyDue: account.requirements?.currently_due || [],
      eventuallyDue: account.requirements?.eventually_due || [],
      pastDue: account.requirements?.past_due || [],
    }
  } catch (error) {
    console.error('Error retrieving account status:', error)
    throw error
  }
}

/**
 * Creates a Stripe Express account for a bartender
 * @param userId - User ID from the database
 * @returns Stripe account ID
 */
export async function createExpressAccount(userId: string): Promise<string> {
  const stripe = getStripeClient()
  const account = await stripe.accounts.create({
    type: 'express',
    capabilities: {
      transfers: { requested: true },
    },
    business_type: 'individual',
    metadata: {
      user_id: userId,
    },
  })
  return account.id
}

/**
 * Deletes a Stripe Express account
 * @param accountId - Stripe Connect account ID
 * @returns Promise<boolean> - true if deletion was successful
 */
export async function deleteExpressAccount(accountId: string): Promise<boolean> {
  try {
    const stripe = getStripeClient()
    await stripe.accounts.del(accountId)
    return true
  } catch (error) {
    console.error('Error deleting Stripe account:', error)
    return false
  }
}
