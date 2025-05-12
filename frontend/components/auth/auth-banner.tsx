import Link from "next/link"
import { Button } from "@/components/ui/button"

interface AuthBannerProps {
  title?: string
  subtitle?: string
  className?: string
}

export function AuthBanner({
  title = "Manage Your Digital Experience",
  subtitle = "Login or register to access your Nebula CMS dashboard",
  className = "",
}: AuthBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative overflow-hidden rounded-2xl">
        {/* Gradient background with glassmorphism */}
        <div className="bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200 p-8 md:p-12 backdrop-blur-xl">
          {/* Glow effects */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 mix-blend-overlay" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{title}</h2>
            <p className="text-white/80 max-w-2xl">{subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="min-w-[120px] bg-white text-dark-200 hover:bg-white/90 border-0">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="min-w-[120px] border-white text-white hover:bg-white/10">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
