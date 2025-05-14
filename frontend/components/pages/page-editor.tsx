"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  ImagePlus,
  Trash2,
  Bold,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  HelpCircle,
} from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PageEditorProps {
  seo?: boolean
}

export function PageEditor({ seo = false }: PageEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [keywords, setKeywords] = useState("")

  if (seo) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="meta-title">Page Title in Search Results</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                  <p>
                    This is the title that appears in Google search results. Keep it under 60 characters for best
                    results.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="meta-title"
            placeholder="Enter a compelling title for search results"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
          />
          <p className="text-xs text-gray-400 mt-1">{metaTitle.length}/60 characters recommended</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="meta-description">Page Description in Search Results</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                  <p>
                    This appears under the title in search results. Write a brief, engaging summary of what's on this
                    page.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id="meta-description"
            placeholder="Write a brief, engaging description of what's on this page"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[100px] rounded-xl"
          />
          <p className="text-xs text-gray-400 mt-1">{metaDescription.length}/160 characters recommended</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="keywords">Search Keywords</Label>
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
            placeholder="Example: web design, responsive, mobile-friendly"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Social Media Image</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10 max-w-xs">
                  <p>
                    This image will be shown when your page is shared on social media platforms like Facebook, Twitter,
                    and LinkedIn.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Card className="bg-white/5 border-white/10 rounded-xl">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="w-full aspect-video bg-white/10 rounded-xl flex flex-col items-center justify-center p-6 mb-4">
                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload an image for social media sharing</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
                  Upload Image
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-red-500 rounded-xl">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Page Name</Label>
        <Input
          id="title"
          placeholder="Enter your page name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">What's on this page?</Label>
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 p-2 flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <Bold className="h-4 w-4" />
              <span className="sr-only">Bold</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <Italic className="h-4 w-4" />
              <span className="sr-only">Italic</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <Heading1 className="h-4 w-4" />
              <span className="sr-only">Heading 1</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <Heading2 className="h-4 w-4" />
              <span className="sr-only">Heading 2</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <List className="h-4 w-4" />
              <span className="sr-only">Bullet List</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <ListOrdered className="h-4 w-4" />
              <span className="sr-only">Numbered List</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <LinkIcon className="h-4 w-4" />
              <span className="sr-only">Link</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs rounded-lg">
              <ImagePlus className="h-4 w-4" />
              <span className="sr-only">Image</span>
            </Button>
          </div>
          <Textarea
            id="content"
            placeholder="Start writing your page content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-transparent border-0 focus-visible:ring-0 min-h-[300px] resize-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Featured Image</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10">
                <p>This image will appear at the top of your page</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Card className="bg-white/5 border-white/10 rounded-xl">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-full aspect-video bg-white/10 rounded-xl flex flex-col items-center justify-center p-6 mb-4">
              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload a featured image for this page</p>
            </div>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
              Upload Image
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
