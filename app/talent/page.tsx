import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { TalentPageClient } from '@/components/talent/talent-page-client'
import { TalentPageSkeleton } from '@/components/talent/talent-page-skeleton'
import { TalentPageError } from '@/components/talent/talent-page-error'
import { Navbar } from '@/components/navbar'

interface Bartender {
  id: string
  name: string
  avatar: string
  hourlyRate: number
  certifications: string[]
  specialty?: string
}

interface BartenderRow {
  user_id: string
  hourly_rate: number | null
  is_tabc_certified: boolean
  specialties: string[] | null
  bio: string | null
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
}

async function fetchBartenders(): Promise<Bartender[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('bartender_details')
      .select(`
        user_id,
        hourly_rate,
        is_tabc_certified,
        specialties,
        bio,
        profiles!inner(full_name, avatar_url)
      `)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bartenders:', error)
      throw new Error(`Failed to fetch bartenders: ${error.message}`)
    }

    if (!data) {
      return []
    }

    // Transform database data to component format
    return data.map((bartender: BartenderRow) => ({
      id: bartender.user_id,
      name: bartender.profiles.full_name || 'Unknown',
      avatar: bartender.profiles.avatar_url || '/placeholder-avatar.jpg',
      hourlyRate: bartender.hourly_rate || 0,
      certifications: bartender.is_tabc_certified ? ['TABC'] : [],
      specialty: bartender.specialties?.join(', ') || bartender.bio?.substring(0, 50) || undefined,
    }))
  } catch (error) {
    console.error('Failed to fetch bartenders:', error)
    throw error
  }
}

async function TalentPageContent() {
  let bartenders: Bartender[] = []
  let hasError = false
  let errorMessage = ''

  try {
    bartenders = await fetchBartenders()
  } catch (error) {
    hasError = true
    errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to load bartenders. Please try again later.'
  }

  if (hasError) {
    return <TalentPageError message={errorMessage} />
  }

  return <TalentPageClient bartenders={bartenders} />
}

export default async function TalentPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<TalentPageSkeleton />}>
        <TalentPageContent />
      </Suspense>
    </div>
  )
}
