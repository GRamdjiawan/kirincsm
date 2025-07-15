"use client"

interface SEOPreviewProps {
  type: "search" | "social"
  title: string
  description: string
  url: string
  imageUrl?: string
}

export function SEOPreview({ type, title, description, url, imageUrl }: SEOPreviewProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const formatUrl = (url: string) => {
    return url.replace(/^https?:\/\/(www\.)?/, "")
  }

  if (type === "search") {
    return (
      <div className="border border-white/10 rounded-lg p-4 bg-white/5 max-w-xl">
        <div className="text-xl text-neon-blue font-medium line-clamp-1">{truncateText(title, 60) || "Page Title"}</div>
        <div className="text-green-400 text-sm mt-1">{formatUrl(url)}</div>
        <div className="text-gray-300 text-sm mt-1 line-clamp-2">
          {truncateText(description, 160) ||
            "Add a meta description to improve how your page appears in search results."}
        </div>
      </div>
    )
  }

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 max-w-xl">
      {imageUrl ? (
        <div className="w-full aspect-[1.91/1] bg-gray-800 relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Social media preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=630&width=1200"
            }}
          />
        </div>
      ) : (
        <div className="w-full aspect-[1.91/1] bg-gray-800 flex items-center justify-center">
          <div className="text-gray-400 text-sm">No image provided</div>
        </div>
      )}
      <div className="p-4">
        <div className="text-xs text-gray-400 uppercase">{formatUrl(url)}</div>
        <div className="text-white font-medium mt-1 line-clamp-1">{truncateText(title, 70) || "Page Title"}</div>
        <div className="text-gray-300 text-sm mt-1 line-clamp-3">
          {truncateText(description, 200) ||
            "Add a meta description to improve how your page appears when shared on social media."}
        </div>
      </div>
    </div>
  )
}
