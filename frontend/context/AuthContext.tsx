'use client'

import { createContext, useContext, useEffect, useState } from 'react'

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
  setUser: () => {} // Added default no-op function
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const setUser = (user: User | null) => {
    setUserState(user)
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://localhost:8000/api/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setUserState(data)
        } else {
          setUserState(null)
        }
      } catch (error) {
        setUserState(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
