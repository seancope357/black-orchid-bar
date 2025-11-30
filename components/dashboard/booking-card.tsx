"use client"

import Link from "next/link"
import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { formatDate, formatTime } from "@/lib/utils"

interface Booking {
  id: string
  event_date: string
  event_duration_hours: number
  guest_count: number
  event_type: string | null
  special_requests: string | null
  status: 'inquiry' | 'confirmed' | 'completed' | 'cancelled'
  total_amount: string | null
  bartender_id: string
  bartender_details: {
    hourly_rate: number | null
  } | null
  bartender_profile: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface BookingCardProps {
  booking: Booking
  isPast?: boolean
}

const statusStyles = {
  inquiry: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    label: "Inquiry"
  },
  confirmed: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    label: "Confirmed"
  },
  completed: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    label: "Completed"
  },
  cancelled: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    label: "Cancelled"
  }
}

export function BookingCard({ booking, isPast = false }: BookingCardProps) {
  const statusStyle = statusStyles[booking.status]
  const eventDate = new Date(booking.event_date)
  const bartenderName = booking.bartender_profile?.full_name || "Bartender"
  const hourlyRate = booking.bartender_details?.hourly_rate
  const estimatedTotal = hourlyRate ? (hourlyRate * booking.event_duration_hours).toFixed(2) : booking.total_amount

  return (
    <Link href={`/dashboard/client/bookings/${booking.id}`}>
      <GlassCard hover className="cursor-pointer group h-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
              {bartenderName}
            </h3>
            {booking.event_type && (
              <p className="text-sm text-white/50 mt-1">{booking.event_type}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ml-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
          >
            {statusStyle.label}
          </span>
        </div>

        <div className="space-y-3 text-white/60 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-3 text-yellow-500/60" />
            <span>{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-3 text-yellow-500/60" />
            <span>{formatTime(eventDate)} • {booking.event_duration_hours}h</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-3 text-yellow-500/60" />
            <span>{booking.guest_count} guests</span>
          </div>
          {estimatedTotal && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-3 text-yellow-500/60" />
              <span>${estimatedTotal}</span>
            </div>
          )}
        </div>

        {booking.special_requests && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 mb-1">Special Requests:</p>
            <p className="text-sm text-white/60 line-clamp-2">{booking.special_requests}</p>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-white/10">
          <p className="text-xs text-yellow-500/70 font-semibold group-hover:text-yellow-400 transition-colors">
            View Details →
          </p>
        </div>
      </GlassCard>
    </Link>
  )
}
