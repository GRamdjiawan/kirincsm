"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSectionContext } from "../section-context"
import type { TextContent } from "../section-types"

export function TextEditor() {
  const { selectedSection, updateSectionContent } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "TEXT") return null

  const content = selectedSection.content as TextContent

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="text-title"
          value={content.title}
          onChange={(e) => updateSectionContent("title", e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this section"
        />
      </div>

      <div>
        <Label htmlFor="text-content" className="text-sm">
          Text Content
        </Label>
        <Textarea
          id="text-content"
          value={content.text}
          onChange={(e) => updateSectionContent("text", e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[150px] sm:min-h-[200px] rounded-xl mt-1"
          placeholder="Enter the text content for this section..."
        />
      </div>
    </div>
  )
}
