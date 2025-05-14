"use client"

import  React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
    const [open, setOpen] = useState(false)
    const { user, loading } = useAuth()
    const router = useRouter()
  
    useEffect(() => {
      if (!loading && !user) {
        router.push("/login")
      }
    }, [user, loading, router])
  


  return (
    <div className="md:hidden">
      <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center border-b border-white/10 bg-gradient-to-r from-black/60 to-dark-100/60 backdrop-blur-xl px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 backdrop-blur-xl bg-black/40 border-r border-white/10">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center ml-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue shadow-glow-purple">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="ml-2 text-lg font-bold">Nebula CMS</span>
        </div>
      </header>

      <main className="pt-16 min-h-screen bg-gradient-to-br from-dark-200 to-dark-100">
        <Header />
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}
