"use client"

import Link from "next/link"
import { Calendar } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GoldButton } from "@/components/ui/gold-button"

export function EmptyState() {
  return (
    <GlassCard>
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <p className="text-white/60 mb-2 text-lg">No upcoming bookings</p>
        <p className="text-white/40 mb-6 text-sm">Start planning your next event</p>
        <Link href="/booking">
          <GoldButton>Book Your First Event</GoldButton>
        </Link>
      </div>
    </GlassCard>
  )
}
