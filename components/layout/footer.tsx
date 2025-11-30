import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Black Orchid</h3>
            <p className="text-sm text-muted-foreground">
              Your Digital Speakeasy. Ultra-luxury bartending services for exclusive events.
            </p>
          </div>
          
          {/* For Clients */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">For Clients</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/bartenders" className="hover:text-primary transition-colors">
                  Find Bartenders
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Bartenders */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">For Bartenders</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/signup" className="hover:text-primary transition-colors">
                  Join as Bartender
                </Link>
              </li>
              <li>
                <Link href="/bartender/requirements" className="hover:text-primary transition-colors">
                  Requirements
                </Link>
              </li>
              <li>
                <Link href="/bartender/benefits" className="hover:text-primary transition-colors">
                  Benefits
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            © {currentYear} Black Orchid Bar Co. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
