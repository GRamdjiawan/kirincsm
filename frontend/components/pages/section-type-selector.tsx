"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Type, Images, ImageIcon, CreditCard, Sparkles } from "lucide-react"
import { useSectionContext } from "./section-context"
import type { SectionType } from "./section-types"

export function SectionTypeSelector() {
  const { selectedSection, handleSectionTypeChange } = useSectionContext()

  if (!selectedSection) return null

  return (
    <Select value={selectedSection.type} onValueChange={(value) => handleSectionTypeChange(value as SectionType)}>
      <SelectTrigger className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl w-[180px]">
        <SelectValue placeholder="Select type" />
      </SelectTrigger>
      <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
        <SelectItem value="TEXT">
          <Type className="h-4 w-4 mr-2" />
          Text
        </SelectItem>
        <SelectItem value="CAROUSEL">
          <Images className="h-4 w-4 mr-2" />
          Carousel
        </SelectItem>
        <SelectItem value="GALLERY">
          <ImageIcon className="h-4 w-4 mr-2" />
          Gallery
        </SelectItem>
        <SelectItem value="CARD">
          <CreditCard className="h-4 w-4 mr-2" />
          Card
        </SelectItem>
        <SelectItem value="HERO">
          <Sparkles className="h-4 w-4 mr-2" />
          Hero
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
