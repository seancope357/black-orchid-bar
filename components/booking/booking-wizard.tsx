"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check, Loader2, AlertCircle, ShoppingCart, Sparkles } from "lucide-react"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Spinner from "@/components/ui/spinner"
import { createClient } from "@/lib/supabase/client"
import { BartenderCard } from "@/components/bartender-card"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"

type Step = "details" | "safety" | "bartender" | "shopping" | "upsell" | "payment"

interface BookingData {
  eventDate: string
  eventDuration: number
  guestCount: number
  eventType: string
  drinkingLevel: "light" | "moderate" | "heavy"
  specialRequests: string
  selectedBartenderId?: string
  selectedBartender?: any
  shoppingList?: {
    totalDrinks: number
    bottlesNeeded: number
    breakdown: string
  }
  selectedAddons: string[]
  totalAmount: number
}

interface Bartender {
  user_id: string
  hourly_rate: number
  years_experience: number
  specialties: string[]
  service_area: string
  is_tabc_certified: boolean
  profiles: {
    full_name: string
    avatar_url: string
  }
}

interface ServiceAddon {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState<Step>("details")
  const [bookingData, setBookingData] = useState<BookingData>({
    eventDate: "",
    eventDuration: 4,
    guestCount: 0,
    eventType: "",
    drinkingLevel: "moderate",
    specialRequests: "",
    selectedAddons: [],
    totalAmount: 0
  })

