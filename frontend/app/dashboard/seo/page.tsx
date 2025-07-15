"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { SEOTable } from "@/components/seo/seo-table"
import { SEOEditModal } from "@/components/seo/seo-edit-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock SEO data
import { pages } from "@/components/seo/mock-data"

export default function SEOPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState<any>(null)

  // Filter pages based on search query and status filter
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      searchQuery === "" ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === null || page.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleEditSEO = (page: any) => {
    setSelectedPage(page)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SEO Management</h1>
        <p className="text-muted-foreground">Optimize your website for search engines and social media</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl whitespace-nowrap">
              <Filter className="mr-2 h-4 w-4" />
              {filterStatus || "All Pages"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border-white/10">
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>All Pages</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("optimized")}>Optimized</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("needs-review")}>Needs Review</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("not-optimized")}>Not Optimized</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <SEOTable pages={filteredPages} onEditSEO={handleEditSEO} />

      {isEditModalOpen && selectedPage && (
        <SEOEditModal page={selectedPage} open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
      )}
    </div>
  )
}
