import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, Eye, MousePointerClick, Clock } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-neon-blue" />
              <span className="ml-2 text-sm font-medium">Total Visitors</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">12,543</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-green-400">+12.5%</span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-neon-purple" />
              <span className="ml-2 text-sm font-medium">Page Views</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">48,271</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-green-400">+8.2%</span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <MousePointerClick className="h-5 w-5 text-neon-blue" />
              <span className="ml-2 text-sm font-medium">Conversion Rate</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">3.8%</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-green-400">+1.2%</span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-neon-purple" />
              <span className="ml-2 text-sm font-medium">Avg. Session</span>
            </div>
            <ArrowDownRight className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold">2m 45s</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-red-400">-0.5%</span>
            <span>from last month</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
