"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, User } from "lucide-react"
import { GoldButton } from "@/components/ui/gold-button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/talent", label: "Talent" },
    { href: "/services", label: "Services" },
  ]

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-black/90 backdrop-blur-lg border-b border-white/10" : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-serif text-yellow-500">Black Orchid</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-white/80 hover:text-yellow-500 transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
                  <User className="w-5 h-5 text-white/80" />
                </button>
              </Link>
              <Link href="/booking">
                <GoldButton size="sm">Book Now</GoldButton>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-zinc-900 border-l border-white/10 z-50 md:hidden overflow-y-auto"
          >
            <div className="p-6">
              {/* Close button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Menu content */}
              <div className="mt-16 space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-4">Navigation</p>
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-3 px-4 text-lg text-white/80 hover:text-yellow-500 hover:bg-white/5 rounded-lg transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-wider text-white/40 mb-4">Account</p>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-lg text-white/80 hover:text-yellow-500 hover:bg-white/5 rounded-lg transition-all"
                  >
                    Dashboard
                  </Link>
                </div>

                <div className="pt-4">
                  <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                    <GoldButton size="lg" className="w-full">Book Now</GoldButton>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  )
}
