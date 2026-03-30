import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/AuthContext"
import { DomainProvider } from "@/context/DomainContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kirin CMS",
  description: "A futuristic CMS for managing Vercel-hosted websites",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <DomainProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              {children}
            </ThemeProvider>
          </DomainProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

