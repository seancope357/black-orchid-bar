"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Star, Award, Calendar, MapPin, Users, Clock, Shield, CheckCircle2, TrendingUp, Sparkles, Search } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoldButton } from "@/components/ui/gold-button"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { FadeIn } from "@/components/ui/fade-in"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Modern Marketplace Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8"
            >
              <Shield className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-500 font-medium">All bartenders TABC certified & insured</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
            >
              Book Expert Bartenders
              <br />
              <span className="text-yellow-500">For Your Next Event</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Austin's premier marketplace for professional bartending services.
              TABC certified, fully insured, and ready to elevate your event.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link href="/talent">
                <GoldButton size="lg" className="group">
                  Browse Bartenders
                  <Search className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </GoldButton>
              </Link>
              <Link href="/booking">
                <button className="px-8 py-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 text-white font-semibold hover:border-yellow-500/50 hover:bg-zinc-800/80 transition-all">
                  Get Instant Quote
                </button>
              </Link>
            </motion.div>

            {/* Social proof stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-sm"
            >
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-white font-semibold">4.9/5</span>
                <span className="text-zinc-500">from 500+ events</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-semibold">100%</span>
                <span className="text-zinc-500">certified talent</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-semibold">24hr</span>
                <span className="text-zinc-500">avg response time</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Bartenders - Modern Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-yellow-500 font-medium text-sm uppercase tracking-wider mb-2">
                Top Rated
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Featured Bartenders
              </h2>
            </div>
            <Link href="/talent" className="hidden md:flex items-center gap-2 text-yellow-500 font-semibold hover:gap-3 transition-all">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Bartender Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "Marcus Chen",
                specialty: "Master Mixologist",
                image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=2574",
                rating: 4.9,
                reviews: 147,
                rate: 150,
                experience: "12 years",
                events: "200+",
                certified: true
              },
              {
                name: "Sofia Martinez",
                specialty: "Craft Specialist",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576",
                rating: 5.0,
                reviews: 203,
                rate: 175,
                experience: "10 years",
                events: "250+",
                certified: true
              },
              {
                name: "James Wilson",
                specialty: "Event Bartender",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574",
                rating: 4.8,
                reviews: 128,
                rate: 140,
                experience: "8 years",
                events: "180+",
                certified: true
              }
            ].map((bartender, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Link href={`/talent/${bartender.name.toLowerCase().replace(' ', '-')}`}>
                  <div className="group relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-yellow-500/50 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url('${bartender.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                      {/* Certified badge */}
                      {bartender.certified && (
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          TABC
                        </div>
                      )}

                      {/* Rating badge */}
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-sm font-semibold">{bartender.rating}</span>
                        <span className="text-zinc-400 text-xs">({bartender.reviews})</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors">
                          {bartender.name}
                        </h3>
                        <p className="text-yellow-500 text-sm font-medium">{bartender.specialty}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{bartender.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{bartender.events} events</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div>
                          <p className="text-zinc-500 text-xs mb-0.5">Starting at</p>
                          <p className="text-white font-bold text-xl">${bartender.rate}<span className="text-zinc-500 text-sm font-normal">/hr</span></p>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-500 font-semibold text-sm group-hover:bg-yellow-500 group-hover:text-black transition-all">
                          View Profile
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>

          {/* Mobile view all link */}
          <Link href="/talent" className="md:hidden flex items-center justify-center gap-2 text-yellow-500 font-semibold">
            View All Bartenders <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us - Features Grid */}
      <section className="py-20 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-medium text-sm uppercase tracking-wider mb-2">
              Why Black Orchid
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Marketplace Difference
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We've reimagined luxury bartending services with a modern, transparent marketplace approach.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Fully Vetted",
                description: "Every bartender is TABC certified, background checked, and fully insured."
              },
              {
                icon: Star,
                title: "Top Rated",
                description: "Browse verified reviews and ratings from real events and satisfied clients."
              },
              {
                icon: TrendingUp,
                title: "Transparent Pricing",
                description: "Clear upfront pricing with no hidden fees. What you see is what you pay."
              },
              {
                icon: Clock,
                title: "Fast Response",
                description: "Get quotes within 24 hours and book instantly with our streamlined process."
              }
            ].map((feature, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-medium text-sm uppercase tracking-wider mb-2">
              Simple Process
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Book in 3 Easy Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Search & Compare",
                description: "Browse our curated marketplace of certified bartenders. Filter by experience, specialty, and price."
              },
              {
                step: "02",
                title: "Get Instant Quote",
                description: "Our AI concierge helps calculate your needs and provides transparent pricing instantly."
              },
              {
                step: "03",
                title: "Book & Relax",
                description: "Secure your booking online. We handle everything from here - you just enjoy your event."
              }
            ].map((step, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="relative">
                  {/* Step number */}
                  <div className="text-7xl font-bold text-yellow-500/10 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.description}</p>

                  {/* Connector line (except last) */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-yellow-500/50 to-transparent -z-10" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link href="/booking">
              <GoldButton size="lg">
                Start Your Booking
              </GoldButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-yellow-500 font-medium text-sm uppercase tracking-wider mb-2">
              Client Reviews
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Trusted by Austin's Best
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                quote: "Black Orchid made our wedding absolutely perfect. Marcus was professional, talented, and our guests couldn't stop raving about the cocktails!",
                author: "Jennifer & Michael",
                event: "Wedding Reception",
                rating: 5
              },
              {
                quote: "Best decision we made for our corporate event. Sofia handled 200+ guests effortlessly with class and expertise. Highly recommend!",
                author: "Tech Startup",
                event: "Corporate Event",
                rating: 5
              },
              {
                quote: "The booking process was seamless and the service was outstanding. Will definitely use Black Orchid for all our future events.",
                author: "Sarah T.",
                event: "Private Party",
                rating: 5
              }
            ].map((testimonial, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-white mb-6 leading-relaxed">"{testimonial.quote}"</p>

                  {/* Author */}
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-zinc-500 text-sm">{testimonial.event}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center rounded-3xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-12">
            <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Elevate Your Event?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust Black Orchid for their bartending needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/talent">
                <GoldButton size="lg">
                  Browse Bartenders
                </GoldButton>
              </Link>
              <Link href="/booking">
                <button className="px-8 py-4 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-700 text-white font-semibold hover:border-yellow-500/50 hover:bg-zinc-800/80 transition-all">
                  Get Quote
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-yellow-500 mb-3">Black Orchid</h3>
              <p className="text-zinc-400 mb-4 max-w-md">
                Austin's premier marketplace for professional bartending services. TABC certified, fully insured, and ready to make your event unforgettable.
              </p>
              <p className="text-zinc-600 text-sm">
                © 2024 Black Orchid Bar Co. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Marketplace</h4>
              <ul className="space-y-2">
                <li><Link href="/talent" className="text-zinc-400 hover:text-yellow-500 transition-colors">Browse Bartenders</Link></li>
                <li><Link href="/booking" className="text-zinc-400 hover:text-yellow-500 transition-colors">Book Now</Link></li>
                <li><Link href="/services" className="text-zinc-400 hover:text-yellow-500 transition-colors">Services</Link></li>
                <li><Link href="/pricing" className="text-zinc-400 hover:text-yellow-500 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-zinc-400 hover:text-yellow-500 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-zinc-400 hover:text-yellow-500 transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-zinc-400 hover:text-yellow-500 transition-colors">Careers</Link></li>
                <li><Link href="/terms" className="text-zinc-400 hover:text-yellow-500 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <AIChatWidget />
      <ScrollToTop />
    </div>
  )
}
