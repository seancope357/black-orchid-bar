import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApprovalList from '@/components/admin/ApprovalList'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const { data: pendingBartenders } = await supabase
    .from('bartender_details')
    .select('*, profiles!inner(full_name, avatar_url)')
    .eq('approval_status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Review and approve bartender applications</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
          {pendingBartenders && pendingBartenders.length > 0 ? (
            <ApprovalList bartenders={pendingBartenders} />
          ) : (
            <p className="text-muted-foreground text-center py-8">No pending applications</p>
          )}
        </div>
      </div>
    </div>
  )
}
