"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GoldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  size?: "default" | "sm" | "lg"
}

const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, asChild = false, size = "default", disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button

    const sizeClasses = {
      default: "px-8 py-3 text-base",
      sm: "px-6 py-2.5 text-sm",
      lg: "px-10 py-4 text-lg"
    }

    const motionProps = !asChild && !disabled ? {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    } : {}

    return (
      <Comp
        ref={ref}
        disabled={disabled}
        {...motionProps}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold",
          "bg-yellow-500 text-black transition-all duration-200",
          "hover:bg-yellow-400 active:bg-yellow-600",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/40",
          "border border-yellow-400/50",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)

GoldButton.displayName = "GoldButton"

export { GoldButton }
