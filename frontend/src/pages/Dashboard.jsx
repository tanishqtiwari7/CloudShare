import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fileAPI } from '../services/api'
import { Upload, Files, CreditCard, TrendingUp, Cloud, Plus } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    publicFiles: 0,
    privateFiles: 0,
    totalDownloads: 0
  })
  const [recentFiles, setRecentFiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fileAPI.getMyFiles()
      const files = response.data || []
      
      setRecentFiles(files.slice(0, 5)) // Show recent 5 files
      
      setStats({
        totalFiles: files.length,
        publicFiles: files.filter(f => f.isPublic).length,
        privateFiles: files.filter(f => !f.isPublic).length,
        totalDownloads: files.reduce((sum, f) => sum + (f.downloadCount || 0), 0)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">Manage your files and monitor your usage</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/upload" className="card hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Upload className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Files</h3>
              <p className="text-gray-600 text-sm">Upload and share your files</p>
            </div>
          </div>
        </Link>

        <Link to="/my-files" className="card hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <Files className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Files</h3>
              <p className="text-gray-600 text-sm">View and manage your files</p>
            </div>
          </div>
        </Link>

        <Link to="/buy-credits" className="card hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Buy Credits</h3>
              <p className="text-gray-600 text-sm">Purchase upload credits</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Files className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalFiles}</h3>
          <p className="text-gray-600">Total Files</p>
        </div>

        <div className="card text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Cloud className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.publicFiles}</h3>
          <p className="text-gray-600">Public Files</p>
        </div>

        <div className="card text-center">
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.privateFiles}</h3>
          <p className="text-gray-600">Private Files</p>
        </div>

        <div className="card text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</h3>
          <p className="text-gray-600">Downloads</p>
        </div>
      </div>

      {/* Recent Files */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Files</h2>
          <Link to="/my-files" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        
        {recentFiles.length > 0 ? (
          <div className="space-y-4">
            {recentFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    file.isPublic ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <Files className={`h-5 w-5 ${file.isPublic ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{file.originalName}</h3>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    file.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {file.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files yet</h3>
            <p className="text-gray-600 mb-4">Upload your first file to get started</p>
            <Link to="/upload" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Upload Files</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard