import { FullWidthBanner } from "@/components/auth/full-width-banner"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Demo Page</h1>

        {/* Demo content would go here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map((item) => (
            <div key={item} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 h-64">
              <h3 className="text-xl font-semibold text-white mb-2">Feature {item}</h3>
              <p className="text-gray-400">
                This is a placeholder for feature content. Replace with actual feature descriptions.
              </p>
            </div>
          ))}
        </div>

        {/* Full width banner */}
        <FullWidthBanner />
      </div>
    </div>
  )
}
