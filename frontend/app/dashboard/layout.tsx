'use client'

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useAuth } from "@/context/AuthContext"
import { LoadingScreen } from "@/components/ui/LoadingScreen" // Uncomment if you want a fancy loader

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login...");
      router.push("/login")
    } else {
      console.log(user);
    }
  }, [user, loading, router])

  // Show loading screen or fallback UI while user data is loading
  if (loading) {
    return <LoadingScreen message="Authenticating..." /> // Optional loader
    // Or fallback:
    // return <div className="text-white text-center mt-10">Authenticating...</div>
  }

  if (!user) {
    // You can optionally show a message or a redirect here
    return <div className="text-white text-center mt-10">Redirecting to login...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-200 to-dark-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
