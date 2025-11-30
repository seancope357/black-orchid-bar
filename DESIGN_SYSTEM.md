# Black Orchid Design System

## Overview
The Black Orchid design system implements a sophisticated, noir-inspired luxury aesthetic using modern web technologies. The system is built on Tailwind CSS v4 with a custom OKLCH color palette for precise color control and dark mode support.

## Brand Identity

### Voice & Tone
- **Sophisticated**: Professional, refined, impeccable
- **Exclusive**: Premium, curated, selective
- **Noir**: Dark, mysterious, elegant
- **Confident**: Assured, expert, authoritative

### Visual Theme
"Digital Speakeasy" - A modern interpretation of 1920s speakeasy luxury with contemporary minimalism.

## Color System (OKLCH)

### Primary Palette

**Gold (Primary)**
- Light: `oklch(0.7318 0.1106 94.0877)`
- Usage: CTA buttons, headings, brand elements
- Represents: Luxury, premium quality, exclusivity

**Deep Charcoal (Secondary)**
- Light: `oklch(0.3715 0 0)`
- Dark: `oklch(0.5999 0 0)`
- Usage: Secondary actions, text emphasis
- Represents: Sophistication, noir aesthetic

**Background**
- Light: `oklch(1.0000 0 0)` (Pure white)
- Dark: `oklch(0.1496 0 0)` (Deepest black)
- Usage: Page backgrounds

**Foreground (Text)**
- Light: `oklch(0.2101 0.0318 264.6645)`
- Dark: `oklch(0.8109 0 0)` (Marble white)
- Usage: Body text, primary content

### Semantic Colors

**Muted**
- Usage: Secondary text, subtle elements
- Light: `oklch(0.8141 0 0)`
- Dark: `oklch(0.2520 0 0)`

**Accent**
- Usage: Hover states, interactive elements
- Light: `oklch(0.5727 0 0)`
- Dark: `oklch(0.3211 0 0)`

**Destructive**
- Usage: Error states, delete actions
- `oklch(0.6368 0.2078 25.3313)`

**Success**
- Usage: Approval states, confirmations
- `bg-green-600`

**Warning**
- Usage: Pending states, cautions
- `bg-yellow-600`

### Border & Input
- Border: `oklch(0.9276 0.0058 264.5313)` / `oklch(0.2520 0 0)`
- Input: Same as border
- Ring (focus): Matches primary color

## Typography

### Fonts
- **Primary**: Geist Sans (variable font)
- **Monospace**: Geist Mono (code, technical content)

### Scale
- **Display**: 6xl-8xl (96px-128px) - Hero headlines
- **Heading 1**: 4xl (48px) - Section titles
- **Heading 2**: 3xl (36px) - Subsection titles  
- **Heading 3**: 2xl (24px) - Card titles
- **Heading 4**: xl (20px) - Subheadings
- **Body Large**: lg (18px) - Hero descriptions
- **Body**: base (16px) - Default body text
- **Body Small**: sm (14px) - Secondary text
- **Caption**: xs (12px) - Labels, metadata

## Components

### Button (`components/ui/button.tsx`)

**Variants:**
- `primary` - Gold background, primary actions
- `secondary` - Charcoal background, secondary actions
- `outline` - Transparent with border, tertiary actions
- `ghost` - No background, minimal actions
- `destructive` - Red background, dangerous actions

**Sizes:**
- `sm` - h-9, px-4 (compact interfaces)
- `md` - h-11, px-6 (default)
- `lg` - h-14, px-8 (hero CTAs)

**Usage:**
```tsx
<Button variant="primary" size="lg">Book Now</Button>
<Button variant="outline" size="sm">Learn More</Button>
```

### Input (`components/ui/input.tsx`)

**Features:**
- Optional label
- Error message display
- Focus ring with primary color
- Full accessibility support

**Usage:**
```tsx
<Input 
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  error={errors.email}
/>
```

### Card (`components/ui/card.tsx`)

**Subcomponents:**
- `Card` - Container
- `CardHeader` - Top section with padding
- `CardTitle` - Title text (2xl)
- `CardDescription` - Subtitle text (muted)
- `CardContent` - Main content area
- `CardFooter` - Bottom action area

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Professional Bartender</CardTitle>
    <CardDescription>10 years experience</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Bio and details...</p>
  </CardContent>
  <CardFooter>
    <Button>Book Now</Button>
  </CardFooter>
