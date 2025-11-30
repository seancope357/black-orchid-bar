"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Sparkles, TrendingUp, Users, Star, Award, Shield } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { BartenderCard } from "@/components/bartender-card"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { FadeIn } from "@/components/ui/fade-in"
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger-container"
import { AnimatedGradient } from "@/components/ui/animated-gradient"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

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
          <AnimatedGradient />
        </div>

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-yellow-500/10 blur-3xl"
          animate={{
            y: [0, 30, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-yellow-500/5 blur-3xl"
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-500 text-sm font-medium backdrop-blur-sm">
                <Shield className="inline w-4 h-4 mr-2" />
                TABC Certified Professionals
              </span>
            </motion.div>

            <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 leading-tight">
              The Art of
              <br />
              <span className="text-yellow-500 inline-block">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="inline-block"
                >
                  The Pour
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto"
            >
              Premium bartending services. No bottles. No compromises.
              <br />
              <span className="text-white/90 font-medium">Just world-class talent.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link href="/booking">
                <GoldButton size="lg" className="group">
                  Reserve Talent
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </GoldButton>
              </Link>
            </motion.div>
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

      {/* Stats Section */}
      <section className="py-20 relative border-b border-white/5">
        <div className="container mx-auto px-6">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "500+", label: "Events Served" },
              { icon: Star, value: "4.9", label: "Average Rating" },
              { icon: Award, value: "100%", label: "TABC Certified" },
              { icon: Shield, value: "24/7", label: "Support" }
            ].map((stat, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <stat.icon className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/60">{stat.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              How It <span className="text-yellow-500">Works</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Three steps to an unforgettable evening
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <StaggerItem key={index}>
                <GlassCard className="text-center h-full hover:border-yellow-500/50 transition-all duration-300 group">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-yellow-500 text-sm mb-4">
                    Step {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Talent */}
      <section className="py-32 relative bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-20">
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
              Featured <span className="text-yellow-500">Talent</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Meet our elite roster of certified professionals
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredBartenders.map((bartender) => (
              <StaggerItem key={bartender.id}>
                <BartenderCard {...bartender} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4} className="text-center">
            <Link href="/talent">
              <GoldButton>View All Talent</GoldButton>
            </Link>
          </FadeIn>
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
      <footer className="border-t border-white/10 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="font-serif text-2xl text-yellow-500 mb-4">Black Orchid</h3>
              <p className="text-white/60 text-sm mb-6">
                Ultra-luxury bartending services for exclusive events across Austin and the Hill Country.
              </p>
              <div className="flex space-x-4">
                {/* Social links placeholder */}
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-yellow-500/20 flex items-center justify-center transition-colors">
                  <span className="text-white/60 text-xs">IG</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-yellow-500/20 flex items-center justify-center transition-colors">
                  <span className="text-white/60 text-xs">FB</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-yellow-500/20 flex items-center justify-center transition-colors">
                  <span className="text-white/60 text-xs">TW</span>
                </a>
              </div>
            </div>

            {/* For Clients */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/booking" className="text-white/60 hover:text-yellow-500 transition-colors">Book Bartenders</Link></li>
                <li><Link href="/talent" className="text-white/60 hover:text-yellow-500 transition-colors">Browse Talent</Link></li>
                <li><Link href="/services" className="text-white/60 hover:text-yellow-500 transition-colors">Services & Pricing</Link></li>
                <li><Link href="/dashboard/client" className="text-white/60 hover:text-yellow-500 transition-colors">My Bookings</Link></li>
              </ul>
            </div>

            {/* For Bartenders */}
            <div>
              <h4 className="text-white font-semibold mb-4">For Bartenders</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/bartender/onboarding" className="text-white/60 hover:text-yellow-500 transition-colors">Join Our Team</Link></li>
                <li><Link href="/bartender/dashboard" className="text-white/60 hover:text-yellow-500 transition-colors">Dashboard</Link></li>
                <li><Link href="/about" className="text-white/60 hover:text-yellow-500 transition-colors">Requirements</Link></li>
                <li><Link href="/about" className="text-white/60 hover:text-yellow-500 transition-colors">TABC Info</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-white/60 hover:text-yellow-500 transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-yellow-500 transition-colors">Contact</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-yellow-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-white/60 hover:text-yellow-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
            <p>© 2024 Black Orchid Bar Co. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Crafted with precision in Austin, TX</p>
          </div>
        </div>
      </footer>

      <AIChatWidget />
      <ScrollToTop />
    </div>
  )
}
