import { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      // Set the token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // You could verify the token here by calling a /me endpoint
      // For now, we'll just set a basic user object
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    Cookies.set('token', token, { expires: 7 }) // 7 days
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser({ token, ...userData })
  }

  const logout = () => {
    Cookies.remove('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}