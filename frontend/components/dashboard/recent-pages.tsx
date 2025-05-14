import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

const recentActivity = [
  {
    id: "1",
    title: "Homepage",
    action: "updated",
    user: {
      name: "Admin User",
      avatar: "/placeholder.svg",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    title: "About Us",
    action: "published",
    user: {
      name: "Admin User",
      avatar: "/placeholder.svg",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    title: "Services",
    action: "created",
    user: {
      name: "Admin User",
      avatar: "/placeholder.svg",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
]

export function RecentPages() {
  return (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback className="bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs">
              {activity.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">
                {activity.action} <span className="font-medium text-white">{activity.title}</span>
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
