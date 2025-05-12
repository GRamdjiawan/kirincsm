import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText } from "lucide-react"

const recentPages = [
  {
    id: 1,
    title: "Homepage",
    updatedAt: "2 hours ago",
    user: {
      name: "Admin",
      avatar: "",
    },
  },
  {
    id: 2,
    title: "About Us",
    updatedAt: "Yesterday",
    user: {
      name: "Admin",
      avatar: "",
    },
  },
  {
    id: 3,
    title: "Services",
    updatedAt: "3 days ago",
    user: {
      name: "Admin",
      avatar: "",
    },
  },
]

export function RecentPages() {
  return (
    <div className="space-y-4">
      {recentPages.map((page) => (
        <div key={page.id} className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center mr-3">
            <FileText className="h-4 w-4 text-neon-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{page.title}</p>
            <p className="text-xs text-muted-foreground">Updated {page.updatedAt}</p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={page.user.avatar || "/placeholder.svg"} alt={page.user.name} />
            <AvatarFallback className="bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs">
              {page.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      ))}
    </div>
  )
}
