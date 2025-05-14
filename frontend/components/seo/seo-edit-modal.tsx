"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, Save, Search, Share2, Info, HelpCircle } from "lucide-react"
import { SEOPreview } from "./seo-preview"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SEOEditModalProps {
  page: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SEOEditModal({ page, open, onOpenChange }: SEOEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    meta_title: page.meta_title || "",
    meta_description: page.meta_description || "",
    keywords: page.keywords || "",
    og_image_url: page.og_image_url || "",
  })

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="backdrop-blur-xl bg-black/60 border-white/10 rounded-xl max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit SEO Settings</DialogTitle>
          <DialogDescription>Optimize how {page.title} appears in search engines and social media</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl">
            <TabsTrigger value="search" className="rounded-xl">
              <Search className="h-4 w-4 mr-2" />
              Search Engine Optimization
            </TabsTrigger>
            <TabsTrigger value="social" className="rounded-xl">
              <Share2 className="h-4 w-4 mr-2" />
              Social Media
            </TabsTrigger>
          </TabsList>

          {/* Search Engine Tab */}
          <TabsContent value="search" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                          <p>
                            The title that appears in search engine results. Keep it under 60 characters for best
                            results.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="Enter a compelling title for search results"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  />
                  <p className="text-xs text-gray-400 mt-1">{formData.meta_title.length}/60 characters recommended</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                          <p>
                            A brief summary of the page content that appears under the title in search results. Keep it
                            under 160 characters.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="Write a brief, engaging description of what's on this page"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[100px] rounded-xl"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.meta_description.length}/160 characters recommended
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                          <p>Words or phrases that people might use to find your page. Separate them with commas.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    placeholder="Example: web design, responsive, mobile-friendly"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Search Engine Preview</Label>
                <SEOPreview
                  type="search"
                  title={formData.meta_title || page.title}
                  description={formData.meta_description}
                  url={page.url}
                />

                <Card className="bg-white/5 border-white/10 p-4 rounded-xl mt-6">
                  <CardContent className="p-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-neon-blue" />
                      <h4 className="text-sm font-medium">SEO Best Practices</h4>
                    </div>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc pl-5">
                      <li>Include your main keyword in the title and description</li>
                      <li>Keep titles under 60 characters to avoid truncation</li>
                      <li>Make descriptions compelling and under 160 characters</li>
                      <li>Use unique titles and descriptions for each page</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="og_title">Social Media Title</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                          <p>
                            The title that appears when your page is shared on social media. Defaults to Meta Title if
                            left empty.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="og_title"
                    name="og_title"
                    defaultValue={formData.meta_title}
                    placeholder="Enter a title for social media sharing"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="og_description">Social Media Description</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                          <p>
                            The description that appears when your page is shared on social media. Defaults to Meta
                            Description if left empty.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="og_description"
                    name="og_description"
                    defaultValue={formData.meta_description}
                    placeholder="Write a description for social media sharing"
                    className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[100px] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="og_image_url">Social Media Image URL</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                          <p>
                            The image that appears when your page is shared on social media. Recommended size is 1200 x
                            630 pixels.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="og_image_url"
                      name="og_image_url"
                      value={formData.og_image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
                    />
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
                      <ImagePlus className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Social Media Preview</Label>
                <SEOPreview
                  type="social"
                  title={formData.meta_title || page.title}
                  description={formData.meta_description}
                  url={page.url}
                  imageUrl={formData.og_image_url}
                />

                <Card className="bg-white/5 border-white/10 p-4 rounded-xl mt-6">
                  <CardContent className="p-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-neon-blue" />
                      <h4 className="text-sm font-medium">Social Media Best Practices</h4>
                    </div>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc pl-5">
                      <li>Use high-quality images with a 1.91:1 aspect ratio (1200 x 630px)</li>
                      <li>Keep titles under 70 characters for optimal display</li>
                      <li>Make descriptions compelling and under 200 characters</li>
                      <li>Test your shares on different platforms to ensure proper display</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 hover:bg-white/5">
            Cancel
          </Button>
          <LoadingButton
            isLoading={isLoading}
            loadingText="Saving..."
            onClick={handleSave}
            className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save SEO Settings
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
