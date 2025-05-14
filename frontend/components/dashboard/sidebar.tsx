"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, ImageIcon, Search, Settings, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"

const sidebarItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Pages", icon: FileText, href: "/dashboard/pages" },
  { title: "Media", icon: ImageIcon, href: "/dashboard/media" },
  { title: "SEO", icon: Search, href: "/dashboard/seo" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const [formattedUserName, setFormattedUserName] = useState("John Doe")
  const [domain, setDomain] = useState("example.com")

  useEffect(() => {
    const userName = user?.name || "John Doe"
    const capitalizeName = (name: string) => {
      const tussenvoegsels = ["van", "der", "de"]
      return name
        .split(" ")
        .map((word) =>
          tussenvoegsels.includes(word.toLowerCase())
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    }

    setFormattedUserName(capitalizeName(userName))

    if (user?.id) {
      console.log(user.id);
      
      fetch(`http://localhost:8000/api/domains/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setDomain(data.name || "example.com")
        })
        .catch((error) => {
          console.error("Error fetching domain:", error)
          setDomain("Error")
        })
    }
  }, [user])

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
      <div className="flex flex-col flex-grow backdrop-blur-xl bg-black/40 border-r border-white/10 pt-5 overflow-hidden">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue shadow-glow-purple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold">Nebula CMS</span>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-neon-blue" : "text-gray-400")} />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4">
          <div className="glow-effect rounded-lg p-4 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-semibold">
                  {formattedUserName.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{formattedUserName}</p>
                <p className="text-xs text-gray-400">{domain}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
