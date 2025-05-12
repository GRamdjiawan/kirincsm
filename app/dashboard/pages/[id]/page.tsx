"use client"

import { PageEditor } from "@/components/pages/page-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EditPage() {
  const params = useParams()
  const isNewPage = params.id === "new"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{isNewPage ? "Create New Page" : "Edit Page"}</h1>
        </div>
        <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-t-lg">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="p-6">
            <PageEditor />
          </TabsContent>
          <TabsContent value="seo" className="p-6">
            <PageEditor seo />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
