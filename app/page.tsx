"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Sparkles, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { BartenderCard } from "@/components/bartender-card"
import { AIChatWidget } from "@/components/ai-chat-widget"

export default function Home() {
  const featuredBartenders = [
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
    }
  ]

  const steps = [
    {
      icon: Calendar,
      title: "Book Talent",
      description: "Select from our vetted roster of certified bartenders"
    },
    {
      icon: Sparkles,
      title: "AI Shopping List",
      description: "Receive a personalized inventory based on your event"
    },
    {
      icon: TrendingUp,
      title: "Flawless Execution",
      description: "We arrive, pour perfection, and elevate your night"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 leading-tight">
              The Art of
              <br />
              <span className="text-yellow-500">The Pour</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto">
              Premium bartending services. No bottles. No compromises. Just world-class talent.
            </p>
            <Link href="/booking">
              <GoldButton size="lg" className="group">
                Reserve Talent
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </GoldButton>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-yellow-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              How It <span className="text-yellow-500">Works</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Three steps to an unforgettable evening
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <GlassCard className="text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talent */}
      <section className="py-32 relative bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              Featured <span className="text-yellow-500">Talent</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Meet our elite roster of certified professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredBartenders.map((bartender, index) => (
              <motion.div
                key={bartender.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BartenderCard {...bartender} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/talent">
              <GoldButton>View All Talent</GoldButton>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <GlassCard variant="active" className="text-center max-w-4xl mx-auto p-16">
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Ready to elevate your next event?
            </h2>
            <p className="text-xl text-white/60 mb-12">
              Let our AI Concierge help you plan the perfect experience
            </p>
            <Link href="/booking">
              <GoldButton size="lg">Start Planning</GoldButton>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6 text-center text-white/40 text-sm">
          <p className="font-serif text-yellow-500 text-lg mb-4">Black Orchid Bar Co.</p>
          <p>© 2024 Black Orchid. All rights reserved.</p>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  )
}
