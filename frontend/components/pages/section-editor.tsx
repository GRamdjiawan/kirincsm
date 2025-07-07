"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSectionContext } from "./section-context"
import { SectionTypeSelector } from "./section-type-selector"
import { TextEditor } from "./editors/text-editor"
import { CarouselEditor } from "./editors/carousel-editor"
import { GalleryEditor } from "./editors/gallery-editor"
import { CardEditor } from "./editors/card-editor"
import { HeroEditor } from "./editors/hero-editor"

export function SectionEditor() {
  const { selectedSection, updateSectionTitle } = useSectionContext()

  console.log("Rendering editor for section:", selectedSection);
  if (!selectedSection) {
    return <div className="h-full flex items-center justify-center text-gray-400">No section selected</div>
  }

  
  const renderEditor = () => {
    switch (selectedSection.type) {
      case "TEXT":
        return <TextEditor />
      case "CAROUSEL":
        return <CarouselEditor />
      case "GALLERY":
        return <GalleryEditor />
      case "CARD":
        return <CardEditor />
      case "HERO":
        return <HeroEditor />
      default:
        return null
    }
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Edit Section</h4>
          {/* <SectionTypeSelector /> */}
        </div>

        <div>
          <Label htmlFor="section-title" className="text-sm">
            Section Title
          </Label>
          <Input
            id="section-title"
            value={selectedSection.title}
            onChange={(e) => updateSectionTitle(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            placeholder="Enter a title for this section"
          />
        </div>

        {renderEditor()}
      </div>
    </div>
  )
}
