"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Generate mock visibility data
const generateVisibilityData = (timeRange: string) => {
  const data = []
  let days = 30
  let interval = 1
  let startDate = new Date()

  switch (timeRange) {
    case "7d":
      days = 7
      interval = 1
      startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      break
    case "30d":
      days = 30
      interval = 1
      startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      break
    case "90d":
      days = 90
      interval = 3
      startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      break
    case "6m":
      days = 180
      interval = 7
      startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      break
    case "1y":
      days = 365
      interval = 14
      startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      break
  }

  // Base values and trend factors
  const baseVisibility = 35
  const baseTop3 = 12
  const baseTop10 = 28

  // Growth factors
  const visibilityGrowth = 1.003
  const top3Growth = 1.004
  const top10Growth = 1.005

  // Generate data points
  for (let i = 0; i < days; i += interval) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    // Add some randomness and growth trend
    const dayFactor = Math.pow(i / 10, 0.5) // Non-linear growth
    const randomFactor = () => 0.9 + Math.random() * 0.2 // Random between 0.9 and 1.1

    const visibility = Math.min(
      100,
      Math.round(baseVisibility * Math.pow(visibilityGrowth, i) * randomFactor() * (1 + dayFactor / 20)),
    )
    const top3 = Math.min(100, Math.round(baseTop3 * Math.pow(top3Growth, i) * randomFactor() * (1 + dayFactor / 25)))
    const top10 = Math.min(
      100,
      Math.round(baseTop10 * Math.pow(top10Growth, i) * randomFactor() * (1 + dayFactor / 22)),
    )

    data.push({
      date: currentDate.toISOString().split("T")[0],
      visibility,
      top3,
      top10,
    })
  }

  return data
}

interface SearchVisibilityProps {
  timeRange: string
}

export function SearchVisibility({ timeRange }: SearchVisibilityProps) {
  const [metric, setMetric] = useState("visibility")
  const data = generateVisibilityData(timeRange)

  // Calculate current values and changes
  const currentData = data[data.length - 1]
  const startData = data[0]

  const visibilityChange = currentData.visibility - startData.visibility
  const top3Change = currentData.top3 - startData.top3
  const top10Change = currentData.top10 - startData.top10

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground mb-1">Visibility Score</div>
              <div className="text-2xl font-bold">{currentData.visibility}%</div>
              <div className={`text-xs ${visibilityChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {visibilityChange >= 0 ? "+" : ""}
                {visibilityChange}% from start of period
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground mb-1">Keywords in Top 3</div>
              <div className="text-2xl font-bold">{currentData.top3}%</div>
              <div className={`text-xs ${top3Change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {top3Change >= 0 ? "+" : ""}
                {top3Change}% from start of period
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground mb-1">Keywords in Top 10</div>
              <div className="text-2xl font-bold">{currentData.top10}%</div>
              <div className={`text-xs ${top10Change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {top10Change >= 0 ? "+" : ""}
                {top10Change}% from start of period
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-2">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-[180px] bg-white/5 border-white/10 rounded-xl">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-md bg-black/80 border-white/10">
            <SelectItem value="visibility">Visibility Score</SelectItem>
            <SelectItem value="top3">Keywords in Top 3</SelectItem>
            <SelectItem value="top10">Keywords in Top 10</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px] w-full">
        <ChartContainer
          config={{
            visibility: {
              label: "Visibility Score",
              color: "hsl(var(--chart-1))",
            },
            top3: {
              label: "Keywords in Top 3",
              color: "hsl(var(--chart-2))",
            },
            top10: {
              label: "Keywords in Top 10",
              color: "hsl(var(--chart-3))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVisibility" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-visibility)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-visibility)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTop3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-top3)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-top3)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTop10" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-top10)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-top10)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.5)"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return timeRange === "7d" || timeRange === "30d"
                    ? `${date.getDate()}/${date.getMonth() + 1}`
                    : `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`
                }}
              />
              <YAxis stroke="rgba(255,255,255,0.5)" domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {metric === "visibility" && (
                <Area
                  type="monotone"
                  dataKey="visibility"
                  stroke="var(--color-visibility)"
                  fillOpacity={1}
                  fill="url(#colorVisibility)"
                />
              )}
              {metric === "top3" && (
                <Area
                  type="monotone"
                  dataKey="top3"
                  stroke="var(--color-top3)"
                  fillOpacity={1}
                  fill="url(#colorTop3)"
                />
              )}
              {metric === "top10" && (
                <Area
                  type="monotone"
                  dataKey="top10"
                  stroke="var(--color-top10)"
                  fillOpacity={1}
                  fill="url(#colorTop10)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm">
        <p className="text-muted-foreground">
          <strong>Visibility Score</strong> represents the percentage of your target keywords for which your website
          appears in search results.
          <br />
          <strong>Keywords in Top 3/10</strong> shows the percentage of your target keywords for which your website
          ranks in the top 3 or top 10 positions.
        </p>
      </div>
    </div>
  )
}
