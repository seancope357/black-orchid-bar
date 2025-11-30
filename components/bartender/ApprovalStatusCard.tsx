"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"

interface ApprovalStatusCardProps {
  status: 'pending' | 'approved' | 'rejected'
}

export function ApprovalStatusCard({ status }: ApprovalStatusCardProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      text: "Pending Review",
      description: "Your application is being reviewed by our team. This typically takes 1-2 business days.",
      badgeVariant: "warning" as const,
      iconColor: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    approved: {
      icon: CheckCircle,
      text: "Approved",
      description: "Congratulations! Your profile is live and you can now receive bookings.",
      badgeVariant: "success" as const,
      iconColor: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    rejected: {
      icon: XCircle,
      text: "Not Approved",
      description: "Unfortunately, your application was not approved. Please contact support for more information.",
      badgeVariant: "destructive" as const,
      iconColor: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${config.bgColor}`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Profile Status</h3>
            <Badge variant={config.badgeVariant} className="mt-1">
              {config.text}
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-white/60 text-sm leading-relaxed">
        {config.description}
      </p>

      {status === 'pending' && (
        <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/60">
              While your profile is under review, you will not appear in search results or receive booking requests.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
