"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSectionContext } from "../section-context"
import type { CardSectionContent } from "../section-types"
import { ImageUploader } from "../image-uploader"

export function CardEditor() {
  const { selectedSection, updateSectionContent } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "CARD") return null

  const content = selectedSection.content as CardSectionContent

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="card-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="card-title"
          value={content.title}
          onChange={(e) => updateSectionContent("title", e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this card section"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="card-heading" className="text-sm">
              Card Heading
            </Label>
            <Input
              id="card-heading"
              value={content.heading}
              onChange={(e) => updateSectionContent("heading", e.target.value)}
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
              placeholder="Enter a heading for the card"
            />
          </div>

          <div>
            <Label htmlFor="card-text" className="text-sm">
              Card Text
            </Label>
            <Textarea
              id="card-text"
              value={content.text}
              onChange={(e) => updateSectionContent("text", e.target.value)}
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[100px] sm:min-h-[120px] rounded-xl mt-1"
              placeholder="Enter text content for the card"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="button-text" className="text-sm">
                Button Text
              </Label>
              <Input
                id="button-text"
                value={content.buttonText}
                onChange={(e) => updateSectionContent("buttonText", e.target.value)}
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                placeholder="e.g., Learn More"
              />
            </div>
            <div>
              <Label htmlFor="button-url" className="text-sm">
                Button URL
              </Label>
              <Input
                id="button-url"
                value={content.buttonUrl}
                onChange={(e) => updateSectionContent("buttonUrl", e.target.value)}
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                placeholder="e.g., /contact"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm">Card Image</Label>
          <ImageUploader
            imageUrl={content.imageUrl}
            alt={content.heading}
            onUpload={(url) => updateSectionContent("imageUrl", url)}
            onRemove={() => updateSectionContent("imageUrl", "")}
            placeholderText="Upload an image for this card"
          />
        </div>
      </div>
    </div>
  )
}
