"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"

export function TalentPageSkeleton() {
  return (
    <div className="container mx-auto px-6 py-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="h-16 bg-white/10 rounded-lg w-3/4 mx-auto mb-6 animate-pulse" />
        <div className="h-6 bg-white/5 rounded-lg w-2/3 mx-auto animate-pulse" />
      </motion.div>

      {/* Search Bar Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <GlassCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-12 bg-white/10 rounded-lg animate-pulse" />
            <div className="h-12 w-40 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </GlassCard>
      </motion.div>

      {/* Info skeleton */}
      <div className="mb-8">
        <div className="h-4 bg-white/5 rounded w-40 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <GlassCard className="p-0 overflow-hidden">
              <div className="h-48 bg-white/10 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-4 w-4 bg-white/10 rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-6 bg-white/10 rounded w-1/3 animate-pulse" />
                <div className="h-10 bg-white/10 rounded animate-pulse" />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
