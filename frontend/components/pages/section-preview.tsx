"use client"

import { Card } from "@/components/ui/card"
import { useSectionContext } from "./section-context"
import { TextPreview } from "./previews/text-preview"
import { CarouselPreview } from "./previews/carousel-preview"
import { GalleryPreview } from "./previews/gallery-preview"
import { CardPreview } from "./previews/card-preview"
import { HeroPreview } from "./previews/hero-preview"

export function SectionPreview() {
  const { selectedSection } = useSectionContext()

  if (!selectedSection) {
    return <div className="h-full flex items-center justify-center text-gray-400">No section selected</div>
  }

  const renderPreview = () => {
    switch (selectedSection.type) {
      case "TEXT":
        return <TextPreview />
      case "CAROUSEL":
        return <CarouselPreview />
      case "GALLERY":
        return <GalleryPreview />
      case "CARD":
        return <CardPreview />
      case "HERO":
        return <HeroPreview />
      default:
        return null
    }
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h4 className="text-lg font-medium mb-4">Section Preview</h4>
      <Card className="bg-black/40 border-white/5 rounded-xl">{renderPreview()}</Card>
    </div>
  )
}
