"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Settings, Edit } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoldButton } from "@/components/ui/gold-button"
import { ApprovalStatusCard } from "@/components/bartender/ApprovalStatusCard"
import { EarningsSummary } from "@/components/bartender/EarningsSummary"
import { BookingsList } from "@/components/bartender/BookingsList"

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

interface BartenderDashboardClientProps {
  bartenderName: string
  approvalStatus: 'pending' | 'approved' | 'rejected'
  earnings: {
    totalEarnings: number
    thisMonthEarnings: number
    completedBookings: number
    pendingPayouts: number
  }
  upcomingBookings: Booking[]
  pastBookings: Booking[]
  bartenderDetails: any
}

export function BartenderDashboardClient({
  bartenderName,
  approvalStatus,
  earnings,
  upcomingBookings,
  pastBookings,
  bartenderDetails,
}: BartenderDashboardClientProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-5xl text-white mb-2">
                Welcome back, <span className="text-yellow-500">{bartenderName}</span>
              </h1>
              <p className="text-white/60 text-lg">Your bartender dashboard</p>
            </div>
            <Link href="/bartender/profile/edit">
              <GoldButton className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </GoldButton>
            </Link>
          </div>
        </motion.div>

        {/* Approval Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ApprovalStatusCard status={approvalStatus} />
        </motion.div>

        {/* Earnings Summary */}
        {approvalStatus === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Earnings Overview</h2>
            <EarningsSummary {...earnings} />
          </motion.div>
        )}

        {/* Profile Summary */}
        {approvalStatus === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Your Profile</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-white/60 text-sm mb-1">Hourly Rate</p>
                <p className="text-white text-2xl font-bold">
                  ${bartenderDetails.hourly_rate}/hr
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-white/60 text-sm mb-1">Experience</p>
                <p className="text-white text-2xl font-bold">
                  {bartenderDetails.years_experience} years
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-white/60 text-sm mb-1">Service Area</p>
                <p className="text-white text-2xl font-bold">
                  {bartenderDetails.service_area}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upcoming Bookings */}
        {approvalStatus === 'approved' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <BookingsList
              bookings={upcomingBookings}
              title="Upcoming Events"
              emptyMessage="No upcoming events. New bookings will appear here when clients request your services."
            />
          </motion.div>
        )}

        {/* Past Bookings */}
        {approvalStatus === 'approved' && pastBookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <BookingsList
              bookings={pastBookings.slice(0, 5)}
              title="Recent History"
              emptyMessage="No past events yet"
            />
            {pastBookings.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  href="/bartender/bookings/history"
                  className="text-yellow-500 hover:text-yellow-400 text-sm font-medium"
                >
                  View all {pastBookings.length} past events →
                </Link>
              </div>
            )}
          </motion.div>
        )}
        </div>
      </div>
    </>
  )
}
