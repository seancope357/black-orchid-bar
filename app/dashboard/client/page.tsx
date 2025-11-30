import Link from "next/link"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Plus, AlertCircle } from "lucide-react"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { createClient } from "@/lib/supabase/server"
import { BookingCard } from "@/components/dashboard/booking-card"
import { LoadingState } from "@/components/dashboard/loading-state"
import { EmptyState } from "@/components/dashboard/empty-state"

type BookingStatus = 'inquiry' | 'confirmed' | 'completed' | 'cancelled'

interface Booking {
  id: string
  event_date: string
  event_duration_hours: number
  guest_count: number
  event_type: string | null
  special_requests: string | null
  status: BookingStatus
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

interface DashboardUser {
  id: string
  full_name: string | null
}

async function getClientBookings(userId: string) {
  const supabase = await createClient()

  // Fetch bookings with related bartender information
  const { data: bookings, error: bookingsError } = await supabase
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
      bartender_id,
      bartender_details (
        hourly_rate
      ),
      bartender_profile:bartender_id (
        full_name,
        avatar_url
      )
      `
    )
    .eq('client_id', userId)
    .order('event_date', { ascending: false })

  if (bookingsError) {
    console.error('Error fetching bookings:', bookingsError)
    return { upcoming: [], past: [] }
  }

  // Split bookings into upcoming and past
  const now = new Date()
  const upcoming = (bookings || [])
    .filter(b => new Date(b.event_date) > now)
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())

  const past = (bookings || [])
    .filter(b => new Date(b.event_date) <= now)
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())

  return { upcoming, past }
}

async function getClientInfo(userId: string): Promise<DashboardUser | null> {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

export default async function ClientDashboard() {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/auth/login')
  }

  // Get client info and bookings
  const [clientInfo, { upcoming: upcomingBookings, past: pastBookings }] = await Promise.all([
    getClientInfo(user.id),
    getClientBookings(user.id)
  ])

  const firstName = clientInfo?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-serif text-5xl text-white mb-2">
            Good evening, <span className="text-yellow-500">{firstName}</span>
          </h1>
          <p className="text-white/60 text-lg">Welcome to your dashboard</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Link href="/booking">
            <GoldButton size="lg" className="group">
              <Plus className="w-5 h-5 mr-2" />
              Start New Booking
            </GoldButton>
          </Link>
        </motion.div>

        {/* Upcoming Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Upcoming Bookings</h2>

          {upcomingBookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <BookingCard booking={booking} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Past Bookings Section */}
        {pastBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Past Bookings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {pastBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <BookingCard booking={booking} isPast />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
