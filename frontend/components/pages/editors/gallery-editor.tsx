"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Images, Plus } from "lucide-react"
import { useSectionContext } from "../section-context"
import { MediaSelector } from "@/components/media/media-selector"

interface MediaItem {
  id: number
  title: string
  file_url: string
  type: "image" | "video" | "text"
  domain_id: number
  uploaded_by: number
  section_id?: number | null
  text?: string | null
}

export function GalleryEditor() {
  const { selectedSection, updateSectionContent } = useSectionContext()
  const [media, setMedia] = useState<any[]>([])
  const [allMediaItems, setAllMediaItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    if (!selectedSection || selectedSection.type !== "GALLERY") return

    setIsLoading(true)

    fetch(`http://localhost:8000/api/media/${selectedSection.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setMedia(Array.isArray(data) ? data : [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch gallery section media:", err)
        setMedia([])
        setIsLoading(false)
      })
  }, [selectedSection])

  if (!selectedSection || selectedSection.type !== "GALLERY") return null

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-24 mb-2"></div>
          <div className="h-10 bg-white/5 border border-white/10 rounded-xl"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-32 mb-2"></div>
          <div className="h-10 bg-white/5 border border-white/10 rounded-xl"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-28 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-white/5 border border-white/10 rounded-xl"></div>
            <div className="h-32 bg-white/5 border border-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  // Helper to get media.text by title
  const getMediaText = (title: string) => media.find((m) => m.title === title)?.text || ""

  // Get all images from media
  const images = media.filter((m) => m.file_url && m.type === "image")

  // Show skeleton/empty state when no media data
  if (!media.length || images.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Section Title */}
        {/* <div>
          <Label htmlFor="gallery-title" className="text-sm">
            Section Title
          </Label>
          <Input
            id="gallery-title"
            value=""
            onChange={() => {}}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            placeholder="Enter a title for this gallery"
            readOnly
          />
        </div> */}

        {/* Gallery Images - Empty State with Media Selector */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Gallery Images</Label>
          </div>

          {/* Empty State */}
          <div className="text-center py-8 sm:py-12 bg-white/5 rounded-xl border border-white/10 border-dashed">
            <Images className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No images in this gallery</h3>
            <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
              Select images from your media library to create a beautiful gallery for this section.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <MediaSelector
              
                onSelect={(items) => {
                  console.log("Selected images:", items)
                  // Here you would typically save the selected images to your backend
                }}
                selectedItems={[]}
                selectedSection={Number(selectedSection?.id)}  
                multiple={true}
                type="image"
                trigger={
                  <Button className="bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl">
                    <Images className="h-4 w-4 mr-2" />
                    Select from Media Library
                  </Button>
                }
              />

            </div>
          </div>

          {/* Preview Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/5 border-white/10 border-dashed rounded-xl">
                <CardContent className="p-4">
                  <div className="aspect-square bg-white/10 rounded-lg mb-3 flex items-center justify-center">
                    <Images className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show actual gallery data when available
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* <div>
        <Label htmlFor="gallery-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="gallery-title"
          value={getMediaText("title")}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this gallery"
          readOnly
        />
      </div>

      <div>
        <Label htmlFor="gallery-columns" className="text-sm">
          Number of Columns
        </Label>
        <Input
          id="gallery-columns"
          value={getMediaText("columns") || "3"}
          onChange={() => {}}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Number of columns"
          readOnly
        />
      </div> */}

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Gallery Images</Label>
          <MediaSelector
            onSelect={(items) => {
              console.log("Adding more images:", items)
              // Here you would add the selected images to the existing gallery
            }}
            
            selectedSection={Number(selectedSection?.id)}
            multiple={true}
            type="image"
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs rounded-lg border-white/10 hover:bg-white/5 bg-transparent"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add More Images
              </Button>
            }
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-white/10">
                  <img
                    src={`http://localhost:8000${image.file_url}` || "/placeholder.svg"}
                    alt={image.text || image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <Input
                    value={image.text || image.title}
                    onChange={() => {}}
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-lg text-xs"
                    placeholder="Caption"
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
