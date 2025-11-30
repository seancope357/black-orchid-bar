"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "active" | "subtle"
  hover?: boolean
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, children, ...props }, ref) => {
    const variants = {
      default: "border-white/10",
      active: "border-yellow-500/50",
      subtle: "border-white/5"
    }

    const Component = hover ? motion.div : "div"
    const motionProps = hover ? {
      whileHover: { y: -4, transition: { duration: 0.2 } },
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    } : {}

    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-2xl border backdrop-blur-md",
          "bg-black/40 p-6",
          variants[variant],
          hover && "transition-shadow hover:shadow-xl hover:shadow-yellow-500/10",
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

GlassCard.displayName = "GlassCard"

export { GlassCard }
