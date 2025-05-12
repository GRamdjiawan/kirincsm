import { AuthBanner } from "@/components/auth/auth-banner"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        {/* Logo and brand */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Nebula CMS</h1>
          <p className="text-gray-400 max-w-md">
            The next-generation content management system for your Vercel-hosted websites
          </p>
        </div>

        {/* Auth banner */}
        <AuthBanner />

        {/* Features section could go here */}
      </div>
    </div>
  )
}
