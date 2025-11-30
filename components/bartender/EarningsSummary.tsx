"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react"

interface EarningsSummaryProps {
  totalEarnings: number
  thisMonthEarnings: number
  completedBookings: number
  pendingPayouts: number
}

export function EarningsSummary({
  totalEarnings,
  thisMonthEarnings,
  completedBookings,
  pendingPayouts,
}: EarningsSummaryProps) {
  const stats = [
    {
      label: "Total Earnings",
      value: `$${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "This Month",
      value: `$${thisMonthEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Completed Events",
      value: completedBookings.toString(),
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Pending Payouts",
      value: `$${pendingPayouts.toLocaleString()}`,
      icon: CreditCard,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <GlassCard key={index}>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-white/60 text-xs font-medium mb-1">{stat.label}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
