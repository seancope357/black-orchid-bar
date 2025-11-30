"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Plus } from "lucide-react"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"

export default function ClientDashboard() {
  // Mock data
  const upcomingBookings = [
    {
      id: "1",
      bartender: "Marcus Chen",
      date: "2024-12-15",
      time: "18:00",
      location: "Austin, TX",
      status: "confirmed"
    },
    {
      id: "2",
      bartender: "Sofia Martinez",
      date: "2024-12-22",
      time: "19:00",
      location: "Austin, TX",
      status: "inquiry"
    }
  ]

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
            Good evening, <span className="text-yellow-500">Alex</span>
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

        {/* Active Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Your Bookings</h2>
          
          {upcomingBookings.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-6">No upcoming bookings</p>
                <Link href="/booking">
                  <GoldButton>Book Your First Event</GoldButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={`/dashboard/client/bookings/${booking.id}`}>
                    <GlassCard hover className="cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{booking.bartender}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-white/60">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
