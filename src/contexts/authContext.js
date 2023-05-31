'use client'

import { auth } from '@/services/authService'
import React from 'react'

const AuthContext = React.createContext()

export function useAuthContext () {
  return React.useContext(AuthContext)
}

export function AuthProvider ({ children }) {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
