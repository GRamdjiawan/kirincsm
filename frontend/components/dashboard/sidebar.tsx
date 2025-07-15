"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Users,
  User,
  Globe,
  ChevronDown,
  ChevronRight,
  Check,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { LoadingScreen } from "@/components/ui/LoadingScreen"

const defaultAdminSites = [
  { name: "Main Website", url: "main-website.com", id: "site1" },
  { name: "Blog", url: "blog.example.com", id: "site2" },
  { name: "E-commerce Store", url: "store.example.com", id: "site3" },
  { name: "Landing Page", url: "landing.example.com", id: "site4" },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser, loading } = useAuth()
  const isAdmin = user?.role === "admin"

  const [adminSitesData, setAdminSitesData] = useState(defaultAdminSites)
  const [selectedSite, setSelectedSite] = useState(defaultAdminSites[0])
  const [clientDomain, setClientDomain] = useState()
  const [state, setState] = useState("media-only")
  const [showTransition, setShowTransition] = useState(false)

  useEffect(() => {
    if (!user) return

    if (isAdmin) {
      fetch("https://api.nebula-cms.nl/api/domains", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok")
          return response.json()
        })
        .then((data) => {
          setAdminSitesData(data)
          setSelectedSite(data[0])
        })
        .catch((error) => {
          console.error("Error fetching domains:", error)
        })
    } else {
      fetch(`https://api.nebula-cms.nl/api/domains/${user?.id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok")
          return response.json()
        })
        .then((data) => {
          setClientDomain(data.name)
        })
        .catch((error) => {
          console.error("Error fetching domains:", error)
        })
    }
  }, [isAdmin, user])

  const handleTransitionComplete = () => {
    setUser(null)
    router.push("/")
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("https://api.nebula-cms.nl/api/logout", {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) {
        console.error("Failed to log out")
      } else {
        setShowTransition(true)
      }
    } catch (error) {
      console.error("An error occurred during logout:", error)
    }
  }

  const openProfile = () => {
    router.push("/dashboard/profile")
    onClose?.() // Close mobile sidebar when navigating
  }

  if (!user) return null

  if (showTransition) {
    return <LoadingScreen message="Logging out..." timeout={1000} onComplete={handleTransitionComplete} />
  }

  const name = user?.name ?? ""
  const initials =
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "JD"

  const sidebarItems = [
    {
      title: "Home",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    ...(clientDomain
      ? [
          ...(state === "media-only"
            ? [
                {
                  title: "Media",
                  icon: ImageIcon,
                  href: "/dashboard/images",
                },
              ]
            : [
                {
                  title: "Pages",
                  icon: FileText,
                  href: "/dashboard/pages",
                },
              ]),
        ]
      : []),
    ...(isAdmin
      ? [
          {
            title: "Users",
            icon: Users,
            href: "/dashboard/users",
          },
        ]
      : []),
    {
      title: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
  ]

  return (
    <div className="h-screen flex flex-col bg-black/40 backdrop-blur-xl border-r border-white/10">
      {/* Header with logo and mobile profile */}
      <div className="flex items-center justify-between px-4 h-16">
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

        {/* Mobile Profile Button - Only visible on mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-semibold text-sm">
                  {initials}
                </div>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border-white/10">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openProfile}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-6 flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Close mobile sidebar when navigating
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
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

      {/* Mobile Logout Button */}
      <div className="md:hidden p-4 border-t border-white/10">
        <Button
          variant="outline"
          className="w-full justify-center border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>

      {isAdmin ? (
        <div className="p-4 mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl"
              >
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-neon-blue" />
                  <span className="truncate">{selectedSite?.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] backdrop-blur-md bg-black/80 border-white/10">
              <DropdownMenuLabel>Select Website</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {adminSitesData.map((site) => (
                <DropdownMenuItem
                  key={site.id}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedSite(site)}
                >
                  <div className="flex flex-col">
                    <span>{site.name}</span>
                    <span className="text-xs text-gray-400">{site.url}</span>
                  </div>
                  {selectedSite?.id === site.id && <Check className="h-4 w-4 text-neon-blue" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="text-neon-purple">+ Add New Website</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="p-4 mt-auto flex items-center">
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400">{clientDomain || "example.com"}</p>
          </div>
        </div>
      )}
    </div>
  )
}
