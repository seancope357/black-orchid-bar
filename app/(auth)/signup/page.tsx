"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { GoldButton } from "@/components/ui/gold-button"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

type Role = "client" | "bartender"

export default function SignupPage() {
  const [role, setRole] = useState<Role | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setIsLoading(true)
    // TODO: Implement Supabase auth with role
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="font-serif text-4xl text-yellow-500 mb-2">Black Orchid</h1>
          </Link>
          <p className="text-white/60">Join our exclusive community</p>
        </div>

        <GlassCard>
          {!role ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-8">I want to...</h2>
              
              <button
                onClick={() => setRole("client")}
                className={cn(
                  "w-full p-6 rounded-xl border-2 transition-all duration-200",
                  "border-white/10 hover:border-yellow-500/50 bg-white/5 hover:bg-yellow-500/10"
                )}
              >
                <User className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Book a Bartender</h3>
                <p className="text-sm text-white/60">Host unforgettable events</p>
              </button>

              <button
                onClick={() => setRole("bartender")}
                className={cn(
                  "w-full p-6 rounded-xl border-2 transition-all duration-200",
                  "border-white/10 hover:border-yellow-500/50 bg-white/5 hover:bg-yellow-500/10"
                )}
              >
                <Briefcase className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Join as Bartender</h3>
                <p className="text-sm text-white/60">Showcase your craft</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-white">
                  Sign up as <span className="text-yellow-500 capitalize">{role}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="text-sm text-white/60 hover:text-yellow-500"
                >
                  Change
                </button>
              </div>

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <GoldButton type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </GoldButton>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-yellow-500 hover:text-yellow-400 font-medium">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
