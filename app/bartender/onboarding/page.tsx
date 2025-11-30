'use client'

import { useState, useEffect } from 'react'
import { loadConnectAndInitialize } from '@stripe/connect-js'
import { ConnectAccountOnboarding } from '@stripe/react-connect-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { GlassCard } from '@/components/ui/glass-card'
import { GoldButton } from '@/components/ui/gold-button'
import { Input } from '@/components/ui/input'

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
        approval_status: 'pending',
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
      <>
        <Navbar />
        <div className="min-h-screen bg-black py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-5xl text-white mb-2">Bartender Onboarding</h1>
            <p className="text-white/60 text-lg">Tell us about your experience</p>
          </div>

          <GlassCard>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <Input
                type="number"
                label="Hourly Rate ($)"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                required
                min="25"
                max="500"
                placeholder="50"
              />

              <Input
                type="number"
                label="Years of Experience"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                required
                min="0"
                max="50"
                placeholder="5"
              />

              <Input
                type="text"
                label="Service Area"
                value={formData.serviceArea}
                onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                placeholder="e.g., Austin, TX"
                required
              />

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Tell clients about your style and experience..."
                  className="flex w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 transition-colors duration-200 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTABCCertified}
                    onChange={(e) => setFormData({ ...formData, isTABCCertified: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  />
                  <span className="text-sm text-white/90">I am TABC Certified</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['Craft Cocktails', 'Flair Bartending', 'Wine Service', 'Mocktails', 'High Volume'].map((specialty) => (
                    <button
                      key={specialty}
                      type="button"
                      onClick={() => addSpecialty(specialty)}
                      className="px-3 py-1 text-xs bg-white/5 text-white/60 rounded-full hover:bg-yellow-500/20 hover:text-yellow-500 border border-white/10 transition-all"
                    >
                      + {specialty}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 text-sm bg-yellow-500/20 text-yellow-400 rounded-full flex items-center gap-2 border border-yellow-500/30"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="hover:text-yellow-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <GoldButton type="submit" className="w-full">
                Continue to Payment Setup
              </GoldButton>
            </form>
          </GlassCard>
        </div>
      </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-5xl text-white mb-2">Payment Setup</h1>
          <p className="text-white/60 text-lg">Connect your bank account to receive payments</p>
        </div>

        {loading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-500 border-r-transparent"></div>
            <p className="mt-4 text-white/60">Loading Stripe...</p>
          </div>
        )}

        {stripeConnectInstance && (
          <ConnectAccountOnboarding
            stripeConnectInstance={stripeConnectInstance}
            onExit={() => router.push('/bartender/dashboard')}
          />
        )}
      </div>
    </div>
    </>
  )
}
