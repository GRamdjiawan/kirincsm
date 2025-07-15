"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSectionContext } from "../section-context"
import { useEffect, useState } from "react"

export function TextEditor() {
  const { selectedSection } = useSectionContext()
  const [media, setMedia] = useState<any[]>([])

  useEffect(() => {
    if (!selectedSection || selectedSection.type !== "TEXT") return

    fetch(`http://localhost:8000/api/media/${selectedSection.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setMedia(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch text section media:", err)
        setMedia([])
      })
  }, [selectedSection])

  if (!media.length) {
    return <div className="text-gray-400">No media found for this section.</div>
  }

  // Helper to get media.text by title
  const getMediaText = (title: string) => media.find((m) => m.title === title)?.text || ""

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="text-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="text-title"
          value={getMediaText("title")}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this section"
          readOnly
        />
      </div>

      <div>
        <Label htmlFor="text-content" className="text-sm">
          Text Content
        </Label>
        <Textarea
          id="text-content"
          value={getMediaText("content")}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[150px] sm:min-h-[200px] rounded-xl mt-1"
          placeholder="Enter the text content for this section..."
          readOnly
        />
      </div>
    </div>
  )
}
