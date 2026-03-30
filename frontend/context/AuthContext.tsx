'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: number
  name: string
  email: string
  role: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setUser: () => {
    console.warn('setUser called outside AuthProvider')
  },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user !== null) {
      setLoading(false)
      return
    }
  
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/me', {
          method: 'GET',
          credentials: 'include',
        })
  
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
  
    fetchUser()
  }, [user])
  
  
  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
