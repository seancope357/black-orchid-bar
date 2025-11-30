import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, Clock, Users, MapPin, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { createClient } from "@/lib/supabase/server"
import { formatDate, formatTime, formatDateTime } from "@/lib/utils"

interface BookingDetailsPageParams {
  params: Promise<{
    id: string
  }>
}

interface BookingDetails {
  id: string
  event_date: string
  event_duration_hours: number
  guest_count: number
  event_type: string | null
  special_requests: string | null
  status: 'inquiry' | 'confirmed' | 'completed' | 'cancelled'
  total_amount: string | null
  created_at: string
  updated_at: string
  bartender_id: string
  client_id: string
  bartender_details: {
    hourly_rate: number | null
    is_tabc_certified: boolean | null
    years_experience: number | null
    specialties: string[] | null
    bio: string | null
  } | null
  bartender_profile: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

const statusStyles = {
  inquiry: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    label: "Inquiry",
    icon: AlertCircle
  },
  confirmed: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/30",
    label: "Confirmed",
    icon: CheckCircle2
  },
  completed: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    label: "Completed",
    icon: CheckCircle2
  },
  cancelled: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    label: "Cancelled",
    icon: AlertCircle
  }
}

async function getBookingDetails(bookingId: string, userId: string): Promise<BookingDetails | null> {
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      `
      id,
      event_date,
      event_duration_hours,
      guest_count,
      event_type,
      special_requests,
      status,
      total_amount,
      created_at,
      updated_at,
      bartender_id,
      client_id,
      bartender_details (
        hourly_rate,
        is_tabc_certified,
        years_experience,
        specialties,
        bio
      ),
      bartender_profile:bartender_id (
        full_name,
        avatar_url
      )
      `
    )
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    return null
  }

  // Check if user has access to this booking (is client or bartender)
  if (booking.client_id !== userId && booking.bartender_id !== userId) {
    return null
  }

  return booking
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageParams) {
  const { id: bookingId } = await params
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  // Get booking details
  const booking = await getBookingDetails(bookingId, user.id)

  if (!booking) {
    notFound()
  }

  const statusStyle = statusStyles[booking.status]
  const StatusIcon = statusStyle.icon
  const eventDate = new Date(booking.event_date)
  const bartenderName = booking.bartender_profile?.full_name || "Bartender"
  const hourlyRate = booking.bartender_details?.hourly_rate
  const estimatedTotal = hourlyRate ? (hourlyRate * booking.event_duration_hours).toFixed(2) : booking.total_amount
  const createdDate = new Date(booking.created_at)
  const isFutureBooking = eventDate > new Date()

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/dashboard/client" className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Bookings
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-serif text-5xl text-white mb-2">
                {bartenderName}
              </h1>
              {booking.event_type && (
                <p className="text-white/60 text-lg">{booking.event_type}</p>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              <StatusIcon className="w-4 h-4" />
              {statusStyle.label}
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <GlassCard variant="default" className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>

              <div className="space-y-6">
                {/* Date & Time */}
                <div>
                  <label className="text-white/50 text-sm font-semibold block mb-2">Date & Time</label>
                  <div className="space-y-3">
                    <div className="flex items-center text-white">
                      <Calendar className="w-5 h-5 mr-3 text-yellow-500/60" />
                      <span>{formatDate(eventDate)}</span>
                    </div>
                    <div className="flex items-center text-white">
                      <Clock className="w-5 h-5 mr-3 text-yellow-500/60" />
                      <span>{formatTime(eventDate)}</span>
                    </div>
                    <div className="text-white/60 ml-8 text-sm">Duration: {booking.event_duration_hours} hour{booking.event_duration_hours !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="text-white/50 text-sm font-semibold block mb-2">Guests</label>
                  <div className="flex items-center text-white">
                    <Users className="w-5 h-5 mr-3 text-yellow-500/60" />
                    <span>{booking.guest_count} guest{booking.guest_count !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.special_requests && (
                  <div>
                    <label className="text-white/50 text-sm font-semibold block mb-2">Special Requests</label>
                    <p className="text-white/80 leading-relaxed">{booking.special_requests}</p>
                  </div>
                )}

                {/* Booking Metadata */}
                <div className="pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-white/50 mb-1">Booking ID</p>
                      <p className="text-white font-mono text-xs">{bookingId.slice(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-white/50 mb-1">Booked On</p>
                      <p className="text-white">{formatDate(createdDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Bartender Info Card */}
            <GlassCard variant="default">
              <h2 className="text-2xl font-bold text-white mb-6">Your Bartender</h2>

              <div className="space-y-4">
                {booking.bartender_profile?.avatar_url && (
                  <img
                    src={booking.bartender_profile.avatar_url}
                    alt={bartenderName}
                    className="w-20 h-20 rounded-full border-2 border-yellow-500/30"
                  />
                )}

                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{bartenderName}</h3>
                  {booking.bartender_details?.years_experience && (
                    <p className="text-white/60">{booking.bartender_details.years_experience} years of experience</p>
                  )}
                </div>

                {booking.bartender_details?.bio && (
                  <div>
                    <label className="text-white/50 text-sm font-semibold block mb-2">Bio</label>
                    <p className="text-white/80 text-sm leading-relaxed">{booking.bartender_details.bio}</p>
                  </div>
                )}

                {booking.bartender_details?.specialties && booking.bartender_details.specialties.length > 0 && (
                  <div>
                    <label className="text-white/50 text-sm font-semibold block mb-2">Specialties</label>
                    <div className="flex flex-wrap gap-2">
                      {booking.bartender_details.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {booking.bartender_details?.is_tabc_certified && (
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-white/80 text-sm">TABC Certified</span>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Pricing Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="active" className="sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Hourly Rate</span>
                  <span className="text-white font-semibold">
                    {hourlyRate ? `$${hourlyRate}/hr` : 'TBD'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Duration</span>
                  <span className="text-white font-semibold">
                    {booking.event_duration_hours}h
                  </span>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-white/70">Guest Count</span>
                  <span className="text-white font-semibold">
                    {booking.guest_count}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-white font-bold">Estimated Total</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    ${estimatedTotal}
                  </span>
                </div>
              </div>

              {/* Status Info */}
              <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
                {booking.status === 'inquiry' && (
                  <div>
                    <p className="text-white/80 text-sm font-semibold mb-2">Pending Confirmation</p>
                    <p className="text-white/60 text-sm">
                      This booking is pending confirmation from the bartender. You'll receive a notification once they respond.
                    </p>
                  </div>
                )}
                {booking.status === 'confirmed' && (
                  <div>
                    <p className="text-green-400 text-sm font-semibold mb-2">Confirmed</p>
                    <p className="text-white/60 text-sm">
                      Your booking is confirmed. The bartender will arrive {Math.round((eventDate.getTime() - Date.now()) / (1000 * 60 * 60))} hours from now.
                    </p>
                  </div>
                )}
                {booking.status === 'completed' && (
                  <div>
                    <p className="text-blue-400 text-sm font-semibold mb-2">Completed</p>
                    <p className="text-white/60 text-sm">
                      This event has been completed. Thank you for using Black Orchid!
                    </p>
                  </div>
                )}
                {booking.status === 'cancelled' && (
                  <div>
                    <p className="text-red-400 text-sm font-semibold mb-2">Cancelled</p>
                    <p className="text-white/60 text-sm">
                      This booking has been cancelled.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isFutureBooking && booking.status !== 'cancelled' && (
                <div className="space-y-3">
                  {booking.status === 'inquiry' && (
                    <p className="text-white/60 text-sm text-center">
                      Waiting for bartender confirmation
                    </p>
                  )}
                  {booking.status === 'confirmed' && (
                    <button className="w-full px-4 py-2 text-sm font-semibold rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                      Cancel Booking
                    </button>
                  )}
                </div>
              )}

              {booking.status === 'completed' && (
                <Link href={`/dashboard/client/bookings/${bookingId}/review`} className="block">
                  <GoldButton className="w-full">
                    Leave Review
                  </GoldButton>
                </Link>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
