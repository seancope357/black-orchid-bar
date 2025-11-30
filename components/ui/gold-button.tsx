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
  ({ className, asChild = false, size = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : motion.button
    
    const sizeClasses = {
      default: "px-8 py-3 text-base",
      sm: "px-6 py-2 text-sm",
      lg: "px-10 py-4 text-lg"
    }

    return (
      <Comp
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold",
          "bg-gradient-to-r from-yellow-600 to-yellow-400",
          "text-black transition-all duration-200",
          "hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed",
          "shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40",
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
