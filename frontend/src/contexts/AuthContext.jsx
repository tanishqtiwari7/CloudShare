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
    console.log('Initializing auth - Token exists:', !!token)
    
    if (token) {
      // Set the token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // You could verify the token here by calling a /me endpoint
      // For now, we'll just set a basic user object
      setUser({ token })
      console.log('Auth initialized with token')
    }
    setLoading(false)
  }, [])

  const login = (token, userData) => {
    console.log('Login called with token:', !!token, 'userData:', userData)
    
    Cookies.set('token', token, { expires: 7 }) // 7 days
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser({ token, ...userData })
    
    console.log('Login successful - stored token and user data')
  }

  const logout = () => {
    console.log('Logging out...')
    Cookies.remove('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  // Add isAuthenticated function for compatibility
  const isAuthenticated = () => {
    const result = !!user && !!Cookies.get('token')
    console.log('isAuthenticated check:', result, 'User exists:', !!user, 'Token exists:', !!Cookies.get('token'))
    return result
  }

  // Add token getter for compatibility
  const token = Cookies.get('token')

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}