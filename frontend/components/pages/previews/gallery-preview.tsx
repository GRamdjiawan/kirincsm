"use client"

import { ImageIcon } from "lucide-react"
import { useSectionContext } from "../section-context"
import type { GalleryContent } from "../section-types"

export function GalleryPreview() {
  const { selectedSection } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "GALLERY") return null

  const content = selectedSection.content as GalleryContent

  if (content.images.length === 0) {
    return (
      <div className="p-3 sm:p-4 text-center text-gray-400">
        <p>No images added yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <h3 className="text-base sm:text-lg font-medium px-3 sm:px-4 pt-3 sm:pt-4">{content.title}</h3>
      <div
        className="grid gap-2 p-3 sm:p-4"
        style={{
          gridTemplateColumns: `repeat(${content.columns}, minmax(0, 1fr))`,
        }}
      >
        {content.images.map((image) => (
          <div key={image.id} className="space-y-1">
            <div className="aspect-square bg-white/5 rounded-lg overflow-hidden">
              {image.imageUrl ? (
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/10">
                  <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">{image.caption}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
