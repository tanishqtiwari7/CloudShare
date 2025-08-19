import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Cloud, Upload, Files, CreditCard, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsDropdownOpen(false)
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary-600">
            <Cloud className="h-8 w-8" />
            <span>CloudShare</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/upload" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Link>
                <Link to="/my-files" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <Files className="h-4 w-4" />
                  <span>My Files</span>
                </Link>
                <Link to="/buy-credits" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <CreditCard className="h-4 w-4" />
                  <span>Buy Credits</span>
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm">Account</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <Link 
                        to="/change-password" 
                        className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Change Password</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="h-6 w-6 text-gray-700" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                    <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/upload" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      <Upload className="h-4 w-4" />
                      <span>Upload Files</span>
                    </Link>
                    <Link to="/my-files" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      <Files className="h-4 w-4" />
                      <span>My Files</span>
                    </Link>
                    <Link to="/buy-credits" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      <CreditCard className="h-4 w-4" />
                      <span>Buy Credits</span>
                    </Link>
                    <Link to="/change-password" className="flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gray-50" onClick={() => setIsDropdownOpen(false)}>
                      <Settings className="h-4 w-4" />
                      <span>Change Password</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Backdrop for mobile dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </nav>
  )
}

export default Navbar