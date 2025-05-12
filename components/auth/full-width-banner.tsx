import Link from "next/link"
import { Button } from "@/components/ui/button"

export function FullWidthBanner() {
  return (
    <div className="w-full py-16 md:py-24 px-4">
      <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-3xl">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-blue opacity-90" />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />

        {/* Glow effects */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-neon-purple/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-neon-blue/40 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-white/90 max-w-2xl">
              Join thousands of creators and businesses managing their content with Nebula CMS
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="min-w-[140px] bg-white text-dark-200 hover:bg-white/90 border-0">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[140px] border-white text-white hover:bg-white/20"
            >
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
