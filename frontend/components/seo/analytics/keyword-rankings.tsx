"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUp, ArrowDown, Minus } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

// Generate mock keyword data
const generateKeywordData = (timeRange: string) => {
  const keywords = [
    { keyword: "digital cms platform", volume: 2400, difficulty: "medium" },
    { keyword: "best cms for websites", volume: 5800, difficulty: "high" },
    { keyword: "headless cms solution", volume: 1900, difficulty: "medium" },
    { keyword: "website content management", volume: 8500, difficulty: "high" },
    { keyword: "cms for small business", volume: 3200, difficulty: "low" },
    { keyword: "enterprise cms software", volume: 1500, difficulty: "high" },
    { keyword: "cms with seo features", volume: 2100, difficulty: "medium" },
    { keyword: "free cms platform", volume: 12000, difficulty: "high" },
    { keyword: "cms for ecommerce", volume: 6700, difficulty: "medium" },
    { keyword: "custom cms development", volume: 1100, difficulty: "low" },
  ]

  // Generate position history based on time range
  const days =
    timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : timeRange === "90d" ? 90 : timeRange === "6m" ? 180 : 365

  return keywords.map((keyword) => {
    // Generate a starting position between 5 and 30
    const startPosition = Math.floor(Math.random() * 25) + 5

    // Generate position history with some randomness and a general improvement trend
    const positionHistory = []
    let currentPosition = startPosition

    for (let i = 0; i < days; i++) {
      // Add some randomness but with a slight improvement trend
      const change =
        Math.random() > 0.6
          ? -Math.random() * 2 // Improvement (negative is better for position)
          : Math.random() * 1.5 // Decline

      currentPosition = Math.max(1, currentPosition + change)
      positionHistory.push({ day: i, position: Math.round(currentPosition * 10) / 10 })
    }

    // Calculate change from first to last position
    const change = positionHistory[0].position - positionHistory[positionHistory.length - 1].position

    return {
      ...keyword,
      position: Math.round(positionHistory[positionHistory.length - 1].position),
      change: Math.round(change * 10) / 10,
      positionHistory,
    }
  })
}

interface KeywordRankingsProps {
  timeRange: string
}

export function KeywordRankings({ timeRange }: KeywordRankingsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const keywords = generateKeywordData(timeRange)

  const filteredKeywords = keywords.filter((keyword) =>
    keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "low":
        return "border-green-500/50 text-green-400 bg-green-500/10"
      case "medium":
        return "border-amber-500/50 text-amber-400 bg-amber-500/10"
      case "high":
        return "border-red-500/50 text-red-400 bg-red-500/10"
      default:
        return "border-gray-500/50 text-gray-400 bg-gray-500/10"
    }
  }

  const getPositionChangeElement = (change: number) => {
    if (change > 0) {
      return (
        <div className="flex items-center text-green-400">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>+{change}</span>
        </div>
      )
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-400">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span>{change}</span>
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-gray-400">
          <Minus className="h-4 w-4 mr-1" />
          <span>0</span>
        </div>
      )
    }
  }

  // Custom tooltip for the mini chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2 text-xs">
          <p>Position: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 focus-visible:ring-neon-blue rounded-xl"
        />
      </div>

      <div className="rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-white/5">
              <TableHead>Keyword</TableHead>
              <TableHead>Search Volume</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Change</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeywords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No keywords found. Try adjusting your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredKeywords.map((keyword, index) => (
                <TableRow key={index} className="hover:bg-white/5 border-white/5">
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>{keyword.volume.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDifficultyColor(keyword.difficulty)}>
                      {keyword.difficulty.charAt(0).toUpperCase() + keyword.difficulty.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{keyword.position}</TableCell>
                  <TableCell>{getPositionChangeElement(keyword.change)}</TableCell>
                  <TableCell>
                    <div className="h-10 w-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={keyword.positionHistory}>
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="position"
                            stroke={keyword.change > 0 ? "#4ade80" : keyword.change < 0 ? "#f87171" : "#9ca3af"}
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl">
          Load More Keywords
        </Button>
      </div>
    </div>
  )
}
