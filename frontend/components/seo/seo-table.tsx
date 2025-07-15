"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SEOTableProps {
  pages: any[]
  onEditSEO: (page: any) => void
}

export function SEOTable({ pages, onEditSEO }: SEOTableProps) {
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "optimized":
        return "border-green-500/50 text-green-400 bg-green-500/10"
      case "needs-review":
        return "border-amber-500/50 text-amber-400 bg-amber-500/10"
      case "not-optimized":
        return "border-red-500/50 text-red-400 bg-red-500/10"
      default:
        return "border-gray-500/50 text-gray-400 bg-gray-500/10"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "optimized":
        return "Optimized"
      case "needs-review":
        return "Needs Review"
      case "not-optimized":
        return "Not Optimized"
      default:
        return status
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-white/5">
              <TableHead>Page</TableHead>
              <TableHead className="hidden sm:table-cell">Meta Title</TableHead>
              <TableHead className="hidden md:table-cell">Meta Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No pages found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id} className="hover:bg-white/5 border-white/5">
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                        {page.url}
                      </div>
                      <div className="sm:hidden mt-1">
                        <Badge variant="outline" className={getStatusBadgeStyles(page.status)}>
                          {getStatusLabel(page.status)}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm truncate max-w-[150px] md:max-w-[200px]">
                      {truncateText(page.meta_title, 40) || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="text-sm truncate max-w-[150px] lg:max-w-[200px]">
                      {truncateText(page.meta_description, 60) || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className={getStatusBadgeStyles(page.status)}>
                      {getStatusLabel(page.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => onEditSEO(page)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit SEO</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" asChild>
                        <a href={page.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Page</span>
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
