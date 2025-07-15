"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

type Page = {
  id: string
  title: string
  hierarchy: number
  sections: number
  status: "published"
}

export function PagesList() {
  const [pages, setPages] = useState<Page[]>([])

  useEffect(() => {
    fetch("https://api.nebula-cms.nl/api/pages", { credentials: "include" })
      .then(res => res.json())
      .then(data => setPages(data))
  }, [])

  return (
    <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-white/5 pb-4">
        <CardTitle className="text-xl font-semibold">Pages</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 gap-0 divide-y divide-white/10">
          {pages.map((page) => (
            <div
              key={page.id}
              className="p-4 hover:bg-white/5 cursor-pointer transition-colors duration-200 flex items-center"
              onClick={() => (window.location.href = `/dashboard/pages/${page.id}`)}
            >
              <div className="h-10 w-10 rounded-md bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                <FileText className="h-5 w-5 text-white/70" />
              </div>

              <div className="flex-grow">
                <h3 className="font-medium text-white">{page.title}</h3>
                <p className="text-sm text-white/60 mt-0.5">
                  {page.sections} {page.sections === 1 ? "section" : "sections"}
                </p>
              </div>

              <div className="ml-4 flex-shrink-0">
                <Badge
                  variant="outline"
                  className={
                      "border-green-500/50 text-green-400 bg-green-500/10"
                  }
                >
                  Published
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