  // State for async operations
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bartenders, setBartenders] = useState<Bartender[]>([])
  const [serviceAddons, setServiceAddons] = useState<ServiceAddon[]>([])
  const [recommendedBartenders, setRecommendedBartenders] = useState(1)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const supabase = createClient()

  const steps: Step[] = ["details", "safety", "bartender", "shopping", "upsell", "payment"]
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const stepLabels: Record<Step, string> = {
    details: "Event Details",
    safety: "Safety Check",
    bartender: "Select Bartender",
    shopping: "Shopping List",
    upsell: "Add-Ons",
    payment: "Payment"
  }

  // Validate current step before proceeding
  const validateStep = () => {
    setError(null)

    switch (currentStep) {
      case "details":
        if (!bookingData.eventDate) {
          setError("Please select an event date")
          return false
        }
        if (bookingData.guestCount < 1) {
          setError("Please enter the number of guests")
          return false
        }
        if (!bookingData.eventType) {
          setError("Please specify the event type")
          return false
        }
        return true

      case "safety":
        return true // Auto-calculated, always valid

      case "bartender":
        if (!bookingData.selectedBartenderId) {
          setError("Please select a bartender")
          return false
        }
        return true

      case "shopping":
        return true // Auto-calculated

      case "upsell":
        return true // Optional

      case "payment":
        return true

      default:
        return true
    }
  }

  const nextStep = async () => {
    if (!validateStep()) return

    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      const nextStepName = steps[nextIndex]
      setCurrentStep(nextStepName)

      // Load data for next step
      if (nextStepName === "bartender") {
        await loadBartenders()
      } else if (nextStepName === "shopping") {
        calculateShoppingList()
      } else if (nextStepName === "upsell") {
        await loadServiceAddons()
      } else if (nextStepName === "payment") {
        await createCheckoutSession()
      }
    }
  }

  const prevStep = () => {
    setError(null)
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  // Load approved bartenders from database
  const loadBartenders = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('bartender_details')
        .select(`
          user_id,
          hourly_rate,
          years_experience,
          specialties,
          service_area,
          is_tabc_certified,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('approval_status', 'approved')
        .order('hourly_rate', { ascending: true })

      if (error) throw error

      setBartenders(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load bartenders")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate shopping list using dry hire formula
  const calculateShoppingList = () => {
    const drinksPerHour =
      bookingData.drinkingLevel === "light" ? 1 :
      bookingData.drinkingLevel === "moderate" ? 1.5 : 2

    const totalDrinks = bookingData.guestCount * bookingData.eventDuration * drinksPerHour
    const servingsPerBottle = 17 // 750ml bottle
    const bottlesNeeded = Math.ceil(totalDrinks / servingsPerBottle)

    setBookingData(prev => ({
      ...prev,
      shoppingList: {
        totalDrinks: Math.round(totalDrinks),
        bottlesNeeded,
        breakdown: `For ${bookingData.guestCount} guests over ${bookingData.eventDuration} hours (${bookingData.drinkingLevel} drinking), you'll need approximately ${bottlesNeeded} bottles (750ml).`
      }
    }))
  }

  // Load service addons from database
  const loadServiceAddons = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('service_addons')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (error) throw error

      setServiceAddons(data || [])
    } catch (err: any) {
      setError(err.message || "Failed to load service add-ons")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate recommended bartender count
  const calculateRecommendedBartenders = (guests: number) => {
    return Math.ceil(guests / 60) // 1 per 50-75 guests, using 60 as middle ground
  }

  // Handle addon selection
  const toggleAddon = (addonId: string) => {
    setBookingData(prev => ({
      ...prev,
      selectedAddons: prev.selectedAddons.includes(addonId)
        ? prev.selectedAddons.filter(id => id !== addonId)
        : [...prev.selectedAddons, addonId]
    }))
  }

  // Calculate total amount
  const calculateTotal = () => {
    let total = 0

    // Bartender cost
    if (bookingData.selectedBartender) {
      total += bookingData.selectedBartender.hourly_rate * bookingData.eventDuration
    }

    // Add-ons cost
    bookingData.selectedAddons.forEach(addonId => {
      const addon = serviceAddons.find(a => a.id === addonId)
      if (addon) {
        if (addon.unit === 'per_guest') {
          total += addon.price * bookingData.guestCount
        } else {
          total += addon.price
        }
      }
    })

    return total
  }

  // Create Stripe checkout session
  const createCheckoutSession = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // First, create the booking record
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setError("You must be logged in to complete booking")
        return
      }

      const totalAmount = calculateTotal()

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          bartender_id: bookingData.selectedBartenderId,
          event_date: new Date(bookingData.eventDate).toISOString(),
          event_duration_hours: bookingData.eventDuration,
          guest_count: bookingData.guestCount,
          event_type: bookingData.eventType,
          special_requests: bookingData.specialRequests,
          status: 'inquiry',
          total_amount: totalAmount
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: totalAmount,
          bartenderId: bookingData.selectedBartenderId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { clientSecret: secret } = await response.json()
      setClientSecret(secret)

      setBookingData(prev => ({ ...prev, totalAmount }))
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto max-w-6xl">
        {/* Magazine-Style Progress - Minimalist */}
        <div className="py-12 px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase">
                Chapter {currentStepIndex + 1}
              </p>
              <h3 className="text-white font-serif text-2xl">
                {stepLabels[currentStep]}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-white/40 text-sm">{Math.round(progress)}% Complete</span>
            </div>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step Content - Magazine Style */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 mb-6"
            >
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attention Required</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {currentStep === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Full-width hero image with overlay */}
              <div className="relative h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519167758481-83f29da8d3d4?q=80&w=2574')] bg-cover bg-center" />

                {/* Hero text overlay */}
                <div className="relative z-20 h-full flex items-end">
                  <div className="container mx-auto px-6 pb-12">
                    <h2 className="font-serif text-5xl md:text-6xl text-white mb-4 max-w-2xl leading-tight">
                      Tell us about your <span className="italic">celebration</span>
                    </h2>
                    <p className="text-white/80 text-lg max-w-xl">
                      Every great event starts with the details. Share your vision, and we'll bring it to life.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form content with glassmorphic cards */}
              <div className="px-6 py-12 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                    <Label className="text-white/90 mb-2 text-base">When is your event?</Label>
                    <Input
                      type="date"
                      value={bookingData.eventDate}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, eventDate: e.target.value })
                        setRecommendedBartenders(calculateRecommendedBartenders(bookingData.guestCount))
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2"
                    />
                  </div>

                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                    <Label className="text-white/90 mb-2 text-base">How long will it last?</Label>
                    <Input
                      type="number"
                      placeholder="4"
                      min="1"
                      max="12"
                      value={bookingData.eventDuration || ""}
                      onChange={(e) => setBookingData({ ...bookingData, eventDuration: parseInt(e.target.value) })}
                      className="mt-2"
                    />
                    <p className="text-white/50 text-sm mt-2">Hours of service</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                    <Label className="text-white/90 mb-2 text-base">How many guests?</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      min="1"
                      value={bookingData.guestCount || ""}
                      onChange={(e) => {
                        const count = parseInt(e.target.value)
                        setBookingData({ ...bookingData, guestCount: count })
                        setRecommendedBartenders(calculateRecommendedBartenders(count))
                      }}
                      className="mt-2"
                    />
                  </div>

                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                    <Label className="text-white/90 mb-2 text-base">What's the occasion?</Label>
                    <Input
                      type="text"
                      placeholder="Wedding, Birthday, Corporate..."
                      value={bookingData.eventType}
                      onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Editorial-style callout for drinking level */}
                <div className="p-8 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl">
                  <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-3">
                    Set The Pace
                  </p>
                  <h3 className="text-white font-serif text-2xl mb-4">
                    What's the vibe of your event?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {(["light", "moderate", "heavy"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, drinkingLevel: level })}
                        className={`group p-6 rounded-xl border-2 transition-all ${
                          bookingData.drinkingLevel === level
                            ? "border-yellow-500 bg-yellow-500/10 scale-105"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-white font-semibold text-lg capitalize block mb-2">{level}</span>
                        <p className="text-white/60 text-sm">
                          {level === "light" && "~1 drink per hour • Casual sipping"}
                          {level === "moderate" && "~1.5 drinks per hour • Social flow"}
                          {level === "heavy" && "~2 drinks per hour • High energy"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special requests - editorial textarea */}
                <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
                  <Label className="text-white/90 mb-3 text-base">Any special touches?</Label>
                  <Textarea
                    placeholder="Signature cocktails, dietary restrictions, theme requests, or anything else we should know..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    rows={4}
                    className="bg-white/5 border-white/10"
                  />
                  <p className="text-white/40 text-sm mt-2 italic">Optional, but helps us personalize your experience</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "safety" && (
            <motion.div
              key="safety"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Full-page editorial spread */}
              <div className="grid md:grid-cols-2 gap-0 min-h-[600px]">
                {/* Left: Image */}
                <div className="relative h-[400px] md:h-auto overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50 z-10" />
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2574')] bg-cover bg-center" />
                </div>

                {/* Right: Content */}
                <div className="flex flex-col justify-center px-6 md:px-12 py-12 bg-zinc-900">
                  <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                    Safety First
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                    Compliance is our <span className="italic">commitment</span>
                  </h2>
                  <p className="text-white/70 text-lg mb-8 leading-relaxed">
                    Texas law requires responsible service. We exceed every standard to ensure your event
                    is not just memorable, but safe and compliant.
                  </p>

                  {/* Large pull quote style recommendation */}
                  <div className="p-8 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-l-4 border-yellow-500 rounded-r-2xl mb-8">
                    <p className="text-white/60 text-sm mb-3">For your {bookingData.guestCount} guests, we recommend:</p>
                    <p className="font-serif text-6xl text-yellow-500 mb-2">
                      {recommendedBartenders}
                    </p>
                    <p className="text-white/80 text-xl font-semibold">
                      Certified Bartender{recommendedBartenders > 1 ? "s" : ""}
                    </p>
                    <p className="text-white/50 text-sm mt-4 italic">
                      TABC guidelines: 1 bartender per 50-75 guests
                    </p>
                  </div>

                  {/* Editorial callout boxes */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">100% TABC Certified</h4>
                        <p className="text-white/60 text-sm">Every bartender carries active state certification</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Responsible Service Protocols</h4>
                        <p className="text-white/60 text-sm">ID verification and service refusal training</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Fully Insured Events</h4>
                        <p className="text-white/60 text-sm">Comprehensive liability coverage for your peace of mind</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === "bartender" && (
            <motion.div
              key="bartender"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Hero header */}
              <div className="relative h-[300px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574096079513-d8259312b935?q=80&w=2574')] bg-cover bg-center" />

                <div className="relative z-20 h-full flex items-end">
                  <div className="container mx-auto px-6 pb-12">
                    <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-3">
                      The Talent
                    </p>
                    <h2 className="font-serif text-5xl md:text-6xl text-white mb-4 leading-tight">
                      Choose your <span className="italic">artist</span>
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl">
                      Each bartender brings a unique style and expertise. Select the perfect match for your event.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bartender portfolio grid */}
              <div className="px-6 py-12">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Spinner className="text-yellow-500 mb-6" />
                    <p className="text-white/60 text-lg">Curating our finest talent...</p>
                  </div>
                ) : bartenders.length === 0 ? (
                  <div className="max-w-2xl mx-auto">
                    <Alert variant="warning">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>No Bartenders Available</AlertTitle>
                      <AlertDescription>
                        We couldn't find any available bartenders for your event. Please try different dates or contact support.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bartenders.map((bartender, index) => (
                      <motion.div
                        key={bartender.user_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setBookingData(prev => ({
                            ...prev,
                            selectedBartenderId: bartender.user_id,
                            selectedBartender: bartender
                          }))
                        }}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 ${
                          bookingData.selectedBartenderId === bartender.user_id
                            ? "ring-4 ring-yellow-500 scale-105"
                            : "hover:scale-102"
                        }`}
                      >
                        {/* Portfolio-style card */}
                        <div className="relative h-[450px]">
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                          <div
                            className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                            style={{
                              backgroundImage: `url(${bartender.profiles.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80'})`
                            }}
                          />

                          {/* Selection indicator */}
                          {bookingData.selectedBartenderId === bartender.user_id && (
                            <div className="absolute top-4 right-4 z-30 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-2xl">
                              <Check className="w-7 h-7 text-black" />
                            </div>
                          )}

                          {/* Certifications badges */}
                          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            {bartender.is_tabc_certified && (
                              <span className="inline-block px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-bold uppercase tracking-wider rounded-full">
                                TABC
                              </span>
                            )}
                            {bartender.years_experience >= 5 && (
                              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                                {bartender.years_experience}+ Years
                              </span>
                            )}
                          </div>

                          {/* Content overlay */}
                          <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                            <h3 className="font-serif text-3xl text-white mb-2">
                              {bartender.profiles.full_name}
                            </h3>
                            <p className="text-white/70 text-sm mb-4">
                              {bartender.specialties?.[0] || "Expert Bartender"}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className="text-white font-bold text-lg">4.8</span>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-yellow-500">
                                  ${bartender.hourly_rate}
                                </div>
                                <div className="text-white/60 text-xs">/hour</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === "shopping" && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Hero with product imagery */}
              <div className="relative h-[350px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=2574')] bg-cover bg-center" />

                <div className="relative z-20 h-full flex items-end">
                  <div className="container mx-auto px-6 pb-12">
                    <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-3">
                      Your Curated Selection
                    </p>
                    <h2 className="font-serif text-5xl md:text-6xl text-white mb-4 leading-tight">
                      The <span className="italic">shopping guide</span>
                    </h2>
                    <p className="text-white/70 text-lg max-w-2xl mb-6">
                      We've calculated exactly what you need. You buy retail, we bring the expertise.
                    </p>

                    {/* Dry hire badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full backdrop-blur-sm">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-medium">Dry Hire Model • You Save 40%</span>
                    </div>
                  </div>
                </div>
              </div>

              {bookingData.shoppingList && (
                <div className="px-6 py-12 space-y-12">
                  {/* Big numbers - magazine style */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-8 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-l-4 border-yellow-500 rounded-r-2xl">
                      <p className="text-white/60 text-sm mb-2 uppercase tracking-wider">Total Drinks</p>
                      <p className="font-serif text-6xl text-yellow-500 mb-1">{bookingData.shoppingList.totalDrinks}</p>
                      <p className="text-white/70 text-sm">drinks to serve</p>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-l-4 border-yellow-500 rounded-r-2xl">
                      <p className="text-white/60 text-sm mb-2 uppercase tracking-wider">Bottles Required</p>
                      <p className="font-serif text-6xl text-yellow-500 mb-1">{bookingData.shoppingList.bottlesNeeded}</p>
                      <p className="text-white/70 text-sm">750ml bottles</p>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-l-4 border-yellow-500 rounded-r-2xl">
                      <p className="text-white/60 text-sm mb-2 uppercase tracking-wider">Event Length</p>
                      <p className="font-serif text-6xl text-yellow-500 mb-1">{bookingData.eventDuration}</p>
                      <p className="text-white/70 text-sm">hours of service</p>
                    </div>
                  </div>

                  {/* Spirit Mix - Product feature style */}
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-3">
                        The Formula
                      </p>
                      <h3 className="font-serif text-4xl text-white mb-6">
                        Recommended Spirit <span className="italic">Mix</span>
                      </h3>
                      <p className="text-white/60 mb-8 leading-relaxed">
                        Based on thousands of events, this blend ensures every guest finds their perfect drink.
                      </p>

                      <div className="space-y-4">
                        {[
                          { spirit: "Vodka", percent: 40 },
                          { spirit: "Whiskey", percent: 20 },
                          { spirit: "Tequila", percent: 20 },
                          { spirit: "Gin", percent: 10 },
                          { spirit: "Rum", percent: 10 }
                        ].map((item) => (
                          <div key={item.spirit} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                              <span className="font-bold text-yellow-500">{item.percent}%</span>
                            </div>
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                                style={{ width: `${item.percent}%` }}
                              />
                            </div>
                            <span className="text-white font-medium w-24">{item.spirit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product image placeholder */}
                    <div className="relative h-[400px] rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527281400156-5e351c100fae?q=80&w=2574')] bg-cover bg-center" />
                      <div className="absolute bottom-6 left-6 right-6 z-20">
                        <p className="text-white/70 italic text-sm">
                          Pro tip: Buy from Costco or Total Wine for best value
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Essentials checklist */}
                  <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10">
                    <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-3">
                      Essential Ingredients
                    </p>
                    <h4 className="font-serif text-3xl text-white mb-6">The <span className="italic">finishing touches</span></h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { item: "Fresh Limes", qty: `${Math.ceil(bookingData.guestCount / 5)}` },
                        { item: "Fresh Lemons", qty: `${Math.ceil(bookingData.guestCount / 5)}` },
                        { item: "Club Soda & Tonic", qty: "2L per 10 guests" },
                        { item: "Cola & Ginger Beer", qty: "2L per 10 guests" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="text-white font-medium">{item.item}</p>
                            <p className="text-white/50 text-sm">{item.qty}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            )}

            {currentStep === "upsell" && (
              <motion.div
                key="upsell"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-white">Premium Add-Ons</h2>
                </div>

                <p className="text-white/70 mb-6">Elevate your event with our luxury service upgrades</p>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Spinner className="text-yellow-500 mb-4" />
                    <p className="text-white/60">Loading premium add-ons...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceAddons.map((addon) => (
                      <label
                        key={addon.id}
                        className={`flex items-start p-6 bg-white/5 rounded-xl border-2 transition-all cursor-pointer ${
                          bookingData.selectedAddons.includes(addon.id)
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={bookingData.selectedAddons.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-1 mr-4 w-5 h-5 rounded border-white/30 bg-white/10 text-yellow-500 focus:ring-yellow-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-1">{addon.name}</h4>
                          <p className="text-sm text-white/60 mb-2">{addon.description}</p>
                          {addon.category && (
                            <span className="inline-block text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                              {addon.category}
                            </span>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-2xl font-bold text-yellow-500">
                            ${addon.price}
                          </span>
                          <p className="text-xs text-white/60 mt-1">
                            {addon.unit === 'per_guest' ? '/guest' : '/event'}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {serviceAddons.length === 0 && !isLoading && (
                  <p className="text-center text-white/60 py-8">No premium add-ons available at this time.</p>
                )}
              </motion.div>
            )}

            {currentStep === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Complete Your Booking</h2>

                {/* Booking Summary */}
                <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-xl">
                  <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>Event Date:</span>
                      <span className="font-semibold">{new Date(bookingData.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Duration:</span>
                      <span className="font-semibold">{bookingData.eventDuration} hours</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span>Guests:</span>
                      <span className="font-semibold">{bookingData.guestCount}</span>
                    </div>
                    {bookingData.selectedBartender && (
                      <div className="flex justify-between text-white/80">
                        <span>Bartender:</span>
                        <span className="font-semibold">{bookingData.selectedBartender.profiles.full_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    {bookingData.selectedBartender && (
                      <div className="flex justify-between text-white">
                        <span>Bartending Service ({bookingData.eventDuration}h @ ${bookingData.selectedBartender.hourly_rate}/hr)</span>
                        <span className="font-semibold">
                          ${bookingData.selectedBartender.hourly_rate * bookingData.eventDuration}
                        </span>
                      </div>
                    )}

                    {bookingData.selectedAddons.length > 0 && (
                      <>
                        {bookingData.selectedAddons.map(addonId => {
                          const addon = serviceAddons.find(a => a.id === addonId)
                          if (!addon) return null
                          const price = addon.unit === 'per_guest'
                            ? addon.price * bookingData.guestCount
                            : addon.price
                          return (
                            <div key={addonId} className="flex justify-between text-white">
                              <span>{addon.name}</span>
                              <span className="font-semibold">${price}</span>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>

                  <div className="border-t border-yellow-500/50 pt-4 mt-4">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-yellow-500">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Stripe Checkout */}
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Spinner className="text-yellow-500 mb-4" />
                    <p className="text-white/60">Preparing secure checkout...</p>
                  </div>
                ) : clientSecret ? (
                  <div className="bg-white rounded-xl overflow-hidden">
                    <EmbeddedCheckoutProvider
                      stripe={stripePromise}
                      options={{ clientSecret }}
                    >
                      <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                  </div>
                ) : (
                  <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Checkout Not Available</AlertTitle>
                    <AlertDescription>
                      Unable to initialize payment. Please try again or contact support.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0 || isLoading}
              className="flex items-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <div className="text-sm text-white/60">
                Complete payment above to finalize booking
              </div>
            ) : (
              <GoldButton onClick={nextStep} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </GoldButton>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
