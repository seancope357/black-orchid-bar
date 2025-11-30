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
    <div className="min-h-screen bg-black py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index < steps.length - 1 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    index <= currentStepIndex
                      ? "bg-yellow-500 text-black"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {index < currentStepIndex ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      index < currentStepIndex ? "bg-yellow-500" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-white/60 text-sm capitalize">{currentStep} Information</p>
        </div>

        {/* Step Content */}
        <GlassCard>
          {error && (
            <Alert variant="warning" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention Required</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {currentStep === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Event Details</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Event Date</Label>
                    <Input
                      type="date"
                      value={bookingData.eventDate}
                      onChange={(e) => {
                        setBookingData({ ...bookingData, eventDate: e.target.value })
                        setRecommendedBartenders(calculateRecommendedBartenders(bookingData.guestCount))
                      }}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label>Event Duration (hours)</Label>
                    <Input
                      type="number"
                      placeholder="4"
                      min="1"
                      max="12"
                      value={bookingData.eventDuration || ""}
                      onChange={(e) => setBookingData({ ...bookingData, eventDuration: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Guest Count</Label>
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
                    />
                  </div>

                  <div>
                    <Label>Event Type</Label>
                    <Input
                      type="text"
                      placeholder="Wedding, Birthday, Corporate..."
                      value={bookingData.eventType}
                      onChange={(e) => setBookingData({ ...bookingData, eventType: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Drinking Level</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {(["light", "moderate", "heavy"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, drinkingLevel: level })}
                        className={`p-4 rounded-xl border-2 transition-all capitalize ${
                          bookingData.drinkingLevel === level
                            ? "border-yellow-500 bg-yellow-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <span className="text-white font-medium">{level}</span>
                        <p className="text-xs text-white/60 mt-1">
                          {level === "light" && "~1 drink/hr"}
                          {level === "moderate" && "~1.5 drinks/hr"}
                          {level === "heavy" && "~2 drinks/hr"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Special Requests (Optional)</Label>
                  <Textarea
                    placeholder="Any special requirements, cocktail preferences, or dietary restrictions..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                    rows={4}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === "safety" && (
              <motion.div
                key="safety"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Safety & Compliance Check</h2>

                <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                      <Check className="w-6 h-6 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">TABC Compliance Recommendation</h3>
                      <p className="text-white/80 mb-4">
                        For {bookingData.guestCount} guests, we recommend:
                      </p>
                      <p className="text-3xl font-bold text-yellow-500 mb-2">
                        {recommendedBartenders} Bartender{recommendedBartenders > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-white/60">
                        TABC guidelines recommend 1 bartender per 50-75 guests for safe, responsible service.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="font-bold text-white mb-3">Safety Guidelines</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                      <span>All our bartenders are TABC certified professionals</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                      <span>Proper ID checking and service refusal protocols</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 mr-2 mt-0.5 text-green-500" />
                      <span>Responsible beverage service throughout event</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {currentStep === "bartender" && (
              <motion.div
                key="bartender"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Select Your Bartender</h2>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Spinner className="text-yellow-500 mb-4" />
                    <p className="text-white/60">Loading our talented bartenders...</p>
                  </div>
                ) : bartenders.length === 0 ? (
                  <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Bartenders Available</AlertTitle>
                    <AlertDescription>
                      We couldn't find any available bartenders for your event. Please try different dates or contact support.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {bartenders.map((bartender) => (
                      <div
                        key={bartender.user_id}
                        onClick={() => {
                          setBookingData(prev => ({
                            ...prev,
                            selectedBartenderId: bartender.user_id,
                            selectedBartender: bartender
                          }))
                        }}
                        className={`relative cursor-pointer transition-all rounded-xl ${
                          bookingData.selectedBartenderId === bartender.user_id
                            ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-black"
                            : ""
                        }`}
                      >
                        <BartenderCard
                          id={bartender.user_id}
                          name={bartender.profiles.full_name}
                          avatar={bartender.profiles.avatar_url || "/placeholder-avatar.jpg"}
                          rating={4.8}
                          hourlyRate={bartender.hourly_rate}
                          certifications={bartender.is_tabc_certified ? ["TABC"] : []}
                          specialty={bartender.specialties?.[0]}
                          onBookClick={() => {}}
                        />
                        {bookingData.selectedBartenderId === bartender.user_id && (
                          <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 text-black" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === "shopping" && (
              <motion.div
                key="shopping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <ShoppingCart className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-white">Your Shopping List</h2>
                </div>

                <Alert variant="default" className="bg-blue-500/10 border-blue-500/30">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <AlertTitle>Dry Hire Model</AlertTitle>
                  <AlertDescription>
                    You'll purchase spirits at retail (we recommend Costco or Total Wine). We provide professional bartending, premium mixers, and glassware.
                  </AlertDescription>
                </Alert>

                {bookingData.shoppingList && (
                  <>
                    <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30 rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-4">Estimated Requirements</h3>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                          <p className="text-sm text-white/60 mb-1">Total Drinks</p>
                          <p className="text-2xl font-bold text-yellow-500">{bookingData.shoppingList.totalDrinks}</p>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                          <p className="text-sm text-white/60 mb-1">Bottles Needed</p>
                          <p className="text-2xl font-bold text-yellow-500">{bookingData.shoppingList.bottlesNeeded}</p>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                          <p className="text-sm text-white/60 mb-1">Event Duration</p>
                          <p className="text-2xl font-bold text-yellow-500">{bookingData.eventDuration}h</p>
                        </div>
                      </div>

                      <p className="text-white/80 text-sm">{bookingData.shoppingList.breakdown}</p>
                    </div>

                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-bold text-white mb-4">Recommended Spirit Mix</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Vodka</span>
                          <span className="text-yellow-500 font-semibold">40%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Whiskey</span>
                          <span className="text-yellow-500 font-semibold">20%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Tequila</span>
                          <span className="text-yellow-500 font-semibold">20%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Gin</span>
                          <span className="text-yellow-500 font-semibold">10%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Rum</span>
                          <span className="text-yellow-500 font-semibold">10%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h4 className="font-bold text-white mb-4">Don't Forget</h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Lime (1 per 5 guests)
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Lemon (1 per 5 guests)
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Club soda & Tonic water
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Cola & Ginger beer
                        </li>
                      </ul>
                    </div>
                  </>
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
