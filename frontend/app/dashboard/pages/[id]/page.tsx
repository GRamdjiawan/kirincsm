"use client"

import { PageEditor } from "@/components/pages/page-editor"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MediaProvider } from "@/components/media/media-context"

export default function EditPage() {
  const params = useParams()
  const isNewPage = params.id === "new"

  return (
    <MediaProvider>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild className="rounded-full shrink-0">
              <Link href="/dashboard/pages">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
              {isNewPage ? "Create New Page" : "Edit Page"}
            </h1>
          </div>
          <div className="flex space-x-2 self-end sm:self-auto">
            {/* <Button
              variant="outline"
              className="rounded-xl border-white/10 text-white hover:bg-white/5 h-9 px-3 sm:h-10 sm:px-4"
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </Button> */}
            <Button className="bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/90 hover:to-neon-purple/90 text-white rounded-xl h-9 px-3 sm:h-10 sm:px-4">
              <Save className="h-4 w-4 sm:mr-2" />
                <>
                  <span className="sm:hidden">Save</span>
                  <span className="hidden sm:inline">Save Changes</span>
                </>
            </Button>
          </div>
        </div>

        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <PageEditor />
          </div>
        </Card>
      </div>
    </MediaProvider>
  )
}
