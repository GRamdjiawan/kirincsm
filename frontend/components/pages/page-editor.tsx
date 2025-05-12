"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ImagePlus, Trash2 } from "lucide-react"
import { useState } from "react"

interface PageEditorProps {
  seo?: boolean
}

export function PageEditor({ seo = false }: PageEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [keywords, setKeywords] = useState("")
  const [slug, setSlug] = useState("")

  if (seo) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="meta-title">Meta Title</Label>
          <Input
            id="meta-title"
            placeholder="Meta Title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-description">Meta Description</Label>
          <Textarea
            id="meta-description"
            placeholder="Meta Description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Input
            id="keywords"
            placeholder="Keywords (comma separated)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            placeholder="url-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="bg-white/5 border-white/10 focus-visible:ring-neon-blue"
          />
        </div>

        <div className="space-y-2">
          <Label>OG Image</Label>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className="w-full aspect-video bg-white/10 rounded-lg flex flex-col items-center justify-center p-6 mb-4">
                <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload an image for social media sharing</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-white/10 hover:bg-white/5">
                  Upload Image
                </Button>
                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-red-500">
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-neon-blue"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 p-2 flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Bold
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Italic
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Link
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Image
            </Button>
          </div>
          <Textarea
            id="content"
            placeholder="Page content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-transparent border-0 focus-visible:ring-0 min-h-[300px] resize-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Featured Image</Label>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-full aspect-video bg-white/10 rounded-lg flex flex-col items-center justify-center p-6 mb-4">
              <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Upload a featured image for this page</p>
            </div>
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Upload Image
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
