"use client"

import { motion } from "framer-motion"

export function AnimatedGradient() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(234, 179, 8, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(234, 179, 8, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(234, 179, 8, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.15) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
    </div>
  )
}
