"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SEOMetricsOverview } from "@/components/seo/analytics/seo-metrics-overview"
import { SEOTrafficChart } from "@/components/seo/analytics/seo-traffic-chart"
import { KeywordRankings } from "@/components/seo/analytics/keyword-rankings"
import { PagePerformance } from "@/components/seo/analytics/page-performance"
import { SearchVisibility } from "@/components/seo/analytics/search-visibility"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"

export default function SEOAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">SEO Analytics</h1>
          <p className="text-muted-foreground">Track and analyze your website's search engine performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] md:w-[180px] bg-white/5 border-white/10 rounded-xl">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      <SEOMetricsOverview timeRange={timeRange} />

      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5 rounded-xl">
          <TabsTrigger value="traffic" className="rounded-xl">
            Traffic
          </TabsTrigger>
          <TabsTrigger value="keywords" className="rounded-xl">
            Keywords
          </TabsTrigger>
          <TabsTrigger value="pages" className="rounded-xl">
            Pages
          </TabsTrigger>
          <TabsTrigger value="visibility" className="rounded-xl">
            Visibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6 py-4">
          <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle>Organic Traffic</CardTitle>
              <CardDescription>Track visitors coming from search engines over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SEOTrafficChart timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6 py-4">
          <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>Monitor your positions for target keywords</CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordRankings timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6 py-4">
          <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle>Page Performance</CardTitle>
              <CardDescription>Analyze which pages are performing best in search</CardDescription>
            </CardHeader>
            <CardContent>
              <PagePerformance timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visibility" className="space-y-6 py-4">
          <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle>Search Visibility</CardTitle>
              <CardDescription>Track your overall visibility in search engines</CardDescription>
            </CardHeader>
            <CardContent>
              <SearchVisibility timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
