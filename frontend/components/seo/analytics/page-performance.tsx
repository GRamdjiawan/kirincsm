"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Generate mock page performance data
const generatePageData = () => {
  const pages = [
    { title: "Homepage", url: "/", impressions: 12500, clicks: 2300, ctr: 18.4, avgPosition: 3.2 },
    { title: "About Us", url: "/about", impressions: 5800, clicks: 780, ctr: 13.4, avgPosition: 5.7 },
    { title: "Services", url: "/services", impressions: 7200, clicks: 950, ctr: 13.2, avgPosition: 4.8 },
    { title: "Blog", url: "/blog", impressions: 9500, clicks: 1850, ctr: 19.5, avgPosition: 2.9 },
    { title: "Contact", url: "/contact", impressions: 3200, clicks: 420, ctr: 13.1, avgPosition: 6.3 },
    { title: "Pricing", url: "/pricing", impressions: 4100, clicks: 680, ctr: 16.6, avgPosition: 4.1 },
    { title: "Features", url: "/features", impressions: 6300, clicks: 890, ctr: 14.1, avgPosition: 5.2 },
    { title: "Case Studies", url: "/case-studies", impressions: 3800, clicks: 520, ctr: 13.7, avgPosition: 7.4 },
    { title: "Resources", url: "/resources", impressions: 2900, clicks: 380, ctr: 13.1, avgPosition: 8.2 },
    { title: "FAQ", url: "/faq", impressions: 4500, clicks: 720, ctr: 16.0, avgPosition: 3.8 },
  ]

  // Add change data
  return pages.map((page) => {
    const clicksChange = Math.random() * 30 - 10 // Between -10% and +20%
    const impressionsChange = Math.random() * 40 - 15 // Between -15% and +25%
    const positionChange = Math.random() * 3 - 1.5 // Between -1.5 and +1.5

    return {
      ...page,
      clicksChange: Math.round(clicksChange * 10) / 10,
      impressionsChange: Math.round(impressionsChange * 10) / 10,
      positionChange: Math.round(positionChange * 10) / 10,
    }
  })
}

interface PagePerformanceProps {
  timeRange: string
}

export function PagePerformance({ timeRange }: PagePerformanceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pages = generatePageData()

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-white/5">
              <TableHead>Page</TableHead>
              <TableHead>Impressions</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>CTR</TableHead>
              <TableHead>Avg. Position</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No pages found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPages.map((page, index) => (
                <TableRow key={index} className="hover:bg-white/5 border-white/5">
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="font-medium">{page.title}</div>
                      <div className="text-xs text-muted-foreground">{page.url}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div>{page.impressions.toLocaleString()}</div>
                      <div className="flex items-center text-xs">
                        {page.impressionsChange > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        <span className={page.impressionsChange > 0 ? "text-green-400" : "text-red-400"}>
                          {page.impressionsChange > 0 ? "+" : ""}
                          {page.impressionsChange}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div>{page.clicks.toLocaleString()}</div>
                      <div className="flex items-center text-xs">
                        {page.clicksChange > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        <span className={page.clicksChange > 0 ? "text-green-400" : "text-red-400"}>
                          {page.clicksChange > 0 ? "+" : ""}
                          {page.clicksChange}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div>{page.ctr}%</div>
                      <Progress value={page.ctr} className="h-1 w-16 bg-white/10" indicatorClassName="bg-neon-blue" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div>{page.avgPosition}</div>
                      <div className="flex items-center text-xs">
                        {page.positionChange < 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        <span className={page.positionChange < 0 ? "text-green-400" : "text-red-400"}>
                          {page.positionChange < 0 ? "" : "+"}
                          {page.positionChange}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" asChild>
                      <a href={`https://example.com${page.url}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View Page</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
          Load More Pages
        </Button>
      </div>
    </div>
  )
}
