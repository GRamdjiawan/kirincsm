"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSectionContext } from "../section-context"
import type { HeroContent } from "../section-types"

export function HeroPreview() {
  const { selectedSection } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "HERO") return null

  const content = selectedSection.content as HeroContent

  return (
    <div className="relative">
      {content.backgroundUrl && (
        <div className="absolute inset-0 overflow-hidden">
          {content.backgroundType === "image" ? (
            <img
              src={content.backgroundUrl || "/placeholder.svg"}
              alt="Hero background"
              className="w-full h-full object-cover"
              style={{ opacity: content.overlayOpacity / 100 }}
            />
          ) : (
            <video
              src={content.backgroundUrl}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
              style={{ opacity: content.overlayOpacity / 100 }}
            />
          )}
          <div className="absolute inset-0 bg-black" style={{ opacity: content.overlayOpacity / 100 }} />
        </div>
      )}
      <div
        className={cn(
          "relative py-16 sm:py-24 px-6 sm:px-8 lg:px-12 flex flex-col items-center justify-center text-center",
          content.fullHeight
            ? "min-h-[60vh] sm:min-h-[75vh] lg:min-h-[85vh] xl:min-h-[90vh]"
            : "min-h-[40vh] sm:min-h-[50vh]",
        )}
      >
        <div className="max-w-2xl space-y-4">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
            style={{ textAlign: content.textAlignment }}
          >
            {content.headline}
          </h1>
          <p className="text-lg sm:text-xl text-gray-200" style={{ textAlign: content.textAlignment }}>
            {content.subtext}
          </p>
          <Button variant={content.buttonStyle} size="lg" asChild>
            <a href={content.buttonUrl}>{content.buttonText}</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
