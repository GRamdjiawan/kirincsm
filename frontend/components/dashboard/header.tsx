"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, setUser, loading } = useAuth()
  const [showTransition, setShowTransition] = useState(false)
  const router = useRouter()

  const handleTransitionComplete = () => {
    setUser(null)
    router.push("/")
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
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

  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />
  }

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

  function openProfile() {
    router.push("/dashboard/profile")
  }

  return (
    // Header is now hidden on mobile (only shows on md and up)
    <header className="hidden md:flex sticky top-0 z-10 h-16 items-center justify-between border-b border-white/10 bg-gradient-to-r from-black/60 to-dark-100/60 backdrop-blur-xl px-6">
      {/* Left side - could add breadcrumbs or page title here */}
      <div className="flex items-center">{/* Future: breadcrumbs or page title */}</div>

      {/* Right side actions - Desktop only */}
      <div className="flex items-center space-x-2 flex-shrink-0">
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
    </header>
  )
}
