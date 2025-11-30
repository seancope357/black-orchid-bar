"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { BartenderCard } from "@/components/bartender-card"

interface BartenderCardProps {
  id: string
  name: string
  avatar: string
  hourlyRate: number
  certifications: string[]
  specialty?: string
}

interface TalentPageClientProps {
  bartenders: BartenderCardProps[]
}

export function TalentPageClient({ bartenders }: TalentPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter bartenders based on search query
  const filteredBartenders = useMemo(() => {
    if (!searchQuery.trim()) {
      return bartenders
    }

    const query = searchQuery.toLowerCase()
    return bartenders.filter(
      (bartender) =>
        bartender.name.toLowerCase().includes(query) ||
        bartender.specialty?.toLowerCase().includes(query) ||
        bartender.certifications.some((cert) =>
          cert.toLowerCase().includes(query)
        )
    )
  }, [bartenders, searchQuery])

  return (
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

      {/* Results Info */}
      <div className="mb-8">
        <p className="text-white/60 text-sm">
          Showing {filteredBartenders.length} of {bartenders.length} bartenders
        </p>
      </div>

      {/* Bartender Grid */}
      {filteredBartenders.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBartenders.map((bartender, index) => (
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
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <GlassCard>
            <p className="text-white/60 text-lg">
              No bartenders found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-white/40 text-sm mt-2">
              Try adjusting your search terms
            </p>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}
