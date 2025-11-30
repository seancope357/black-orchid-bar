'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Bartender = {
  user_id: string
  hourly_rate: number
  years_experience: number
  is_tabc_certified: boolean
  service_area: string
  bio: string
  specialties: string[]
  profiles: {
    full_name: string
    avatar_url: string | null
  }
}

export default function ApprovalList({ bartenders }: { bartenders: Bartender[] }) {
  const [processing, setProcessing] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleApproval = async (userId: string, status: 'approved' | 'rejected') => {
    setProcessing(userId)

    const { error } = await supabase
      .from('bartender_details')
      .update({ approval_status: status })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating approval status:', error)
      alert('Failed to update status')
    } else {
      router.refresh()
    }

    setProcessing(null)
  }

  return (
    <div className="space-y-4">
      {bartenders.map((bartender) => (
        <div
          key={bartender.user_id}
          className="border border-border rounded-lg p-6 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">{bartender.profiles.full_name}</h3>
              <p className="text-sm text-muted-foreground">{bartender.service_area}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-primary">${bartender.hourly_rate}/hr</p>
              <p className="text-sm text-muted-foreground">{bartender.years_experience} years exp.</p>
            </div>
          </div>

          {bartender.bio && (
            <p className="text-sm text-foreground">{bartender.bio}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {bartender.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full"
              >
                {specialty}
              </span>
            ))}
            {bartender.is_tabc_certified && (
              <span className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-full font-semibold">
                ✓ TABC Certified
              </span>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleApproval(bartender.user_id, 'approved')}
              disabled={processing === bartender.user_id}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50"
            >
              {processing === bartender.user_id ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={() => handleApproval(bartender.user_id, 'rejected')}
              disabled={processing === bartender.user_id}
              className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50"
            >
              {processing === bartender.user_id ? 'Processing...' : 'Reject'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
