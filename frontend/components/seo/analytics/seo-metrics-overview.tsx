"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, MousePointerClick, Eye } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

// Mock data for different time ranges
const getMetricsData = (timeRange: string) => {
  const baseData = {
    "7d": {
      organicTraffic: 1250,
      organicTrafficChange: 8.5,
      clickThroughRate: 3.8,
      clickThroughRateChange: 0.5,
      averagePosition: 12.3,
      averagePositionChange: -1.2,
      impressions: 32500,
      impressionsChange: 12.3,
    },
    "30d": {
      organicTraffic: 5430,
      organicTrafficChange: 15.2,
      clickThroughRate: 4.2,
      clickThroughRateChange: 0.8,
      averagePosition: 10.8,
      averagePositionChange: -2.5,
      impressions: 128000,
      impressionsChange: 18.7,
    },
    "90d": {
      organicTraffic: 15800,
      organicTrafficChange: 22.5,
      clickThroughRate: 4.5,
      clickThroughRateChange: 1.2,
      averagePosition: 9.5,
      averagePositionChange: -3.8,
      impressions: 350000,
      impressionsChange: 25.4,
    },
    "6m": {
      organicTraffic: 32400,
      organicTrafficChange: 35.8,
      clickThroughRate: 4.8,
      clickThroughRateChange: 1.5,
      averagePosition: 8.2,
      averagePositionChange: -5.3,
      impressions: 675000,
      impressionsChange: 42.1,
    },
    "1y": {
      organicTraffic: 68500,
      organicTrafficChange: 65.3,
      clickThroughRate: 5.2,
      clickThroughRateChange: 2.1,
      averagePosition: 6.5,
      averagePositionChange: -8.7,
      impressions: 1320000,
      impressionsChange: 78.5,
    },
  }

  return baseData[timeRange as keyof typeof baseData] || baseData["30d"]
}

interface SEOMetricsOverviewProps {
  timeRange: string
}

export function SEOMetricsOverview({ timeRange }: SEOMetricsOverviewProps) {
  const metrics = getMetricsData(timeRange)

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-neon-blue" />
              <span className="text-sm font-medium flex items-center gap-2">
                Organic Traffic
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10">
                      <p className="max-w-xs">Visitors coming to your site from search engines</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            {metrics.organicTrafficChange > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold">{metrics.organicTraffic.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {metrics.organicTrafficChange > 0 ? (
              <span className="text-green-400">+{metrics.organicTrafficChange}%</span>
            ) : (
              <span className="text-red-400">{metrics.organicTrafficChange}%</span>
            )}
            <span>from previous period</span>
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-5 w-5 text-neon-purple" />
              <span className="text-sm font-medium flex items-center gap-2">
                Click-Through Rate
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10">
                      <p className="max-w-xs">Percentage of impressions that resulted in clicks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            {metrics.clickThroughRateChange > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold">{metrics.clickThroughRate}%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {metrics.clickThroughRateChange > 0 ? (
              <span className="text-green-400">+{metrics.clickThroughRateChange}%</span>
            ) : (
              <span className="text-red-400">{metrics.clickThroughRateChange}%</span>
            )}
            <span>from previous period</span>
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-neon-blue" />
              <span className="text-sm font-medium flex items-center gap-2">
                Average Position
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10">
                      <p className="max-w-xs">Average ranking position across all keywords</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            {metrics.averagePositionChange < 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold">{metrics.averagePosition}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {metrics.averagePositionChange < 0 ? (
              <span className="text-green-400">{metrics.averagePositionChange}</span>
            ) : (
              <span className="text-red-400">+{metrics.averagePositionChange}</span>
            )}
            <span>from previous period</span>
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-neon-purple" />
              <span className="text-sm font-medium flex items-center gap-2">
                Impressions
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3.5 w-3.5 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-dark-100/90 backdrop-blur-md border-white/10">
                      <p className="max-w-xs">Number of times your pages appeared in search results</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            {metrics.impressionsChange > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-400" />
            )}
          </div>
          <div className="text-2xl font-bold">{metrics.impressions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {metrics.impressionsChange > 0 ? (
              <span className="text-green-400">+{metrics.impressionsChange}%</span>
            ) : (
              <span className="text-red-400">{metrics.impressionsChange}%</span>
            )}
            <span>from previous period</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
