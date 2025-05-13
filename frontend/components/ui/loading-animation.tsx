"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface LoadingAnimationProps {
  size?: "small" | "medium" | "large"
  color?: "blue" | "purple" | "gradient"
  className?: string
}

export function LoadingAnimation({ size = "medium", color = "gradient", className = "" }: LoadingAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const circle1Ref = useRef<SVGCircleElement>(null)
  const circle2Ref = useRef<SVGCircleElement>(null)
  const circle3Ref = useRef<SVGCircleElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Determine dimensions based on size prop
  const dimensions = {
    small: { size: 40, strokeWidth: 3 },
    medium: { size: 60, strokeWidth: 4 },
    large: { size: 100, strokeWidth: 5 },
  }

  const { size: sizeValue, strokeWidth } = dimensions[size]
  const radius = (sizeValue - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  // Determine color based on color prop
  const getStrokeColor = (circleIndex: number) => {
    if (color === "blue") return "#6f7cff"
    if (color === "purple") return "#a855f7"

    // For gradient, alternate between blue and purple
    return circleIndex % 2 === 0 ? "#6f7cff" : "#a855f7"
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Create a timeline for the animation
    const tl = gsap.timeline({ repeat: -1 })

    // Animate the circles
    tl.to([circle1Ref.current, circle2Ref.current, circle3Ref.current], {
      strokeDashoffset: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.inOut",
    }).to(
      [circle1Ref.current, circle2Ref.current, circle3Ref.current],
      {
        rotation: 360,
        transformOrigin: "center",
        duration: 2,
        ease: "none",
        stagger: 0.1,
      },
      0,
    )

    // Animate the glow effect
    gsap.to(glowRef.current, {
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    return () => {
      // Clean up animations when component unmounts
      tl.kill()
      gsap.killTweensOf(glowRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-full opacity-40 blur-md"
        style={{
          background:
            color === "blue" ? "#6f7cff" : color === "purple" ? "#a855f7" : "linear-gradient(135deg, #6f7cff, #a855f7)",
        }}
      />

      <svg width={sizeValue} height={sizeValue} viewBox={`0 0 ${sizeValue} ${sizeValue}`} className="relative z-10">
        {/* Circle 1 */}
        <circle
          ref={circle1Ref}
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor(1)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${sizeValue / 2} ${sizeValue / 2})`}
          className="opacity-80"
        />

        {/* Circle 2 */}
        <circle
          ref={circle2Ref}
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius * 0.75}
          fill="none"
          stroke={getStrokeColor(2)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={circumference * 0.75}
          strokeLinecap="round"
          transform={`rotate(45 ${sizeValue / 2} ${sizeValue / 2})`}
          className="opacity-90"
        />

        {/* Circle 3 */}
        <circle
          ref={circle3Ref}
          cx={sizeValue / 2}
          cy={sizeValue / 2}
          r={radius * 0.5}
          fill="none"
          stroke={getStrokeColor(3)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference * 0.5}
          strokeDashoffset={circumference * 0.5}
          strokeLinecap="round"
          transform={`rotate(180 ${sizeValue / 2} ${sizeValue / 2})`}
          className="opacity-100"
        />
      </svg>
    </div>
  )
}
