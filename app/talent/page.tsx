"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { BartenderCard } from "@/components/bartender-card"
import { Navbar } from "@/components/navbar"

export default function TalentPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const bartenders = [
    {
      id: "1",
      name: "Marcus Chen",
      avatar: "/bartenders/marcus.jpg",
      rating: 4.9,
      hourlyRate: 150,
      certifications: ["TABC", "Mixology Master"],
      specialty: "Classic Cocktails & Flair"
    },
    {
      id: "2",
      name: "Sofia Martinez",
      avatar: "/bartenders/sofia.jpg",
      rating: 5.0,
      hourlyRate: 175,
      certifications: ["TABC", "Master Sommelier"],
      specialty: "Craft Cocktails & Wine Pairing"
    },
    {
      id: "3",
      name: "James Patterson",
      avatar: "/bartenders/james.jpg",
      rating: 4.8,
      hourlyRate: 140,
      certifications: ["TABC"],
      specialty: "High-Volume Events"
    },
    {
      id: "4",
      name: "Isabella Romano",
      avatar: "/bartenders/isabella.jpg",
      rating: 4.9,
      hourlyRate: 160,
      certifications: ["TABC", "Molecular Mixology"],
      specialty: "Avant-Garde Cocktails"
    },
    {
      id: "5",
      name: "David Kim",
      avatar: "/bartenders/david.jpg",
      rating: 4.7,
      hourlyRate: 135,
      certifications: ["TABC"],
      specialty: "Classic & Contemporary"
    },
    {
      id: "6",
      name: "Elena Volkov",
      avatar: "/bartenders/elena.jpg",
      rating: 5.0,
      hourlyRate: 180,
      certifications: ["TABC", "Wine Expert"],
      specialty: "Luxury Events"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="container mx-auto px-6 py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-6">
            Our <span className="text-yellow-500">Talent</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Browse our roster of certified, world-class bartenders
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <GlassCard>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <button className="flex items-center justify-center px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Bartender Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bartenders.map((bartender, index) => (
            <motion.div
              key={bartender.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <BartenderCard {...bartender} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
