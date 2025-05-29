"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Video } from "lucide-react"
import { useSectionContext } from "../section-context"
import type { HeroContent } from "../section-types"
import { ImageUploader } from "../image-uploader"

export function HeroEditor() {
  const { selectedSection, updateSectionContent } = useSectionContext()

  if (!selectedSection || selectedSection.type !== "HERO") return null

  const content = selectedSection.content as HeroContent

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="hero-title" className="text-sm">
          Section Title
        </Label>
        <Input
          id="hero-title"
          value={content.title}
          onChange={(e) => updateSectionContent("title", e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
          placeholder="Enter a title for this hero section"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="hero-headline" className="text-sm">
              Headline
            </Label>
            <Input
              id="hero-headline"
              value={content.headline}
              onChange={(e) => updateSectionContent("headline", e.target.value)}
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
              placeholder="Enter a headline for the hero section"
            />
          </div>

          <div>
            <Label htmlFor="hero-subtext" className="text-sm">
              Descriptive Text
            </Label>
            <Textarea
              id="hero-subtext"
              value={content.subtext}
              onChange={(e) => updateSectionContent("subtext", e.target.value)}
              className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[80px] sm:min-h-[100px] rounded-xl mt-1"
              placeholder="Enter descriptive text for the hero section"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="hero-button-text" className="text-sm">
                Button Text
              </Label>
              <Input
                id="hero-button-text"
                value={content.buttonText}
                onChange={(e) => updateSectionContent("buttonText", e.target.value)}
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                placeholder="e.g., Get Started"
              />
            </div>
            <div>
              <Label htmlFor="hero-button-url" className="text-sm">
                Button URL
              </Label>
              <Input
                id="hero-button-url"
                value={content.buttonUrl}
                onChange={(e) => updateSectionContent("buttonUrl", e.target.value)}
                className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl mt-1"
                placeholder="e.g., /contact"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm mb-1 block">Button Style</Label>
            <RadioGroup
              value={content.buttonStyle}
              onValueChange={(value) => updateSectionContent("buttonStyle", value as HeroContent["buttonStyle"])}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="primary" id="button-primary" />
                <Label htmlFor="button-primary" className="text-xs cursor-pointer">
                  Primary
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="secondary" id="button-secondary" />
                <Label htmlFor="button-secondary" className="text-xs cursor-pointer">
                  Secondary
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="outline" id="button-outline" />
                <Label htmlFor="button-outline" className="text-xs cursor-pointer">
                  Outline
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="gradient" id="button-gradient" />
                <Label htmlFor="button-gradient" className="text-xs cursor-pointer">
                  Gradient
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm mb-1 block">Text Alignment</Label>
            <RadioGroup
              value={content.textAlignment}
              onValueChange={(value) => updateSectionContent("textAlignment", value as HeroContent["textAlignment"])}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="left" id="align-left" />
                <Label htmlFor="align-left" className="text-xs cursor-pointer">
                  Left
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="center" id="align-center" />
                <Label htmlFor="align-center" className="text-xs cursor-pointer">
                  Center
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="right" id="align-right" />
                <Label htmlFor="align-right" className="text-xs cursor-pointer">
                  Right
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="full-height"
              checked={content.fullHeight}
              onChange={(e) => updateSectionContent("fullHeight", e.target.checked)}
              className="rounded border-white/10 bg-white/5 text-neon-blue focus:ring-neon-blue"
            />
            <Label htmlFor="full-height" className="text-sm cursor-pointer">
              Full Height Hero
            </Label>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <Label className="text-sm mb-1 block">Background Type</Label>
            <RadioGroup
              value={content.backgroundType}
              onValueChange={(value) => updateSectionContent("backgroundType", value as HeroContent["backgroundType"])}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="image" id="bg-image" />
                <Label htmlFor="bg-image" className="text-xs cursor-pointer">
                  Image
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <RadioGroupItem value="video" id="bg-video" />
                <Label htmlFor="bg-video" className="text-xs cursor-pointer">
                  Video
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm">
              {content.backgroundType === "image" ? "Background Image" : "Background Video"}
            </Label>
            {content.backgroundType === "image" ? (
              <ImageUploader
                imageUrl={content.backgroundUrl}
                alt="Hero background"
                onUpload={(url) => updateSectionContent("backgroundUrl", url)}
                onRemove={() => updateSectionContent("backgroundUrl", "")}
                placeholderText="Upload an image for the hero background"
              />
            ) : (
              <div className="mt-1">
                <Input
                  value={content.backgroundUrl}
                  onChange={(e) => updateSectionContent("backgroundUrl", e.target.value)}
                  className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
                  startIcon={<Video className="h-4 w-4" />}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="overlay-opacity" className="text-sm">
              Overlay Opacity: {content.overlayOpacity}%
            </Label>
            <input
              id="overlay-opacity"
              type="range"
              min="0"
              max="100"
              value={content.overlayOpacity}
              onChange={(e) => updateSectionContent("overlayOpacity", Number.parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0% (Transparent)</span>
              <span>100% (Opaque)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
