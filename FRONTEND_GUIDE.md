# Black Orchid Bar - Frontend Implementation Guide

## 🎨 Visual Layer Complete

The entire visual layer for Black Orchid Bar has been built with a **Luxury Noir** aesthetic. This guide documents the implementation.

---

## 📦 Component Architecture

### Core UI Elements (`components/ui/`)

#### 1. **GoldButton** (`gold-button.tsx`)
Premium CTA component with metallic gold gradient.

**Features:**
- Three sizes: `sm`, `default`, `lg`
- Hover effects: scale-up (1.05) + brightness boost
- Framer Motion animations
- Shadow with gold glow

**Usage:**
```tsx
<GoldButton size="lg" onClick={handleClick}>
  Reserve Talent
</GoldButton>
```

#### 2. **GlassCard** (`glass-card.tsx`)
Glassmorphic container with backdrop blur.

**Variants:**
- `default`: Subtle white border (10% opacity)
- `active`: Gold border (50% opacity)
- `subtle`: Almost invisible border (5% opacity)

**Props:**
- `hover`: Enable lift animation on hover

**Usage:**
```tsx
<GlassCard variant="active" hover>
  <h3>Card Title</h3>
  <p>Card content...</p>
</GlassCard>
```

#### 3. **Input** (`input.tsx`)
Glass-styled form input with luxury feel.

**Features:**
- Dark glass background (5% white)
- Gold focus ring
- Label + error state support
- Consistent 12px height (3rem)

**Usage:**
```tsx
<Input 
  label="Email"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
/>
```

#### 4. **Label** (`label.tsx`)
Form label component with off-white styling.

---

### Functional Components (`components/`)

#### 1. **Navbar** (`navbar.tsx`)
Fixed navigation with scroll-triggered transparency.

**Features:**
- Transparent initially, darkens on scroll
- Desktop: Logo + links + user avatar + Book Now button
- Mobile: Hamburger → full-screen overlay menu
- Smooth transitions

**Routes:**
- `/` - Home
- `/about` - About
- `/talent` - Talent search
- `/services` - Services
- `/dashboard` - User dashboard
- `/booking` - New booking

#### 2. **AIChatWidget** (`ai-chat-widget.tsx`)
Collapsible AI Concierge chat interface.

**States:**
- **Collapsed**: Gold floating button (bottom-right)
- **Expanded**: Full chat window (96 height, 600px)

**Features:**
- Uses Vercel AI SDK's `useChat` hook
- Connects to `/api/chat`
- Gold bubbles for user, dark glass bubbles for AI
- Typing indicator animation
- Smooth expand/collapse animations

#### 3. **BartenderCard** (`bartender-card.tsx`)
Profile card for bartenders.

**Displays:**
- Avatar image (48 height)
- Name + specialty
- Star rating (5 stars)
- Hourly rate
- TABC certification badge (gold pill)
- "Check Availability" CTA

**Props:**
```tsx
{
  id: string
  name: string
  avatar: string
  rating: number
  hourlyRate: number
  certifications: string[]
  specialty?: string
  onBookClick?: (id: string) => void
}
```

#### 4. **BookingWizard** (`components/booking/booking-wizard.tsx`)
Multi-step booking flow with progress tracking.

**Steps:**
1. **Event Details**: Date, guest count, drinking level
2. **Safety Check**: TABC bartender ratio validation
3. **Bartender Selection**: Choose from available talent
4. **Shopping List**: AI-generated inventory
5. **Upsells**: Premium add-on packages
6. **Payment**: Stripe checkout

**Features:**
- Visual progress bar with checkmarks
- Smooth slide transitions between steps
- Form validation
- Back/Continue navigation

---

## 🖥️ Pages

### Landing Page (`app/page.tsx`)

**Sections:**
1. **Hero**: Full-screen with gradient background, animated scroll indicator
2. **How It Works**: 3-step cards (Book → AI Shopping → Service)
3. **Featured Talent**: 3-column bartender grid
4. **CTA**: Final call-to-action card
5. **Footer**: Minimal with copyright

**Interactions:**
- Scroll-triggered animations (Framer Motion)
- Hover effects on cards
- Infinite scroll indicator animation

### Auth Pages (`app/(auth)/`)

#### Login (`login/page.tsx`)
- Center-aligned GlassCard form
- Email + password fields
- "Forgot password?" link
- Sign up redirect

#### Signup (`signup/page.tsx`)
- **Step 1**: Role selection (Client vs Bartender)
- **Step 2**: Registration form with role
- Animated transitions between steps

### Booking Page (`app/booking/page.tsx`)
Renders the `BookingWizard` component.

### Talent Search (`app/talent/page.tsx`)
**Features:**
- Search bar with icon
- Filter button
- 3-column responsive grid
- 6 mock bartenders displayed

