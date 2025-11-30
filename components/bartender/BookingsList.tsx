"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react"
import { motion } from "framer-motion"

interface Booking {
  id: string
  client_name: string
  event_date: string
  event_duration_hours: number
  guest_count: number
  event_type: string
  status: 'inquiry' | 'confirmed' | 'completed' | 'cancelled'
  total_amount: number
  special_requests?: string
}

interface BookingsListProps {
  bookings: Booking[]
  title: string
  emptyMessage?: string
}

export function BookingsList({ bookings, title, emptyMessage = "No bookings yet" }: BookingsListProps) {
  const statusConfig = {
    inquiry: {
      variant: "warning" as const,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    confirmed: {
      variant: "success" as const,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    completed: {
      variant: "default" as const,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    cancelled: {
      variant: "destructive" as const,
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (bookings.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <GlassCard>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">{emptyMessage}</p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4">
        {bookings.map((booking, index) => {
          const config = statusConfig[booking.status]
          return (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hover>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {booking.event_type || 'Private Event'}
                    </h3>
                    <p className="text-white/60 text-sm">Client: {booking.client_name}</p>
                  </div>
                  <Badge variant={config.variant}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(booking.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(booking.event_date)} ({booking.event_duration_hours}h)</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{booking.guest_count} guests</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-yellow-400">
                      ${booking.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 font-medium">Special Requests:</p>
                    <p className="text-sm text-white/80">{booking.special_requests}</p>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
