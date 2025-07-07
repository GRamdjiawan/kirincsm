"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Images, Plus, Trash2 } from "lucide-react"
import { useSectionContext } from "../section-context"
import type { GalleryContent } from "../section-types"
import { ImageUploader } from "../image-uploader"

export function GalleryEditor() {
  const { selectedSection, updateSectionContent } = useSectionContext()
  const content = selectedSection?.content
  const [media, setMedia] = useState<any[]>([])

  useEffect(() => {
    if (!selectedSection || selectedSection.type !== "GALLERY") return
    

    fetch(`http://localhost:8000/api/media/${selectedSection.id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setMedia(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Failed to fetch gallery section media:", err)
        setMedia([])
      })
  }, [selectedSection])

  if (!content) {
    return <div className="text-gray-400">No content to edit.</div>
  }

  if (selectedSection.type !== "GALLERY") return null

  // Helper to get media.text by title
  const getMediaText = (title: string) => media.find((m) => m.title === title)?.text || ""

  // Gallery-specific functions
  const addGalleryImage = () => {
    const newImage = {
      id: `img-${Date.now()}`,
      imageUrl: "",
      caption: `Image ${content.images.length + 1}`,
    }

    const updatedImages = [...content.images, newImage]
    updateSectionContent("images", updatedImages)
  }

  const updateGalleryImage = (index: number, field: keyof GalleryContent["images"][0], value: string) => {
    const updatedImages = [...content.images]
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    }

    updateSectionContent("images", updatedImages)
  }

  const deleteGalleryImage = (index: number) => {
    const updatedImages = content.images.filter((_, i) => i !== index)
    updateSectionContent("images", updatedImages)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="gallery-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="gallery-title"
          value={getMediaText("title") || content.title}
          onChange={(e) => updateSectionContent("title", e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this gallery"
        />
      </div>

      <div>
        <Label htmlFor="gallery-columns" className="text-sm">
          Number of Columns
        </Label>
        <Select
          value={content.columns.toString()}
          onValueChange={(value) => updateSectionContent("columns", Number.parseInt(value))}
        >
          <SelectTrigger
            id="gallery-columns"
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          >
            <SelectValue placeholder="Select columns" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
            <SelectItem value="1">1 Column</SelectItem>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Gallery Images</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addGalleryImage}
            className="h-8 px-2 text-xs rounded-lg border-white/10 hover:bg-white/5"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {content.images.map((image, index) => (
            <Card key={image.id} className="bg-white/5 border-white/10 rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-white/5 border-b border-white/10 px-3 sm:px-4 py-2 flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium">Image {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGalleryImage(index)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-transparent"
                  >
                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor={`image-caption-${index}`} className="text-sm">
                      Caption
                    </Label>
                    <Input
                      id={`image-caption-${index}`}
                      value={image.caption}
                      onChange={(e) => updateGalleryImage(index, "caption", e.target.value)}
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                      placeholder="Enter a caption for this image"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Image</Label>
                    <ImageUploader
                      imageUrl={image.imageUrl}
                      alt={image.caption}
                      aspectRatio="square"
                      onUpload={(url) => updateGalleryImage(index, "imageUrl", url)}
                      onRemove={() => updateGalleryImage(index, "imageUrl", "")}
                      placeholderText="Upload an image"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {content.images.length === 0 && (
            <div className="col-span-full text-center py-6 sm:py-8 bg-white/5 rounded-xl border border-white/10">
              <Images className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm">No images added yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={addGalleryImage}
                className="border-white/10 hover:bg-white/5 rounded-xl"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                Add First Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
