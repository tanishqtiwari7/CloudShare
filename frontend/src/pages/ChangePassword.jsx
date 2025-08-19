import { useState } from 'react'
import { authAPI } from '../services/api'
import { Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password')
      return
    }

    setLoading(true)

    try {
      await authAPI.changePassword(formData.currentPassword, formData.newPassword)
      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast.success('Password changed successfully!')
    } catch (error) {
      // Error is handled by API interceptor
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' }
    
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score < 2) return { level: 1, text: 'Weak', color: 'red' }
    if (score < 4) return { level: 2, text: 'Fair', color: 'yellow' }
    if (score < 5) return { level: 3, text: 'Good', color: 'blue' }
    return { level: 4, text: 'Strong', color: 'green' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Change Password</h1>
        <p className="text-xl text-gray-600">Update your account password for better security</p>
      </div>

      {success && (
        <div className="card bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Password Updated Successfully</h3>
              <p className="text-green-800 text-sm">Your password has been changed. Keep it secure!</p>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Form */}
      <form className="card space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="currentPassword"
              name="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              required
              value={formData.currentPassword}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="newPassword"
              name="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              required
              value={formData.newPassword}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.color === 'red' ? 'bg-red-500' :
                      passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                      passwordStrength.color === 'blue' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-medium ${
                  passwordStrength.color === 'red' ? 'text-red-600' :
                  passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                  passwordStrength.color === 'blue' ? 'text-blue-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-2">
              {formData.newPassword === formData.confirmPassword ? (
                <p className="text-green-600 text-sm flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Passwords match</span>
                </p>
              ) : (
                <p className="text-red-600 text-sm">Passwords do not match</p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <LoadingSpinner size="small" text="Changing password..." /> : 'Change Password'}
        </button>
      </form>

      {/* Password Security Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Password Security Tips</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">Strong Password Should Have:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Mix of uppercase and lowercase letters</li>
              <li>• Numbers and special characters</li>
              <li>• Avoid common words or patterns</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">Security Best Practices:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Use unique passwords for each account</li>
              <li>• Change passwords regularly</li>
              <li>• Never share your passwords</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword