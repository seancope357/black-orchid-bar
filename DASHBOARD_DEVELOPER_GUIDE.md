# Client Dashboard - Developer Guide

## Quick Start

### View the Dashboard
Navigate to `/dashboard/client` when logged in as a client.

### Components & Files Modified

1. **Main Dashboard Page**
   - File: `app/dashboard/client/page.tsx`
   - Type: Server Component
   - Handles: Data fetching, authentication, upcoming/past bookings separation

2. **Booking Details Page**
   - File: `app/dashboard/client/bookings/[id]/page.tsx`
   - Type: Server Component with Dynamic Routing
   - Handles: Individual booking view with full details

3. **Booking Card Component**
   - File: `components/dashboard/booking-card.tsx`
   - Type: Client Component (uses useState, animations)
   - Reusable: Yes (used in dashboard and potentially elsewhere)

4. **Empty State**
   - File: `components/dashboard/empty-state.tsx`
   - Purpose: Friendly message when no bookings exist

5. **Loading State**
   - File: `components/dashboard/loading-state.tsx`
   - Purpose: Skeleton placeholders during data load

6. **Utilities**
   - File: `lib/utils.ts` (updated)
   - New Functions:
     - `formatDate(date)`
     - `formatTime(date)`
     - `formatDateTime(date)`

## Database Relationships

### Bookings Query Structure

```
bookings
├── client_id → profiles (booking creator)
├── bartender_id → profiles (assigned bartender)
│                  → bartender_details
│                  → avatar_url
└── status (inquiry, confirmed, completed, cancelled)
```

### Key Fields Used

**From `bookings` table:**
- `id`: Booking UUID
- `event_date`: When the event occurs
- `event_duration_hours`: How long bartender works
- `guest_count`: Number of guests at event
- `event_type`: Type of event (cocktail party, wedding, etc.)
- `special_requests`: Client notes/requests
- `status`: Current booking status
- `total_amount`: Optional pre-set total
- `client_id`: Current logged-in user (filtered)
- `bartender_id`: Reference to bartender

**From `bartender_details` table:**
- `hourly_rate`: Cost per hour (used for estimation)
- `is_tabc_certified`: Certification badge
- `years_experience`: Display in profile
- `specialties`: Array of specialty keywords
- `bio`: Bartender biography

**From `profiles` table:**
- `full_name`: Bartender or client name
- `avatar_url`: Profile picture URL

## Code Snippets

### Fetch Bookings (Server Component)

```typescript
const supabase = await createClient()

const { data: bookings, error } = await supabase
  .from('bookings')
  .select(`
    id, event_date, event_duration_hours, guest_count,
    event_type, special_requests, status, total_amount,
    bartender_id,
    bartender_details (hourly_rate),
    bartender_profile:bartender_id (full_name, avatar_url)
  `)
  .eq('client_id', userId)
  .order('event_date', { ascending: false })

if (error) throw error
return bookings
```

### Get Single Booking (Server Component)

```typescript
const { data: booking, error } = await supabase
  .from('bookings')
  .select(`
    id, event_date, event_duration_hours, guest_count,
    event_type, special_requests, status, total_amount,
    created_at, updated_at, bartender_id, client_id,
    bartender_details (hourly_rate, is_tabc_certified, years_experience, specialties, bio),
    bartender_profile:bartender_id (full_name, avatar_url)
  `)
  .eq('id', bookingId)
  .single()

// Verify access
if (booking.client_id !== userId && booking.bartender_id !== userId) {
  return null // No access
}
```

### Format Booking Dates

```typescript
import { formatDate, formatTime, formatDateTime } from '@/lib/utils'

const eventDate = new Date('2024-12-15T18:00:00Z')

formatDate(eventDate)          // "Dec 15, 2024"
formatTime(eventDate)          // "6:00 PM"
formatDateTime(eventDate)      // "Dec 15, 2024 at 6:00 PM"
```

### Status Badge Styling

```typescript
const statusStyles = {
  inquiry: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Inquiry" },
  confirmed: { bg: "bg-green-500/20", text: "text-green-400", label: "Confirmed" },
  completed: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Completed" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled" }
}

const style = statusStyles[booking.status]
// <span className={`${style.bg} ${style.text}`}>{style.label}</span>
```

## Common Tasks

### Add a New Booking Field to Dashboard

1. **Update Database Query** (in main page.tsx):
   ```typescript
   .select(`
     // ... existing fields
     new_field,  // Add here
   `)
   ```

2. **Update TypeScript Interface**:
   ```typescript
   interface Booking {
     // ... existing fields
     new_field: string | null
   }
   ```

3. **Display in BookingCard**:
   ```typescript
   {booking.new_field && (
     <div>
       <label>Field Label</label>
       <p>{booking.new_field}</p>
     </div>
   )}
   ```

### Modify Status Badge Colors

1. Edit `statusStyles` object in `booking-card.tsx` or `[id]/page.tsx`
2. Update Tailwind classes for `bg`, `text`, `border`
3. Example:
   ```typescript
   inquiry: {
     bg: "bg-purple-500/20",    // Changed from yellow
     text: "text-purple-400",   // Changed from yellow
     border: "border-purple-500/30"
   }
   ```

### Add Filtering by Status

1. In `app/dashboard/client/page.tsx`, after fetching:
   ```typescript
   const filtered = bookings.filter(b => b.status === 'confirmed')
   ```

2. Or add UI tabs to switch between statuses

### Add Sorting Options

1. Modify `.order()` in database query:
   ```typescript
   .order('event_date', { ascending: true })  // Earliest first
   .order('total_amount', { ascending: false })  // Most expensive first
   ```

### Connect Stripe Payment Status

1. When displaying total, check `payments` table:
   ```typescript
   const { data: payment } = await supabase
     .from('payments')
     .select('status, amount_cents')
     .eq('booking_id', bookingId)
     .single()
   ```

2. Display payment status badge alongside booking status

## Testing

### Test With Mock Data

1. Create test bookings in Supabase (with correct `client_id`)
2. Navigate to `/dashboard/client`
3. Verify:
   - Bookings load correctly
   - Bartender names display
   - Dates/times format properly
   - Status badges appear

### Test With No Bookings

1. Create test client with no bookings
2. Navigate to `/dashboard/client`
3. Verify empty state displays

### Test Authentication

1. Try accessing `/dashboard/client` while logged out
2. Should redirect to `/auth/login`

### Test Access Control

1. Create bookings for client A
2. Log in as client B
3. Access `/dashboard/client` - should see no bookings
4. Try accessing booking by URL: `/dashboard/client/bookings/[other-booking-id]`
5. Should return 404 (notFound)

## Debugging

### Check Console Logs

Dashboard page logs errors to server console:
```
Error fetching bookings: {error details}
Error fetching profile: {error details}
```

### Enable Supabase Logging

In `lib/supabase/server.ts`, add:
```typescript
console.log('Booking query result:', { data: bookings, error: bookingsError })
```

### Inspect Database Queries

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run booking query manually to verify data

### Check RLS Policies

If getting 0 results or "permission denied":
1. Verify user is logged in
2. Check `bookings` table RLS policy:
   ```sql
   -- Should allow: auth.uid() = client_id OR auth.uid() = bartender_id
   ```
3. Verify user's UUID is in `bookings.client_id`

## Performance Tips

1. **Avoid N+1 Queries**: Use `.select()` with relationships, not separate queries
2. **Cache User Data**: Store authenticated user in state or context to avoid repeated auth checks
3. **Lazy Load Past Bookings**: Move past bookings to separate page/tab
4. **Add Pagination**: Limit results to 10-20 per page for large datasets
5. **Index Queries**: Database has indexes on `client_id`, `bartender_id`, `status`

## Related Pages

- **Auth**: `/app/(auth)/login/page.tsx`
- **Middleware**: `/middleware.ts` (role-based routing)
- **Booking Creation**: `/app/booking/page.tsx`
- **Bartender Dashboard**: `/app/dashboard/bartender/page.tsx` or `/app/bartender/dashboard/page.tsx`
- **Admin Dashboard**: `/app/admin/page.tsx`

## Styling Reference

### Color Classes
- Gold (primary): `text-yellow-500`, `bg-yellow-500/20`
- Green (confirmed): `text-green-400`, `bg-green-500/20`
- Blue (completed): `text-blue-400`, `bg-blue-500/20`
- Red (cancelled): `text-red-400`, `bg-red-500/20`
- Yellow (inquiry): `text-yellow-400`, `bg-yellow-500/20`

### Component Classes
- Glass cards: `bg-black/40 backdrop-blur-md border border-white/10`
- Text: `text-white` (primary), `text-white/60` (secondary), `text-white/40` (tertiary)
- Buttons: Use `GoldButton` component

## Component Props

### BookingCard
```typescript
interface BookingCardProps {
  booking: Booking           // Booking data
  isPast?: boolean          // Optional: styling variant
}
```

### GlassCard
```typescript
interface GlassCardProps {
  variant?: "default" | "active" | "subtle"
  hover?: boolean                          // Enable hover animation
  children: React.ReactNode
}
```

### GoldButton
```typescript
interface GoldButtonProps {
  size?: "default" | "sm" | "lg"
  children: React.ReactNode
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bookings not showing | Check `client_id` in database matches logged-in user |
| Bartender name blank | Verify `bartender_id` exists in `profiles` table |
| Dates show wrong time | Check timezone in formatting functions |
| Styles not applying | Clear Next.js cache: `rm -rf .next` |
| Build fails | Run `npm install` to ensure all deps present |
| RLS errors | Verify user is authenticated and has correct permissions |

## External Dependencies

- `@supabase/ssr`: Server-side Supabase client
- `framer-motion`: Animations
- `lucide-react`: Icons
- `tailwind-css`: Styling
- `next.js`: Framework (v16)

## Next Steps

1. Implement booking cancellation
2. Add review system for completed bookings
3. Integrate real-time updates with Supabase realtime subscriptions
4. Add messaging between client and bartender
5. Connect payment status from Stripe
