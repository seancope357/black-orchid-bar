'use client'

import { useState, useEffect } from 'react'
import { loadConnectAndInitialize } from '@stripe/connect-js'
import { ConnectAccountOnboarding } from '@stripe/react-connect-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function BartenderOnboarding() {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    hourlyRate: '',
    yearsExperience: '',
    isTABCCertified: false,
    serviceArea: '',
    bio: '',
    specialties: [] as string[],
  })
  const [step, setStep] = useState<'profile' | 'stripe'>('profile')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (step === 'stripe') {
      fetchClientSecret()
    }
  }, [step])

  const fetchClientSecret = async () => {
    const response = await fetch('/api/stripe/account-session', {
      method: 'POST',
    })
    const { clientSecret } = await response.json()

    const instance = loadConnectAndInitialize({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      fetchClientSecret: async () => clientSecret,
      appearance: {
        variables: {
          colorPrimary: '#D4AF37', // Gold
          colorBackground: '#1a1a1a',
          colorText: '#ffffff',
        },
      },
    })

    setStripeConnectInstance(instance)
    setLoading(false)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('bartender_details')
      .upsert({
        user_id: user.id,
        hourly_rate: parseInt(formData.hourlyRate),
        years_experience: parseInt(formData.yearsExperience),
        is_tabc_certified: formData.isTABCCertified,
        service_area: formData.serviceArea,
        bio: formData.bio,
        specialties: formData.specialties,
      })

    if (error) {
      console.error('Error saving profile:', error)
      return
    }

    setStep('stripe')
  }

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialty],
      })
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    })
  }

  if (step === 'profile') {
    return (
      <div className="min-h-screen bg-background py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary">Bartender Onboarding</h1>
            <p className="mt-2 text-muted-foreground">Tell us about your experience</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6 bg-card p-8 rounded-lg border border-border">
            <div>
              <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                required
                min="25"
                max="500"
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                required
                min="0"
                max="50"
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Service Area</label>
              <input
                type="text"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                placeholder="e.g., Austin, TX"
                required
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Tell clients about your style and experience..."
                className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTABCCertified}
                  onChange={(e) => setFormData({ ...formData, isTABCCertified: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">I am TABC Certified</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Specialties</label>
              <div className="flex gap-2 mb-2">
                {['Craft Cocktails', 'Flair Bartending', 'Wine Service', 'Mocktails', 'High Volume'].map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => addSpecialty(specialty)}
                    className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground"
                  >
                    + {specialty}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full flex items-center gap-2"
                  >
                    {specialty}
                    <button type="button" onClick={() => removeSpecialty(specialty)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
            >
              Continue to Payment Setup
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Payment Setup</h1>
          <p className="mt-2 text-muted-foreground">Connect your bank account to receive payments</p>
        </div>

        {loading && <div className="text-center">Loading Stripe...</div>}

        {stripeConnectInstance && (
          <ConnectAccountOnboarding
            stripeConnectInstance={stripeConnectInstance}
            onExit={() => router.push('/bartender/dashboard')}
          />
        )}
      </div>
    </div>
  )
}
