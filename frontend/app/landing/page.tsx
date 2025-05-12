import { HeroBanner } from "@/components/auth/hero-banner"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] to-[#1a1a1a]">
      {/* Hero section with gradient banner */}
      <HeroBanner />

      {/* Additional landing page content would go here */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          Powerful Features for Modern Content Management
        </h2>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Intuitive Editor", description: "Create and edit content with our powerful WYSIWYG editor" },
            { title: "SEO Optimization", description: "Built-in tools to improve your search engine rankings" },
            { title: "Media Management", description: "Easily upload, organize and optimize your media files" },
            { title: "Responsive Design", description: "Your content looks great on any device, automatically" },
            { title: "Version Control", description: "Track changes and roll back to previous versions anytime" },
            { title: "Advanced Analytics", description: "Gain insights into how your content performs" },
          ].map((feature, index) => (
            <div
              key={index}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8 hover:border-neon-blue/30 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
