"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSectionContext } from "../section-context"
import { ImageUploader } from "../image-uploader"
import { useEffect, useState } from "react"

export function HeroEditor() {
  const { selectedSection } = useSectionContext()
  const [media, setMedia] = useState<any[]>([])

  useEffect(() => {
    if (!selectedSection || selectedSection.type !== "HERO") return

    fetch(`http://localhost:8000/api/media/${selectedSection.id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMedia(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Failed to fetch hero section media:", err)
        setMedia([])
      })
  }, [selectedSection])

  if (!media.length) {
    return <div className="text-gray-400">No media found for this section.</div>
  }

  // Helper to get media.text by title
  const getMediaText = (title: string) => media.find((m) => m.title === title)?.text || ""

  return (
    <div className="space-y-6">
      {/* Background Image Selector */}
      {media.find((m) => m.file_url) ? (
        <div>
          <Label className="text-sm mb-2 block">Background Image</Label>
          <ImageUploader
            imageUrl={media.find((m) => m.file_url)?.file_url}
            onUpload={() => {}}
            onRemove={() => {}}
            alt=""
            placeholderText="Select a background image"
          />
        </div>
      ) : null}

      {/* Title Input */}
      <div>
        <Label htmlFor="hero-title" className="text-sm">
          Title
        </Label>
        <Input
          id="hero-title"
          value={getMediaText("title")}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter the main title"
          readOnly
        />
      </div>

      {/* Initials Input */}
      <div>
        <Label htmlFor="hero-initials" className="text-sm">
          Initials
        </Label>
        <Input
          id="hero-initials"
          value={getMediaText("initials")}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter initials (e.g., JD)"
          maxLength={3}
          readOnly
        />
      </div>

      {/* Text Input */}
      <div>
        <Label htmlFor="hero-text" className="text-sm">
          Text
        </Label>
        <Textarea
          id="hero-text"
          value={getMediaText("description")}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[120px] rounded-xl mt-1"
          placeholder="Enter the descriptive text content"
          readOnly
        />
      </div>
    </div>
  )
}
