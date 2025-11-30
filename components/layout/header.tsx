'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Header() {
  const pathname = usePathname()
  
  // Don't show header on auth pages
  if (pathname?.startsWith('/auth')) {
    return null
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary tracking-tight">
            Black Orchid
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/bartenders"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Find Bartenders
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            How It Works
          </Link>
        </nav>
        
        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
