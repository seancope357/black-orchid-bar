import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BartenderDashboardClient } from './client'

export default async function BartenderDashboard() {
  const supabase = await createClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get bartender profile and details
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'bartender') {
    redirect('/')
  }

  // Get bartender details including approval status
  const { data: bartenderDetails } = await supabase
    .from('bartender_details')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If no bartender details exist, redirect to onboarding
  if (!bartenderDetails) {
    redirect('/bartender/onboarding')
  }

  // Get all bookings for this bartender
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      id,
      event_date,
      event_duration_hours,
      guest_count,
      event_type,
      status,
      total_amount,
      special_requests,
      client:profiles!bookings_client_id_fkey(full_name)
    `)
    .eq('bartender_id', user.id)
    .order('event_date', { ascending: true })

  // Separate upcoming and past bookings
  const now = new Date()
  const upcomingBookings = bookings?.filter(
    (b) => new Date(b.event_date) >= now && b.status !== 'cancelled' && b.status !== 'completed'
  ) || []

  const pastBookings = bookings?.filter(
    (b) => new Date(b.event_date) < now || b.status === 'completed' || b.status === 'cancelled'
  ) || []

  // Calculate earnings
  const completedBookings = bookings?.filter((b) => b.status === 'completed') || []
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)

  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  const thisMonthEarnings = completedBookings
    .filter((b) => new Date(b.event_date) >= thisMonth)
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)

  const confirmedBookings = bookings?.filter(
    (b) => b.status === 'confirmed' && new Date(b.event_date) >= now
  ) || []
  const pendingPayouts = confirmedBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)

  // Format bookings data for client component
  const formattedUpcomingBookings = upcomingBookings.map((booking) => ({
    id: booking.id,
    client_name: booking.client?.full_name || 'Unknown Client',
    event_date: booking.event_date,
    event_duration_hours: booking.event_duration_hours,
    guest_count: booking.guest_count,
    event_type: booking.event_type,
    status: booking.status as 'inquiry' | 'confirmed' | 'completed' | 'cancelled',
    total_amount: booking.total_amount || 0,
    special_requests: booking.special_requests,
  }))

  const formattedPastBookings = pastBookings.map((booking) => ({
    id: booking.id,
    client_name: booking.client?.full_name || 'Unknown Client',
    event_date: booking.event_date,
    event_duration_hours: booking.event_duration_hours,
    guest_count: booking.guest_count,
    event_type: booking.event_type,
    status: booking.status as 'inquiry' | 'confirmed' | 'completed' | 'cancelled',
    total_amount: booking.total_amount || 0,
    special_requests: booking.special_requests,
  }))

  return (
    <BartenderDashboardClient
      bartenderName={profile?.full_name || 'Bartender'}
      approvalStatus={bartenderDetails.approval_status as 'pending' | 'approved' | 'rejected'}
      earnings={{
        totalEarnings,
        thisMonthEarnings,
        completedBookings: completedBookings.length,
        pendingPayouts,
      }}
      upcomingBookings={formattedUpcomingBookings}
      pastBookings={formattedPastBookings}
      bartenderDetails={bartenderDetails}
    />
  )
}
