"use client"

import { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  tiltMaxAngle?: number
  glareEnable?: boolean
}

export function TiltCard({
  children,
  className = "",
  tiltMaxAngle = 15,
  glareEnable = true
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltMaxAngle, -tiltMaxAngle])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltMaxAngle, tiltMaxAngle])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d"
      }}
      className={`relative ${className}`}
    >
      {children}

      {/* Glare effect */}
      {glareEnable && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-inherit"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([x, y]) =>
                `radial-gradient(circle at ${(x as number + 0.5) * 100}% ${(y as number + 0.5) * 100}%, rgba(234,179,8,0.15) 0%, transparent 50%)`
            ),
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease"
          }}
        />
      )}
    </motion.div>
  )
}