### Client Dashboard (`app/dashboard/client/page.tsx`)
**Displays:**
- Personalized greeting ("Good evening, Alex")
- "Start New Booking" CTA
- Upcoming bookings grid
- Status badges (confirmed/inquiry)
- Empty state with CTA

---

## 🎨 Design System

### Color Palette (OKLCH)

**Primary Colors:**
- **Background**: `oklch(0.1496 0 0)` - Deep black
- **Foreground**: `oklch(0.8109 0 0)` - Off-white marble
- **Primary (Gold)**: `oklch(0.7318 0.1106 94.0877)` - Metallic gold

**Usage in Tailwind:**
- Text: `text-white`, `text-white/60`, `text-yellow-500`
- Backgrounds: `bg-black`, `bg-white/5`, `bg-yellow-500/10`
- Borders: `border-white/10`, `border-yellow-500/50`

### Typography

**Fonts:**
- **Sans-serif**: Inter (via `next/font/google`)
- **Serif**: Georgia (for headings/logos)

**Hierarchy:**
- Display: `text-6xl md:text-8xl font-serif`
- Headings: `text-3xl md:text-5xl font-bold`
- Body: `text-base text-white/60`
- Labels: `text-sm text-white/90`

### Spacing & Layout

**Glass Cards:**
- Padding: `p-6` (24px)
- Border radius: `rounded-2xl` (16px)
- Border: `border border-white/10`

**Sections:**
- Vertical padding: `py-32` (128px desktop), `py-16` (64px mobile)
- Container: `container mx-auto px-6`

### Animations

**Framer Motion Variants:**
```tsx
// Fade in from bottom
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Lift on hover
whileHover={{ y: -4 }}

// Scale button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

**CSS Animations:**
- Scroll indicator: infinite bounce
- Typing dots: staggered bounce with delays

---

## 🚀 Integration Points

### Supabase Auth (TODO)
Replace placeholders in auth pages:
```tsx
// In login/signup pages
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})
```

### AI Chat API
Already connected to `/api/chat` route.

### Bartender Data
Replace mock data with Supabase queries:
```tsx
const { data: bartenders } = await supabase
  .from('bartender_details')
  .select('*, profiles(*)')
  .eq('approval_status', 'approved')
```

### Stripe Integration
Embed checkout in Step 6 of BookingWizard:
```tsx
import { EmbeddedCheckout } from '@stripe/react-stripe-js'
```

---

## 📋 Implementation Checklist

### ✅ Completed
- [x] Core UI components (Button, Card, Input, Label)
- [x] Navbar with scroll effect
- [x] AI Chat widget
- [x] Bartender card component
- [x] Booking wizard (6 steps)
- [x] Landing page (all sections)
- [x] Auth pages (login/signup)
- [x] Talent search page
- [x] Client dashboard
- [x] Responsive design (mobile + desktop)
- [x] Framer Motion animations
- [x] Glass morphism effects
- [x] OKLCH color system

### 🔲 Next Steps
- [ ] Connect Supabase auth
- [ ] Fetch real bartender data
- [ ] Implement shopping list AI integration
- [ ] Add Stripe embedded checkout
- [ ] Bartender dashboard pages
- [ ] Admin portal
- [ ] Booking detail pages
- [ ] Image optimization (add real avatars)
- [ ] Loading states
- [ ] Error handling UI

---

## 🧪 Testing the Build

```bash
npm run dev
```

Visit:
- Landing: `http://localhost:3000`
- Login: `http://localhost:3000/auth/login`
- Signup: `http://localhost:3000/auth/signup`
- Talent: `http://localhost:3000/talent`
- Booking: `http://localhost:3000/booking`
- Dashboard: `http://localhost:3000/dashboard/client`

---

## 📝 Design Notes

**Visual Philosophy:**
- **Black Orchid = Luxury**: Everything should feel premium
- **Glassmorphism**: Frosted glass effect on all cards
- **Gold Accents**: Sparingly used for CTAs and highlights
- **Off-White Text**: Never pure white (#e5e5e5 for readability)
- **Generous Whitespace**: Padding inside cards for breathing room

**Responsive Breakpoints:**
- Mobile: < 768px
- Desktop: ≥ 768px (md)
- Large: ≥ 1024px (lg)

**Performance:**
- Use `next/image` for all images
- Lazy load animations with `whileInView`
- Minimize inline styles
- Use Tailwind's JIT compiler

---

## 🎯 Key Features

1. **Luxury Aesthetic**: Deep black + metallic gold + glass effects
2. **Smooth Animations**: Framer Motion throughout
3. **Mobile-First**: Responsive on all devices
4. **Accessibility**: Semantic HTML + ARIA labels
5. **Type-Safe**: Full TypeScript coverage
6. **Component-Based**: Reusable UI primitives

---

Built with ❤️ for Black Orchid Bar Co.
