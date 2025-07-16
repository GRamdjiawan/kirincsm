"use client"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Dashboard() {
  const { user } = useAuth()
  const [userName, setUserName] = useState("John Doe")
  const [hasDomain, setHasDomain] = useState(false)
  const [loadingDomain, setLoadingDomain] = useState(true) // Track loading state

  useEffect(() => {
    if (user) {
      setLoadingDomain(true) // Start loading
      fetch(`https://api.kirin-cms.nl/api/domains/${user.id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch domains")
          }
          return response.json()
        })
        .then((data) => {
          
          setHasDomain(data?.id) // Check if domains exist
        })
        .catch((error) => {
          console.error("Error fetching domains:", error)
          setHasDomain(false)
        })
        .finally(() => {
          setLoadingDomain(false) // Stop loading
        })
    }
    console.log(loadingDomain, hasDomain);
    
  }, [user])

  useEffect(() => {
    const fullName = user?.name || "John Doe"
    const capitalizeName = (name: string) => {
      return name
        .split(" ")
        .map((word) =>
          ["van", "van der", "van de"].includes(word.toLowerCase())
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    }

    const formattedName = capitalizeName(fullName)
    setUserName(formattedName)
  }, [user])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto">
        {/* Welcome Message */}
        <div className="space-y-2 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue bg-clip-text text-transparent animate-pulse">
            Welcome
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white/90">
            {userName}
          </h2>
        </div>

        {/* Conditional Rendering for Manage Images Button */}
        {!loadingDomain && hasDomain ? (
          <div className="pt-4 sm:pt-8">
            <Button
              asChild
              size="lg"
              className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl rounded-xl"
            >
              <Link href="/dashboard/images" className="flex items-center gap-3 sm:gap-4">
                <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                <span>Manage Images</span>
              </Link>
            </Button>
          </div>
        ) : (
          !loadingDomain && (
            <div className="pt-4 sm:pt-8">
              <Button
                asChild
                size="lg"
                className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-purple hover:to-neon-blue transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl rounded-xl"
              >
                <span>No domain linked</span>
              </Button>
            </div>
          )
        )}

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-neon-blue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-neon-purple/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  )
}