</Card>
```

### Badge (`components/ui/badge.tsx`)

**Variants:**
- `default` - Gold
- `secondary` - Charcoal
- `success` - Green (approved status)
- `warning` - Yellow (pending status)
- `destructive` - Red (rejected status)
- `outline` - Bordered, transparent

**Usage:**
```tsx
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
```

### Alert (`components/ui/alert.tsx`)

**Variants:**
- `default` - Neutral information
- `success` - Positive confirmation
- `warning` - Important notice
- `destructive` - Error or critical info

**Subcomponents:**
- `Alert` - Container
- `AlertTitle` - Bold heading
- `AlertDescription` - Body text

**Usage:**
```tsx
<Alert variant="success">
  <AlertTitle>Booking Confirmed</AlertTitle>
  <AlertDescription>
    Your bartender has been booked for June 15th.
  </AlertDescription>
</Alert>
```

### Textarea (`components/ui/textarea.tsx`)

**Features:**
- Multi-line text input
- Minimum height: 120px
- Optional label and error states

### Select (`components/ui/select.tsx`)

**Props:**
- `options` - Array of `{value, label}` objects
- `label` - Optional label text
- `error` - Optional error message

## Layout Components

### Header (`components/layout/header.tsx`)

**Features:**
- Sticky positioning with backdrop blur
- Logo with link to home
- Desktop navigation menu
- Login/Get Started CTAs
- Conditionally hidden on auth pages

### Footer (`components/layout/footer.tsx`)

**Sections:**
- Brand identity
- For Clients links
- For Bartenders links
- Company links
- Copyright notice

## Spacing System

**Padding/Margin Scale:**
- `1` = 4px
- `2` = 8px
- `4` = 16px
- `6` = 24px
- `8` = 32px
- `12` = 48px
- `16` = 64px
- `24` = 96px

**Container:**
- Max width: responsive (uses Tailwind's `container` utility)
- Horizontal padding: `px-6` (24px)

## Border Radius

- `--radius`: 0.75rem (12px)
- `lg`: var(--radius)
- `md`: calc(var(--radius) - 2px)
- `sm`: calc(var(--radius) - 4px)

## Animations

**Transitions:**
- Default: `transition-all` or `transition-colors`
- Duration: 150ms-200ms (Tailwind defaults)

**Focus States:**
- Ring: 2px solid primary color
- Ring offset: 2px

## Accessibility

**Color Contrast:**
- All text meets WCAG AA standards
- Primary gold on dark backgrounds: AAA compliant
- Muted text on backgrounds: AA compliant

**Focus Management:**
- Visible focus rings on all interactive elements
- Keyboard navigation fully supported
- ARIA labels on icon-only buttons

**Screen Readers:**
- Semantic HTML structure
- Proper heading hierarchy
- Alt text on images
- ARIA labels where needed

## Dark Mode

**Implementation:**
- Uses `class` strategy (`.dark` selector)
- Default mode: Dark
- OKLCH values adjusted for dark backgrounds
- Maintains consistent contrast ratios

**Toggle:**
Currently set to dark mode by default via `<html className="dark">` in layout. Can be made user-controllable by implementing theme toggle component.

## Responsive Breakpoints

**Tailwind Defaults:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Usage Patterns:**
- Mobile-first approach
- Stack columns on mobile, grid on desktop
- Hide secondary navigation on mobile
- Adjust typography scale for smaller screens

## Best Practices

1. **Always use design system components** - Don't create one-off styled elements
2. **Maintain color consistency** - Use semantic color tokens, not arbitrary values
3. **Follow spacing scale** - Use defined spacing values for consistency
4. **Accessibility first** - Test with keyboard and screen readers
5. **Mobile responsive** - Test all breakpoints
6. **Dark mode aware** - Ensure all custom styles work in dark mode

## Future Enhancements

- [ ] Light mode support with theme toggle
- [ ] Additional input types (checkbox, radio, switch)
- [ ] Modal/Dialog component
- [ ] Toast notification system
- [ ] Dropdown menu component
- [ ] Tabs component
- [ ] Accordion component
- [ ] Date picker for booking forms
