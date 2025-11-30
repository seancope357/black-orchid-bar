import ConciergeChat from '@/components/chat/ConciergeChat'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo / Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-primary tracking-tight">
              Black Orchid
            </h1>
            <p className="text-xl text-muted-foreground italic">
              Your Digital Speakeasy
            </p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-foreground">
              Ultra-luxury bartending services for exclusive events.
              Professional talent. Impeccable execution. Unforgettable experiences.
            </p>
            <p className="text-sm text-muted-foreground">
              Operating on the <span className="text-primary font-semibold">Dry Hire</span> model:
              You provide the spirits, we provide the artistry.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Book a Bartender
            </Link>
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-secondary text-secondary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Join as Bartender
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="text-3xl mb-3">🍸</div>
              <h3 className="font-semibold text-lg mb-2">Craft Cocktails</h3>
              <p className="text-sm text-muted-foreground">
                Signature drinks crafted by certified mixologists with years of experience.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-lg mb-2">AI Concierge</h3>
              <p className="text-sm text-muted-foreground">
                Smart planning assistant for shopping lists, recipes, and event logistics.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-lg mb-2">Premium Add-Ons</h3>
              <p className="text-sm text-muted-foreground">
                Gold Standard mixers, luxury garnishes, clear ice, mobile bar setups.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Concierge */}
      <ConciergeChat />
    </div>
  )
}
