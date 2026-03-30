"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface Domain {
  id: number
  name: string
  url: string
}

interface DomainContextType {
  selectedDomain: Domain | null
  setSelectedDomain: (domain: Domain) => void
  domains: Domain[]
  setDomains: (domains: Domain[]) => void
  domainsLoading: boolean
}

const DomainContext = createContext<DomainContextType | undefined>(undefined)

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [domainsLoading, setDomainsLoading] = useState(false)

  // Load selected domain from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedDomain")
    if (saved) {
      try {
        setSelectedDomain(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved domain:", e)
      }
    }
  }, [])

  // Save selected domain to localStorage whenever it changes
  useEffect(() => {
    if (selectedDomain) {
      localStorage.setItem("selectedDomain", JSON.stringify(selectedDomain))
    }
  }, [selectedDomain])

  const value: DomainContextType = {
    selectedDomain,
    setSelectedDomain,
    domains,
    setDomains,
    domainsLoading,
  }

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>
}

export function useDomain() {
  const context = useContext(DomainContext)
  if (!context) {
    throw new Error("useDomain must be used within a DomainProvider")
  }
  return context
}
