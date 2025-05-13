"use client"

import { useEffect, useState } from "react"
import { LoadingAnimation } from "@/components/ui/loading-animation"
import { motion } from "framer-motion"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
  timeout?: number
  onComplete?: () => void
}

export function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
  timeout = 3000,
  onComplete,
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onComplete) onComplete()
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout, onComplete])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-dark-200 to-dark-100
        ${fullScreen ? "fixed inset-0 z-50" : "w-full h-full min-h-[200px]"}
      `}
    >
      <LoadingAnimation size="large" color="gradient" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-white text-xl font-medium"
      >
        {message}
      </motion.div>
    </motion.div>
  )
}
