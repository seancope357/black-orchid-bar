"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Award, Users, Clock, Filter, Sparkles, Trophy, Flame } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoldButton } from "@/components/ui/gold-button"
import { FadeIn } from "@/components/ui/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger-container"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

// Mock data - will be replaced with Supabase data
const mockBartenders = [
  {
    id: "1",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    hourlyRate: 150,
    rating: 4.9,
    eventsServed: 150,
    certifications: ["TABC", "Master Mixologist"],
    specialty: "Classic Cocktails & Flair",
    bio: "With 12 years of experience across Austin's most prestigious venues, Marcus specializes in classic cocktails with a modern twist.",
    featured: true,
    size: "large"
  },
  {
    id: "2",
    name: "Sofia Martinez",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
    hourlyRate: 175,
    rating: 5.0,
    eventsServed: 200,
    certifications: ["TABC", "Master Sommelier", "Craft Specialist"],
    specialty: "Wine Pairing & Molecular Mixology",
    bio: "A certified sommelier and craft cocktail artist, Sofia brings an unparalleled level of sophistication to every event.",
    featured: true,
    size: "large"
  },
  {
    id: "3",
    name: "Jordan Brooks",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
    hourlyRate: 125,
    rating: 4.8,
    eventsServed: 95,
    certifications: ["TABC"],
    specialty: "Craft Beer & Whiskey",
    bio: "Specializing in craft beer selection and whiskey education for intimate gatherings.",
    featured: false,
    size: "regular"
  },
  {
    id: "4",
    name: "Maya Patel",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    hourlyRate: 160,
    rating: 4.9,
    eventsServed: 120,
    certifications: ["TABC", "Mixology Master"],
    specialty: "Tropical & Tiki Cocktails",
    bio: "Expert in exotic cocktails and tropical flavor profiles that transport your guests.",
    featured: false,
    size: "regular"
  },
  {
    id: "5",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    hourlyRate: 140,
    rating: 4.7,
    eventsServed: 80,
    certifications: ["TABC"],
    specialty: "Modern Craft Cocktails",
    bio: "Innovative mixologist focused on contemporary techniques and seasonal ingredients.",
    featured: false,
    size: "regular"
  },
  {
    id: "6",
    name: "Taylor Kim",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
    hourlyRate: 155,
    rating: 4.9,
    eventsServed: 110,
    certifications: ["TABC", "Certified Bartender"],
    specialty: "Champagne & Sparkling Wine",
    bio: "Champagne specialist creating elegant bubble-focused experiences for upscale events.",
    featured: false,
    size: "large"
  },
  {
    id: "7",
    name: "Chris Anderson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    hourlyRate: 130,
    rating: 4.6,
    eventsServed: 75,
    certifications: ["TABC"],
    specialty: "High-Volume Events",
    bio: "Efficient bartender experienced in corporate events and large wedding receptions.",
    featured: false,
    size: "regular"
  },
  {
    id: "8",
    name: "Sam Torres",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    hourlyRate: 145,
    rating: 4.8,
    eventsServed: 100,
    certifications: ["TABC", "Craft Specialist"],
    specialty: "Gin & Botanical Cocktails",
    bio: "Botanical expert crafting sophisticated gin-based cocktails with fresh herbs.",
    featured: false,
    size: "regular"
  }
]

const filterOptions = {
  specialty: [
    { label: "Classic Cocktails", icon: Trophy, count: 12 },
    { label: "Craft Specialist", icon: Sparkles, count: 8 },
    { label: "High-Volume Events", icon: Users, count: 15 },
    { label: "Wine & Champagne", icon: Award, count: 6 }
  ],
  experience: [
    { label: "Master (150+ events)", icon: Flame, count: 5 },
    { label: "Expert (100-149)", icon: Star, count: 8 },
    { label: "Professional (50-99)", icon: Award, count: 12 }
  ],
  rate: [
    { label: "$100-125/hr", range: [100, 125] },
    { label: "$126-150/hr", range: [126, 150] },
    { label: "$151-175/hr", range: [151, 175] },
    { label: "$176+/hr", range: [176, 999] }
  ]
}

