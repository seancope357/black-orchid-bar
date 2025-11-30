"use client"

import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

interface TalentPageErrorProps {
  message?: string
}

export function TalentPageError({ message }: TalentPageErrorProps) {
  return (
    <div className="container mx-auto px-6 py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
          Our <span className="text-yellow-500">Talent</span>
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Browse our roster of certified, world-class bartenders
        </p>
      </motion.div>

      {/* Error Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <GlassCard variant="active" className="border-red-500/30">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Unable to Load Bartenders</h3>
              <p className="text-white/60">
                {message || "We're having trouble loading our talent roster. Please try again later."}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
