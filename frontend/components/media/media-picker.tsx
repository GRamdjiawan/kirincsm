"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImagePlus, Upload, Search, X } from "lucide-react"
import { useMedia } from "./media-context"
import type { MediaItem } from "./media-types"

interface MediaPickerProps {
  onSelect: (media: MediaItem) => void
  selectedId?: string
  type?: "image" | "video" | "all"
  trigger: React.ReactNode
}

export function MediaPicker({ onSelect, selectedId, type = "all", trigger }: MediaPickerProps) {
  const { filteredItems, filter, setFilter, uploadMedia } = useMedia()
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const newMedia = await uploadMedia(file)
      onSelect(newMedia)
      setIsOpen(false)
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleMediaSelect = (media: MediaItem) => {
    onSelect(media)
    setIsOpen(false)
  }

  const filteredByType = filteredItems.filter((item) => {
    if (type === "all") return true
    return item.type === type
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-gray-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-gray-300">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search media..."
                    value={filter.search || ""}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-neon-blue"
                  />
                </div>
              </div>
              {filter.search && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter({ ...filter, search: "" })}
                  className="mt-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {filteredByType.map((media) => (
                <Card
                  key={media.id}
                  className={`cursor-pointer transition-all bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 ${
                    selectedId === media.id ? "ring-1 ring-neon-blue border-neon-blue/50" : ""
                  }`}
                  onClick={() => handleMediaSelect(media)}
                >
                  <CardContent className="p-2">
                    <div className="aspect-square bg-white/10 rounded-lg overflow-hidden mb-2">
                      {media.type === "image" ? (
                        <img
                          src={media.url || "/placeholder.svg"}
                          alt={media.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <span className="text-xs text-gray-400">Video</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium truncate text-white">{media.name}</p>
                    <p className="text-xs text-gray-400">
                      {media.dimensions ? `${media.dimensions.width}×${media.dimensions.height}` : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredByType.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <ImagePlus className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                <p>No media found</p>
                <p className="text-sm">Try adjusting your search or upload new media</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-white">Upload a file</span>
                <p className="text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "image/*,video/*"}
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              {isUploading && <p className="mt-2 text-neon-blue">Uploading...</p>}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
