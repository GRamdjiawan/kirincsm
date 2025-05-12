import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <div className="w-full min-h-[500px] md:min-h-[600px] relative flex items-center justify-center overflow-hidden">
      {/* Background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/80 via-dark-100 to-neon-blue/80 animate-gradient-slow" />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-neon-purple to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-neon-blue to-transparent rounded-full blur-3xl" />
      </div>

      {/* Glassmorphism layer */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
          Next-Generation Content Management
        </h1>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Powerful, intuitive, and designed for the modern web. Take control of your digital content today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-white text-dark-200 hover:bg-white/90 border-0">
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 border-white text-white hover:bg-white/10"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
