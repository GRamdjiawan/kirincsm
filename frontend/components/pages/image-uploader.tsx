"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, Trash2 } from "lucide-react"

interface ImageUploaderProps {
  imageUrl: string
  alt: string
  onUpload: (url: string) => void
  onRemove: () => void
  aspectRatio?: "square" | "video" | "custom"
  height?: string
  className?: string
  placeholderText?: string
}

export function ImageUploader({
  imageUrl,
  alt,
  onUpload,
  onRemove,
  aspectRatio = "video",
  height = "h-full",
  className = "",
  placeholderText = "Upload an image",
}: ImageUploaderProps) {
  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square"
      case "video":
        return "aspect-video"
      default:
        return ""
    }
  }

  return (
    <Card className="bg-white/5 border-white/10 rounded-xl mt-1">
      <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
        <div
          className={`w-full ${getAspectRatioClass()} ${height} bg-white/10 rounded-xl flex flex-col items-center justify-center p-2 sm:p-4 mb-3 sm:mb-4 ${className}`}
        >
          {imageUrl ? (
            <img src={imageUrl || "/placeholder.svg"} alt={alt} className="max-h-full object-contain rounded-lg" />
          ) : (
            <>
              <ImagePlus className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-1 sm:mb-2" />
              <p className="text-xs text-muted-foreground">{placeholderText}</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 hover:bg-white/5 rounded-xl text-xs sm:text-sm h-8 px-2 sm:px-3"
            onClick={() => {
              // For demo purposes, use a placeholder image
              onUpload(`/placeholder.svg?height=600&width=1200&query=${encodeURIComponent(alt)}`)
            }}
          >
            <ImagePlus className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
            Upload Image
          </Button>
          {imageUrl && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:bg-white/5 text-red-400 rounded-xl text-xs sm:text-sm h-8 px-2 sm:px-3"
              onClick={onRemove}
            >
              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
