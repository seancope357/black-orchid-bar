"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = "details" | "safety" | "bartender" | "shopping" | "upsell" | "payment"

interface BookingData {
  date: string
  guestCount: number
  drinkingLevel: "light" | "moderate" | "heavy"
  selectedBartender?: string
  addOns: string[]
}

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState<Step>("details")
  const [bookingData, setBookingData] = useState<BookingData>({
    date: "",
    guestCount: 0,
    drinkingLevel: "moderate",
    addOns: []
  })

  const steps: Step[] = ["details", "safety", "bartender", "shopping", "upsell", "payment"]
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
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
                
                <div>
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Guest Count</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={bookingData.guestCount || ""}
                    onChange={(e) => setBookingData({ ...bookingData, guestCount: parseInt(e.target.value) })}
                  />
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
                      </button>
                    ))}
                  </div>
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
                <h2 className="text-3xl font-bold text-white mb-8">Safety Check</h2>
                
                <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-white mb-4">
                    For {bookingData.guestCount} guests, TABC guidelines recommend:
                  </p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {Math.ceil(bookingData.guestCount / 60)} Bartender{Math.ceil(bookingData.guestCount / 60) > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-white/60 mt-2">
                    (1 bartender per 50-75 guests)
                  </p>
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
                <h2 className="text-3xl font-bold text-white mb-8">Select Bartender</h2>
                <p className="text-white/60">Bartender selection will be displayed here...</p>
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
                <h2 className="text-3xl font-bold text-white mb-8">Shopping List</h2>
                <div className="p-6 bg-white/5 rounded-xl">
                  <p className="text-white/60">AI-generated shopping list will appear here...</p>
                </div>
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
                <h2 className="text-3xl font-bold text-white mb-8">Premium Add-Ons</h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/30 cursor-pointer">
                    <input type="checkbox" className="mr-4" />
                    <div className="flex-1">
                      <h4 className="text-white font-bold">Gold Standard Mixer Package</h4>
                      <p className="text-sm text-white/60">Premium mixers and garnishes</p>
                    </div>
                    <span className="text-yellow-500 font-bold">$4.50/guest</span>
                  </label>
                </div>
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
                <h2 className="text-3xl font-bold text-white mb-8">Payment</h2>
                <p className="text-white/60">Stripe checkout will be embedded here...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-12 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <GoldButton>Complete Booking</GoldButton>
            ) : (
              <GoldButton onClick={nextStep}>
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </GoldButton>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