export default function TalentPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const featuredBartenders = mockBartenders.filter(b => b.featured)
  const regularBartenders = mockBartenders.filter(b => !b.featured)

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Magazine-Style Hero */}
      <section className="relative h-screen">
        {/* Hero Image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2574')] bg-cover bg-center" />

        <div className="relative z-20 h-full flex items-end">
          <div className="container mx-auto px-6 pb-32">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                  Curated Excellence
                </p>
                <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 leading-tight">
                  Meet The
                  <br />
                  <span className="italic">Masters</span>
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                  Every bartender in our roster has been hand-selected for their artistry,
                  professionalism, and ability to transform spirits into stories. Browse our
                  collection of Austin's finest beverage architects.
                </p>
                <div className="flex items-center gap-8 text-white/70">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-yellow-500" />
                    <span>24 Active Bartenders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span>4.8 Avg Rating</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Filter Section */}
      <section className="py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-2">
                  Refine Your Search
                </p>
                <h2 className="font-serif text-3xl text-white">
                  Find Your Perfect <span className="italic">Match</span>
                </h2>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-500/50 transition-all text-white"
              >
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>

            {/* Filter Chips - Editorial Style */}
            <div className="space-y-6">
              {/* Specialty Filters */}
              <div>
                <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">
                  Specialty
                </h3>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.specialty.map((filter) => (
                    <motion.button
                      key={filter.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                    >
                      <filter.icon className="w-5 h-5 text-yellow-500" />
                      <span className="text-white font-medium">{filter.label}</span>
                      <span className="text-white/40 text-sm">({filter.count})</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Experience Filters */}
              <div>
                <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">
                  Experience Level
                </h3>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.experience.map((filter) => (
                    <motion.button
                      key={filter.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                    >
                      <filter.icon className="w-5 h-5 text-yellow-500" />
                      <span className="text-white font-medium">{filter.label}</span>
                      <span className="text-white/40 text-sm">({filter.count})</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Rate Filters */}
              <div>
                <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">
                  Hourly Rate
                </h3>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.rate.map((filter) => (
                    <motion.button
                      key={filter.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all"
                    >
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="text-white font-medium">{filter.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured Profiles - Full-Width Editorial Spreads */}
      <section className="py-32 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="mb-20">
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                Featured Masters
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
                Our Most <span className="italic">Celebrated</span> Talent
              </h2>
              <p className="text-white/60 text-xl max-w-2xl">
                These bartenders represent the pinnacle of our roster—artists who've
                earned their place through exceptional skill and unforgettable experiences.
              </p>
            </div>
          </FadeIn>

          {/* Featured Profile 1 - Image Left */}
          <FadeIn className="mb-32">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[600px] rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700" />

                {/* Overlay badges */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                  <span className="inline-block px-3 py-1 bg-yellow-500 text-black text-xs font-semibold uppercase tracking-wider rounded-full">
                    Featured
                  </span>
                  <span className="inline-block px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-500 text-xs font-semibold uppercase tracking-wider rounded-full">
                    Master Mixologist
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-5xl text-white mb-4">Marcus Chen</h3>
                <p className="text-white/70 text-lg mb-6 leading-relaxed italic">
                  "Every cocktail tells a story. I just help write the narrative."
                </p>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  With 12 years of experience across Austin's most prestigious venues, Marcus
                  specializes in classic cocktails with a modern twist. His signature flair
                  bartending adds theater to every event, transforming simple pours into
                  unforgettable performances.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-2xl font-bold">4.9</span>
                    </div>
                    <p className="text-white/60 text-sm">Average Rating</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-2xl font-bold">150+</span>
                    </div>
                    <p className="text-white/60 text-sm">Events Served</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-bold">TABC Certified</span>
                    </div>
                    <p className="text-white/60 text-sm">Master Mixologist</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-2xl font-bold">$150</span>
                    </div>
                    <p className="text-white/60 text-sm">Per Hour</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/talent/marcus`}>
                    <GoldButton size="lg">View Full Profile</GoldButton>
                  </Link>
                  <Link href={`/booking?bartender=marcus`}>
                    <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-all font-semibold">
                      Check Availability
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Featured Profile 2 - Image Right */}
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="md:order-2 relative h-[600px] rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80')] bg-cover bg-center transform group-hover:scale-105 transition-transform duration-700" />

                {/* Overlay badges */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                  <span className="inline-block px-3 py-1 bg-yellow-500 text-black text-xs font-semibold uppercase tracking-wider rounded-full">
                    Featured
                  </span>
                  <span className="inline-block px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-500 text-xs font-semibold uppercase tracking-wider rounded-full">
                    Master Sommelier
                  </span>
                </div>
              </div>

              <div className="md:order-1">
                <h3 className="font-serif text-5xl text-white mb-4">Sofia Martinez</h3>
                <p className="text-white/70 text-lg mb-6 leading-relaxed italic">
                  "Wine and spirits are art forms. I'm just the curator of your experience."
                </p>
                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                  A certified sommelier and craft cocktail artist, Sofia brings an unparalleled
                  level of sophistication to every event. Her expertise in wine pairing and
                  molecular mixology creates truly unique experiences that guests remember long
                  after the last sip.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-2xl font-bold">5.0</span>
                    </div>
                    <p className="text-white/60 text-sm">Perfect Rating</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-2xl font-bold">200+</span>
                    </div>
                    <p className="text-white/60 text-sm">Events Served</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-bold">TABC & Sommelier</span>
                    </div>
                    <p className="text-white/60 text-sm">Craft Specialist</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-2xl font-bold">$175</span>
                    </div>
                    <p className="text-white/60 text-sm">Per Hour</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href={`/talent/sofia`}>
                    <GoldButton size="lg">View Full Profile</GoldButton>
                  </Link>
                  <Link href={`/booking?bartender=sofia`}>
                    <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-all font-semibold">
                      Check Availability
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Bento Grid - Magazine Layout */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="mb-20">
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                The Full Roster
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
                More Exceptional <span className="italic">Talent</span>
              </h2>
              <p className="text-white/60 text-xl max-w-2xl">
                Browse our complete collection of certified bartenders, each bringing unique
                expertise and style to your event.
              </p>
            </div>
          </FadeIn>

          {/* Bento Grid with Mixed Sizes */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularBartenders.map((bartender, index) => {
              const isLarge = bartender.size === "large"

              return (
                <StaggerItem
                  key={bartender.id}
                  className={`group ${isLarge ? "md:col-span-2 md:row-span-1" : ""}`}
                >
                  <Link href={`/talent/${bartender.id}`}>
                    <div className={`relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-yellow-500/50 transition-all duration-500 ${isLarge ? "h-[500px]" : "h-[400px]"}`}>
                      {/* Background Image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                      <div
                        className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url(${bartender.avatar})` }}
                      />

                      {/* Content Overlay */}
                      <div className="relative z-20 h-full flex flex-col justify-between p-6">
                        {/* Top badges */}
                        <div className="flex flex-wrap gap-2">
                          {bartender.certifications.slice(0, 2).map((cert) => (
                            <span
                              key={cert}
                              className="inline-block px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 text-yellow-500 text-xs font-semibold uppercase tracking-wider rounded-full"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>

                        {/* Bottom content */}
                        <div>
                          <h3 className="font-serif text-3xl text-white mb-2">
                            {bartender.name}
                          </h3>
                          <p className="text-white/70 text-sm mb-4">{bartender.specialty}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-white font-semibold">{bartender.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-white/60">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{bartender.eventsServed} events</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-yellow-500">
                                ${bartender.hourlyRate}
                              </div>
                              <div className="text-white/60 text-xs">/hour</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <FadeIn>
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                Ready to Book?
              </p>
              <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
                Your perfect bartender is <span className="italic">waiting</span>
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl leading-relaxed">
                Start your booking journey today and let us match you with a bartender
                who'll make your event unforgettable. Every detail curated, every pour perfected.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/booking">
                  <GoldButton size="lg">Start Your Booking</GoldButton>
                </Link>
                <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-all font-semibold">
                  Learn About Our Process
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-white/10 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <h3 className="font-serif text-3xl text-yellow-500 mb-4">Black Orchid</h3>
              <p className="text-white/60 mb-6 max-w-md leading-relaxed">
                Austin's premier dry-hire bartending service. Where luxury meets expertise,
                and every event becomes an experience.
              </p>
              <div className="text-white/40 text-sm">
                © 2024 Black Orchid Bar Co. Crafted in Austin, TX
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Explore</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="/talent" className="hover:text-yellow-500 transition-colors">Bartenders</Link></li>
                <li><Link href="/services" className="hover:text-yellow-500 transition-colors">Services</Link></li>
                <li><Link href="/booking" className="hover:text-yellow-500 transition-colors">Book Now</Link></li>
                <li><Link href="/about" className="hover:text-yellow-500 transition-colors">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-yellow-500 transition-colors">Facebook</a></li>
                <li><Link href="/contact" className="hover:text-yellow-500 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}
