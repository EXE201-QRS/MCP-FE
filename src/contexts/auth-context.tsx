"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

import { getSessionTokenFromLocalStorage, removeTokensFromLocalStorage } from "@/lib/utils"
import { UserType } from "@/schemaValidations/user.model"

interface AuthContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = getSessionTokenFromLocalStorage()
    if (token) {
      fetchUserProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.data)
        setIsAuthenticated(true)
      } else {
        // Token invalid, clear it
        removeTokensFromLocalStorage()
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      removeTokensFromLocalStorage()
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout API
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      
      // Clear local storage
      removeTokensFromLocalStorage()
      
      // Update state
      setUser(null)
      setIsAuthenticated(false)
      
      // Redirect to login
      window.location.href = "/login"
      
      toast.success("Đăng xuất thành công")
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất")
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
