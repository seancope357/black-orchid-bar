"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Star, Award, Calendar, MapPin, Users, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { GoldButton } from "@/components/ui/gold-button"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { FadeIn } from "@/components/ui/fade-in"
import { ScrollToTop } from "@/components/ui/scroll-to-top"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Magazine-Style Hero */}
      <section className="relative h-screen">
        {/* Hero Image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2574')] bg-cover bg-center" />

        <div className="relative z-20 h-full flex items-end">
          <div className="container mx-auto px-6 pb-24">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                  Austin's Premier Bartending Service
                </p>
                <h1 className="font-serif text-6xl md:text-8xl text-white mb-6 leading-tight">
                  Crafted Moments,
                  <br />
                  <span className="italic">Unforgettable Nights</span>
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                  Your event deserves more than a bartender. It deserves an artist, a storyteller,
                  a master of their craft who transforms every pour into an experience.
                </p>
                <Link href="/talent">
                  <GoldButton size="lg" className="group">
                    Explore Our Talent
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </GoldButton>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - Featured Content */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                The Black Orchid Difference
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-white">
                Where Luxury Meets <span className="italic">Expertise</span>
              </h2>
            </div>
          </FadeIn>

          {/* Magazine-style bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <FadeIn className="md:col-span-2 md:row-span-2">
              <div className="group relative h-[600px] overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-yellow-500/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=2566')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />

                <div className="relative z-20 h-full flex flex-col justify-end p-8">
                  <span className="inline-block px-3 py-1 bg-yellow-500 text-black text-xs font-semibold uppercase tracking-wider rounded-full mb-4 w-fit">
                    Featured Service
                  </span>
                  <h3 className="font-serif text-4xl text-white mb-4">
                    Dry Hire Excellence
                  </h3>
                  <p className="text-white/70 text-lg mb-6 max-w-lg">
                    You provide the spirits. We provide world-class bartending, premium mixers,
                    and an unforgettable experience. The future of luxury event services.
                  </p>
                  <Link href="/services" className="text-yellow-500 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Stats Card */}
            <FadeIn delay={0.2}>
              <div className="h-[292px] rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 p-8 flex flex-col justify-between">
                <div>
                  <div className="text-6xl font-bold text-black mb-2">500+</div>
                  <p className="text-black/80 text-lg">Events Served</p>
                </div>
                <div className="flex items-center gap-2 text-black/70">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.9 Average Rating</span>
                </div>
              </div>
            </FadeIn>

            {/* TABC Card */}
            <FadeIn delay={0.3}>
              <div className="h-[292px] rounded-2xl bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between hover:border-yellow-500/50 transition-all">
                <Award className="w-12 h-12 text-yellow-500 mb-4" />
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">100% Certified</h4>
                  <p className="text-white/60">Every bartender is TABC certified and fully insured</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Featured Bartenders - Editorial Style */}
      <section className="py-32 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="mb-20">
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                Meet The Masters
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">
                Our Featured <span className="italic">Talent</span>
              </h2>
              <p className="text-white/60 text-xl max-w-2xl">
                Each bartender in our roster has been hand-selected for their expertise,
                professionalism, and ability to create unforgettable experiences.
              </p>
            </div>
          </FadeIn>

          {/* Magazine-style profiles */}
          <div className="space-y-24">
            {/* Bartender 1 - Image Left */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="relative h-[500px] rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=2574')] bg-cover bg-center" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                    Master Mixologist
                  </span>
                  <h3 className="font-serif text-4xl text-white mb-4">Marcus Chen</h3>
                  <p className="text-white/60 text-lg mb-6 leading-relaxed">
                    With 12 years of experience across Austin's most prestigious venues, Marcus
                    specializes in classic cocktails with a modern twist. His signature flair
                    bartending adds theater to every event.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">4.9 Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">150+ Events</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">TABC Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">$150/hour</span>
                    </div>
                  </div>
                  <Link href="/talent/marcus">
                    <GoldButton>View Profile</GoldButton>
                  </Link>
                </div>
              </div>
            </FadeIn>

            {/* Bartender 2 - Image Right */}
            <FadeIn>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="md:order-2 relative h-[500px] rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576')] bg-cover bg-center" />
                </div>
                <div className="md:order-1">
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                    Craft Specialist
                  </span>
                  <h3 className="font-serif text-4xl text-white mb-4">Sofia Martinez</h3>
                  <p className="text-white/60 text-lg mb-6 leading-relaxed">
                    A certified sommelier and craft cocktail artist, Sofia brings an unparalleled
                    level of sophistication to every event. Her expertise in wine pairing and
                    molecular mixology creates truly unique experiences.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/80">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">5.0 Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Users className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">200+ Events</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Master Sommelier</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">$175/hour</span>
                    </div>
                  </div>
                  <Link href="/talent/sofia">
                    <GoldButton>View Profile</GoldButton>
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} className="text-center mt-20">
            <Link href="/talent">
              <GoldButton size="lg">View All Bartenders</GoldButton>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* How to Book - Visual Steps */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                Simple Process
              </p>
              <h2 className="font-serif text-5xl md:text-6xl text-white">
                How to <span className="italic">Book</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse Talent",
                description: "Explore our curated roster of certified bartenders. Filter by style, experience, and availability.",
                icon: Users
              },
              {
                step: "02",
                title: "Get Personalized Quote",
                description: "Our AI concierge calculates your shopping list and recommends the perfect bartender for your event.",
                icon: Calendar
              },
              {
                step: "03",
                title: "Book & Enjoy",
                description: "Secure your booking with our simple checkout. We'll handle the rest while you enjoy your perfect event.",
                icon: Star
              }
            ].map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="group relative p-8 rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-all hover:bg-white/5">
                  <div className="text-8xl font-serif text-yellow-500/20 mb-4 group-hover:text-yellow-500/30 transition-colors">
                    {item.step}
                  </div>
                  <item.icon className="w-8 h-8 text-yellow-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Editorial Style */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <FadeIn>
              <p className="text-yellow-500 font-serif text-sm tracking-widest uppercase mb-4">
                Ready to Elevate?
              </p>
              <h2 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
                Your next event starts <span className="italic">here</span>
              </h2>
              <p className="text-xl text-white/70 mb-12 max-w-2xl leading-relaxed">
                Whether it's an intimate gathering or a grand celebration, our bartenders
                bring the expertise and elegance that transforms good events into unforgettable experiences.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/booking">
                  <GoldButton size="lg">Start Your Booking</GoldButton>
                </Link>
                <Link href="/talent">
                  <button className="px-8 py-4 border-2 border-white/20 text-white rounded-full hover:border-yellow-500 hover:text-yellow-500 transition-all font-semibold">
                    Browse Bartenders
                  </button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer - Minimal & Editorial */}
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

      <AIChatWidget />
      <ScrollToTop />
    </div>
  )
}
