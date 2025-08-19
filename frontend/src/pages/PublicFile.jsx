import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fileAPI } from '../services/api'
import { Download, File, Calendar, HardDrive, Share2, Cloud } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const PublicFile = () => {
  const { id } = useParams()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchFileInfo()
  }, [id])

  const fetchFileInfo = async () => {
    try {
      const response = await fileAPI.getPublicFile(id)
      setFile(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'File not found or is private')
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = async () => {
    if (!file) return
    
    setDownloading(true)
    try {
      const downloadUrl = fileAPI.downloadFile(file.id)
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = file.originalName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Download started!')
    } catch (error) {
      toast.error('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const copyShareLink = () => {
    const shareUrl = window.location.href
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard!')
  }

  const getFileExtension = (filename) => {
    return filename.split('.').pop().toUpperCase()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="card">
          <Cloud className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">File Not Found</h1>
          <p className="text-xl text-gray-600 mb-6">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Possible reasons:</strong>
              <br />
              • The file is private and not publicly shared
              <br />
              • The file has been deleted by the owner
              <br />
              • The link is incorrect or expired
            </p>
          </div>
          <a href="/" className="btn-primary inline-block">
            Go to CloudShare Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Public File</h1>
        <p className="text-xl text-gray-600">Download this file shared via CloudShare</p>
      </div>

      {/* File Information */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* File Icon & Basic Info */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                <File className="h-8 w-8 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 break-words">{file.originalName}</h2>
                <p className="text-gray-600">
                  {getFileExtension(file.originalName)} File • {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            {/* File Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <HardDrive className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">File Size</p>
                  <p className="font-medium text-gray-900">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Uploaded</p>
                  <p className="font-medium text-gray-900">{formatDate(file.uploadedAt)}</p>
                </div>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Ready to Download</h3>
              <p className="text-green-800 mb-4">
                This file is publicly available for download. No account required.
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {downloading ? (
                  <LoadingSpinner size="small" text="Starting download..." />
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Download {file.originalName}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="lg:w-80">
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Share This File</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Share Link</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={window.location.href}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={copyShareLink}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <button
                  onClick={copyShareLink}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Copy Share Link</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>About CloudShare:</strong>
                  <br />
                  Secure file sharing platform with credit-based uploads and instant public links.
                </p>
                <a 
                  href="/" 
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Try CloudShare →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Security & Privacy</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-1">Safe Download</h4>
            <p>All files are scanned and hosted securely on our servers.</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">No Registration</h4>
            <p>You can download this file without creating an account.</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Original Quality</h4>
            <p>Files are downloaded in their original format and quality.</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Reliable Hosting</h4>
            <p>Powered by MinIO object storage for fast, reliable downloads.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicFile