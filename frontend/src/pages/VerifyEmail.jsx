import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { CheckCircle, XCircle, Cloud } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying') // verifying, success, error
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid or missing verification token')
      return
    }

    verifyEmail()
  }, [token])

  const verifyEmail = async () => {
    try {
      await authAPI.verifyEmail(token)
      setStatus('success')
      setMessage('Your email has been successfully verified! You can now sign in to your account.')
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.message || 'Email verification failed. The link may be expired or invalid.')
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <Cloud className="h-16 w-16 text-primary-600 mx-auto mb-6 animate-bounce-gentle" />
            <LoadingSpinner size="large" text="Verifying your email..." />
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-8">
            <div>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h2>
              <p className="text-xl text-gray-600">{message}</p>
            </div>
            
            <div className="card space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>What's next?</strong>
                  <br />
                  Your account is now active. Sign in to start uploading and sharing files securely.
                </p>
              </div>
              
              <Link to="/login" className="w-full btn-primary py-3 block text-center text-lg">
                Sign In to Your Account
              </Link>
              
              <Link to="/" className="w-full btn-secondary py-3 block text-center">
                Back to Home
              </Link>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center space-y-8">
            <div>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h2>
              <p className="text-xl text-gray-600">{message}</p>
            </div>
            
            <div className="card space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  <strong>Having trouble?</strong>
                  <br />
                  The verification link may have expired. Try registering again or contact support for assistance.
                </p>
              </div>
              
              <div className="space-y-3">
                <Link to="/register" className="w-full btn-primary py-3 block text-center">
                  Register Again
                </Link>
                
                <Link to="/login" className="w-full btn-secondary py-3 block text-center">
                  Try to Sign In
                </Link>
                
                <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium block text-center">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12">
      <div className="max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  )
}

export default VerifyEmail