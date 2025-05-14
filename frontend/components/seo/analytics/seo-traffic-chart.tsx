"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

// Generate mock data for different time ranges
const generateTrafficData = (timeRange: string) => {
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
  const baseOrganic = 150
  const baseDirect = 100
  const baseSocial = 50
  const baseReferral = 30

  // Growth factors
  const organicGrowth = 1.005
  const directGrowth = 1.002
  const socialGrowth = 1.003
  const referralGrowth = 1.001

  // Generate data points
  for (let i = 0; i < days; i += interval) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    // Add some randomness and growth trend
    const dayFactor = Math.pow(i / 10, 0.5) // Non-linear growth
    const randomFactor = () => 0.8 + Math.random() * 0.4 // Random between 0.8 and 1.2

    const organic = Math.round(baseOrganic * Math.pow(organicGrowth, i) * randomFactor() * (1 + dayFactor / 10))
    const direct = Math.round(baseDirect * Math.pow(directGrowth, i) * randomFactor())
    const social = Math.round(baseSocial * Math.pow(socialGrowth, i) * randomFactor())
    const referral = Math.round(baseReferral * Math.pow(referralGrowth, i) * randomFactor())

    data.push({
      date: currentDate.toISOString().split("T")[0],
      organic,
      direct,
      social,
      referral,
      total: organic + direct + social + referral,
    })
  }

  return data
}

interface SEOTrafficChartProps {
  timeRange: string
}

export function SEOTrafficChart({ timeRange }: SEOTrafficChartProps) {
  const [showChannels, setShowChannels] = useState({
    organic: true,
    direct: false,
    social: false,
    referral: false,
    total: true,
  })

  const data = generateTrafficData(timeRange)

  const toggleChannel = (channel: keyof typeof showChannels) => {
    setShowChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant={showChannels.organic ? "default" : "outline"}
          className={showChannels.organic ? "bg-neon-blue hover:bg-neon-blue/90" : "border-white/10 hover:bg-white/5"}
          onClick={() => toggleChannel("organic")}
        >
          Organic
        </Button>
        <Button
          size="sm"
          variant={showChannels.direct ? "default" : "outline"}
          className={
            showChannels.direct ? "bg-neon-purple hover:bg-neon-purple/90" : "border-white/10 hover:bg-white/5"
          }
          onClick={() => toggleChannel("direct")}
        >
          Direct
        </Button>
        <Button
          size="sm"
          variant={showChannels.social ? "default" : "outline"}
          className={showChannels.social ? "bg-green-500 hover:bg-green-500/90" : "border-white/10 hover:bg-white/5"}
          onClick={() => toggleChannel("social")}
        >
          Social
        </Button>
        <Button
          size="sm"
          variant={showChannels.referral ? "default" : "outline"}
          className={showChannels.referral ? "bg-amber-500 hover:bg-amber-500/90" : "border-white/10 hover:bg-white/5"}
          onClick={() => toggleChannel("referral")}
        >
          Referral
        </Button>
        <Button
          size="sm"
          variant={showChannels.total ? "default" : "outline"}
          className={showChannels.total ? "bg-gray-500 hover:bg-gray-500/90" : "border-white/10 hover:bg-white/5"}
          onClick={() => toggleChannel("total")}
        >
          Total
        </Button>
      </div>

      <div className="h-[300px] sm:h-[400px] w-full">
        <ChartContainer
          config={{
            organic: {
              label: "Organic",
              color: "hsl(var(--chart-1))",
            },
            direct: {
              label: "Direct",
              color: "hsl(var(--chart-2))",
            },
            social: {
              label: "Social",
              color: "hsl(var(--chart-3))",
            },
            referral: {
              label: "Referral",
              color: "hsl(var(--chart-4))",
            },
            total: {
              label: "Total",
              color: "hsl(var(--chart-5))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {showChannels.organic && (
                <Line
                  type="monotone"
                  dataKey="organic"
                  stroke="var(--color-organic)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
              {showChannels.direct && (
                <Line
                  type="monotone"
                  dataKey="direct"
                  stroke="var(--color-direct)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
              {showChannels.social && (
                <Line
                  type="monotone"
                  dataKey="social"
                  stroke="var(--color-social)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
              {showChannels.referral && (
                <Line
                  type="monotone"
                  dataKey="referral"
                  stroke="var(--color-referral)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
              {showChannels.total && (
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
