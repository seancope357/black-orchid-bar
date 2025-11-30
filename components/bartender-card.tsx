"use client"

import Image from "next/image"
import { Star, Award } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GoldButton } from "@/components/ui/gold-button"

interface BartenderCardProps {
  id: string
  name: string
  avatar: string
  rating: number
  hourlyRate: number
  certifications: string[]
  specialty?: string
  onBookClick?: (id: string) => void
}

export function BartenderCard({
  id,
  name,
  avatar,
  rating,
  hourlyRate,
  certifications,
  specialty,
  onBookClick
}: BartenderCardProps) {
  const hasTABC = certifications.includes("TABC")

  return (
    <GlassCard hover className="p-0 overflow-hidden">
      {/* Avatar Section */}
      <div className="relative h-48 bg-gradient-to-b from-yellow-500/10 to-transparent">
        <Image
          src={avatar || "/placeholder-avatar.jpg"}
          alt={name}
          fill
          className="object-cover"
        />
        {hasTABC && (
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 rounded-full px-3 py-1">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-500">TABC</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          {specialty && (
            <p className="text-sm text-white/60">{specialty}</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-white/20"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-white/80">{rating.toFixed(1)}</span>
        </div>

        {/* Rate */}
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-yellow-500">${hourlyRate}</span>
          <span className="text-sm text-white/60">/hour</span>
        </div>

        {/* CTA */}
        <GoldButton
          className="w-full"
          size="sm"
          onClick={() => onBookClick?.(id)}
        >
          Check Availability
        </GoldButton>
      </div>
    </GlassCard>
  )
}
