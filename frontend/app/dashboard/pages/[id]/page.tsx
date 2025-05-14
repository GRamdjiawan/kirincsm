"use client"

import { PageEditor } from "@/components/pages/page-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Globe } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EditPage() {
  const params = useParams()
  const isNewPage = params.id === "new"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <Link href="/dashboard/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {isNewPage ? "Create New Page" : "Edit Page"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="rounded-xl border-white/10 text-white hover:bg-white/5">
            <Eye className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            {isNewPage ? (
              <>
                <span className="sm:hidden">Publish</span>
                <span className="hidden sm:inline">Publish Page</span>
              </>
            ) : (
              <>
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-t-xl">
            <TabsTrigger value="content" className="rounded-xl">
              Page Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-xl">
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Search Engine Optimization</span>
              <span className="sm:hidden">SEO</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="p-4 md:p-6">
            <PageEditor />
          </TabsContent>
          <TabsContent value="seo" className="p-4 md:p-6">
            <PageEditor seo />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
