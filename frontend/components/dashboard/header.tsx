'use client'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/ui/LoadingScreen"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, setUser, loading } = useAuth() // Assuming isLoading is part of the context
  const [showTransition, setShowTransition] = useState(false)
  const router = useRouter()

  const handleTransitionComplete = () => {
    setUser(null) // Clear the user state
    router.push("/login") // Redirect to the login page after logging out
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

  // Show a loading screen until the user is loaded
  if (loading) {
    return <LoadingScreen message="Loading dashboard..." />
  }

  if (showTransition) {
    return (
      <LoadingScreen
        message="Logging out..."
        timeout={1000}
        onComplete={handleTransitionComplete}
      />
    )
  }

  // Safe destructure with defaults
  const name = user?.name ?? ""
  const initials =
    name.split(" ").map((n) => n[0]).join("").toUpperCase() || "JD"

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/10 bg-gradient-to-r from-black/60 to-dark-100/60 backdrop-blur-xl px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="backdrop-blur-md bg-black/80 border-white/10">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
