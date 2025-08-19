import { Cloud } from 'lucide-react'

const LoadingSpinner = ({ size = 'large', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }

  if (size === 'large') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <Cloud className="h-16 w-16 text-primary-600 mx-auto animate-bounce-gentle" />
            <div className="loading-spinner mx-auto mt-4"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  )
}

export default LoadingSpinner