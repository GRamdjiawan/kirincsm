import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentPages } from "@/components/dashboard/recent-pages"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Here's an overview of your website performance</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest content updates</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPages />
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/5 border-white/10 shadow-lg md:col-span-2 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto flex flex-col items-center justify-center p-6 border-white/10 hover:bg-white/5 rounded-xl"
              >
                <Link href="/dashboard/pages/new">
                  <PlusIcon className="h-10 w-10 mb-2" />
                  <span>Create New Page</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex flex-col items-center justify-center p-6 border-white/10 hover:bg-white/5 rounded-xl"
              >
                <Link href="/dashboard/images">
                  <PlusIcon className="h-10 w-10 mb-2" />
                  <span>Upload Images</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto flex flex-col items-center justify-center p-6 border-white/10 hover:bg-white/5 rounded-xl"
              >
                <Link href="/dashboard/help">
                  <PlusIcon className="h-10 w-10 mb-2" />
                  <span>Get Help</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
