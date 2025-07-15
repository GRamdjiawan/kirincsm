"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import { useSectionContext } from "../section-context"
import type { CarouselContent } from "../section-types"
import { ImageUploader } from "../image-uploader"
import { useState } from "react"

export function CarouselEditor() {
  const { selectedSection, updateSectionContent, activeCarouselSlide, setActiveCarouselSlide } = useSectionContext()
  const [localActiveSlide, setLocalActiveSlide] = useState(activeCarouselSlide)

  if (!selectedSection || selectedSection.type !== "CAROUSEL") return null

  const content = selectedSection.content as CarouselContent

  // Carousel-specific functions
  const addCarouselSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: "",
      caption: `Slide ${content.slides.length + 1}`,
      subtitle: `Subtitle for slide ${content.slides.length + 1}`,
    }

    const updatedSlides = [...content.slides, newSlide]
    updateSectionContent("slides", updatedSlides)
    setLocalActiveSlide(updatedSlides.length - 1) // Set active slide to the new one
    setActiveCarouselSlide(updatedSlides.length - 1)
  }

  const updateCarouselSlide = (index: number, field: keyof CarouselContent["slides"][0], value: string) => {
    const updatedSlides = [...content.slides]
    updatedSlides[index] = {
      ...updatedSlides[index],
      [field]: value,
    }

    updateSectionContent("slides", updatedSlides)
  }

  const deleteCarouselSlide = (index: number) => {
    if (content.slides.length <= 1) return // Don't delete the last slide

    const updatedSlides = content.slides.filter((_, i) => i !== index)
    updateSectionContent("slides", updatedSlides)

    // Adjust active slide if needed
    if (localActiveSlide >= updatedSlides.length) {
      const newActiveSlide = Math.max(0, updatedSlides.length - 1)
      setLocalActiveSlide(newActiveSlide)
      setActiveCarouselSlide(newActiveSlide)
    }
  }

  const handleTabChange = (value: string) => {
    const index = Number.parseInt(value, 10)
    setLocalActiveSlide(index)
    setActiveCarouselSlide(index)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="carousel-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="carousel-title"
          value={content.title}
          onChange={(e) => updateSectionContent("title", e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this carousel"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="carousel-autoplay" className="text-sm flex items-center space-x-2">
            <input
              type="checkbox"
              id="carousel-autoplay"
              checked={content.autoplay}
              onChange={(e) => updateSectionContent("autoplay", e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-neon-blue focus:ring-neon-blue"
            />
            <span>Enable Autoplay</span>
          </Label>
        </div>

        <div>
          <Label htmlFor="carousel-interval" className="text-sm">
            Autoplay Interval (ms)
          </Label>
          <Input
            id="carousel-interval"
            type="number"
            min={1000}
            step={1000}
            value={content.interval}
            onChange={(e) => updateSectionContent("interval", Number(e.target.value))}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            placeholder="15000"
            disabled={!content.autoplay}
          />
        </div>

        <div>
          <Label htmlFor="carousel-arrows" className="text-sm flex items-center space-x-2">
            <input
              type="checkbox"
              id="carousel-arrows"
              checked={content.showArrows}
              onChange={(e) => updateSectionContent("showArrows", e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-neon-blue focus:ring-neon-blue"
            />
            <span>Show Navigation Arrows</span>
          </Label>
        </div>

        <div>
          <Label htmlFor="carousel-dots" className="text-sm flex items-center space-x-2">
            <input
              type="checkbox"
              id="carousel-dots"
              checked={content.showDots}
              onChange={(e) => updateSectionContent("showDots", e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-neon-blue focus:ring-neon-blue"
            />
            <span>Show Navigation Dots</span>
          </Label>
        </div>

        <div>
          <Label htmlFor="carousel-animation" className="text-sm">
            Animation Type
          </Label>
          <Select
            value={content.animation}
            onValueChange={(value) => updateSectionContent("animation", value as "slide" | "fade")}
          >
            <SelectTrigger
              id="carousel-animation"
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            >
              <SelectValue placeholder="Select animation type" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
              <SelectItem value="slide">Slide</SelectItem>
              <SelectItem value="fade">Fade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="carousel-click-action" className="text-sm">
            Click Action
          </Label>
          <Select
            value={content.clickAction}
            onValueChange={(value) => updateSectionContent("clickAction", value as "none" | "link" | "modal")}
          >
            <SelectTrigger
              id="carousel-click-action"
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            >
              <SelectValue placeholder="Select click action" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="link">Link to URL</SelectItem>
              <SelectItem value="modal">Open Modal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="carousel-height" className="text-sm">
            Carousel Height
          </Label>
          <Select
            value={content.height}
            onValueChange={(value) => updateSectionContent("height", value as "small" | "medium" | "large")}
          >
            <SelectTrigger
              id="carousel-height"
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            >
              <SelectValue placeholder="Select height" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="carousel-caption-style" className="text-sm">
            Caption Style
          </Label>
          <Select
            value={content.captionStyle}
            onValueChange={(value) => updateSectionContent("captionStyle", value as "overlay" | "below" | "white-box")}
          >
            <SelectTrigger
              id="carousel-caption-style"
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
            >
              <SelectValue placeholder="Select caption style" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
              <SelectItem value="overlay">Overlay on Image</SelectItem>
              <SelectItem value="below">Below Image</SelectItem>
              <SelectItem value="white-box">White Box</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Slides</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addCarouselSlide}
            className="h-8 px-2 text-xs rounded-lg border-white/10 hover:bg-white/5"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Slide
          </Button>
        </div>

        <Tabs value={localActiveSlide.toString()} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-white/5 rounded-xl mb-3 sm:mb-4 overflow-x-auto flex-nowrap w-full">
            {content.slides.map((_, index) => (
              <TabsTrigger key={index} value={index.toString()} className="rounded-lg flex-shrink-0 text-xs sm:text-sm">
                Slide {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {content.slides.map((slide, index) => (
            <TabsContent key={index} value={index.toString()} className="space-y-3 sm:space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteCarouselSlide(index)}
                  className="h-7 sm:h-8 px-2 text-xs rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  disabled={content.slides.length <= 1}
                >
                  <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-1.5" />
                  Delete Slide
                </Button>
              </div>

              <div>
                <Label htmlFor={`slide-caption-${index}`} className="text-sm">
                  Slide Title
                </Label>
                <Input
                  id={`slide-caption-${index}`}
                  value={slide.caption}
                  onChange={(e) => updateCarouselSlide(index, "caption", e.target.value)}
                  className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                  placeholder="Enter a title for this slide"
                />
              </div>

              <div>
                <Label htmlFor={`slide-subtitle-${index}`} className="text-sm">
                  Slide Subtitle
                </Label>
                <Input
                  id={`slide-subtitle-${index}`}
                  value={slide.subtitle || ""}
                  onChange={(e) => updateCarouselSlide(index, "subtitle", e.target.value)}
                  className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                  placeholder="Enter a subtitle for this slide"
                />
              </div>

              {content.clickAction === "link" && (
                <div>
                  <Label htmlFor={`slide-url-${index}`} className="text-sm">
                    Slide URL
                  </Label>
                  <Input
                    id={`slide-url-${index}`}
                    value={slide.url || ""}
                    onChange={(e) => updateCarouselSlide(index, "url", e.target.value)}
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                    placeholder="Enter a URL for this slide"
                  />
                </div>
              )}

              <div>
                <Label className="text-sm">Slide Image</Label>
                <ImageUploader
                  imageUrl={slide.imageUrl}
                  alt={slide.caption}
                  onUpload={(url) => updateCarouselSlide(index, "imageUrl", url)}
                  onRemove={() => updateCarouselSlide(index, "imageUrl", "")}
                  placeholderText="Upload an image for this slide"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
