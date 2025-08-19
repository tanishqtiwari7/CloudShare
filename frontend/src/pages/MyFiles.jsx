import { useState, useEffect } from 'react'
import { fileAPI } from '../services/api'
import { Files, Download, Trash2, Share2, Lock, Unlock, Copy, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const MyFiles = () => {
  const [files, setFiles] = useState([])
  const [filteredFiles, setFilteredFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // all, public, private
  const [deleteLoading, setDeleteLoading] = useState({})
  const [toggleLoading, setToggleLoading] = useState({})

  useEffect(() => {
    fetchFiles()
  }, [])

  useEffect(() => {
    filterFiles()
  }, [files, searchTerm, filterType])

  const fetchFiles = async () => {
    try {
      const response = await fileAPI.getMyFiles()
      setFiles(response.data || [])
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterFiles = () => {
    let filtered = files

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(file => 
        file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType === 'public') {
      filtered = filtered.filter(file => file.isPublic)
    } else if (filterType === 'private') {
      filtered = filtered.filter(file => !file.isPublic)
    }

    setFilteredFiles(filtered)
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = (file) => {
    const downloadUrl = fileAPI.downloadFile(file.id)
    window.open(downloadUrl, '_blank')
    toast.success('Download started!')
  }

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(prev => ({ ...prev, [fileId]: true }))
    try {
      await fileAPI.deleteFile(fileId)
      setFiles(prev => prev.filter(f => f.id !== fileId))
      toast.success('File deleted successfully!')
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setDeleteLoading(prev => ({ ...prev, [fileId]: false }))
    }
  }

  const handleTogglePublic = async (fileId) => {
    setToggleLoading(prev => ({ ...prev, [fileId]: true }))
    try {
      await fileAPI.togglePublic(fileId)
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, isPublic: !f.isPublic } : f
      ))
      toast.success('File visibility updated!')
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setToggleLoading(prev => ({ ...prev, [fileId]: false }))
    }
  }

  const copyShareLink = (fileId) => {
    const shareUrl = `${window.location.origin}/file/${fileId}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Share link copied to clipboard!')
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Files</h1>
        <p className="text-xl text-gray-600">Manage and share your uploaded files</p>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10 pr-8"
            >
              <option value="all">All Files</option>
              <option value="public">Public Files</option>
              <option value="private">Private Files</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredFiles.length} of {files.length} files
        </div>
      </div>

      {/* Files List */}
      {filteredFiles.length > 0 ? (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* File Info */}
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    file.isPublic ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Files className={`h-6 w-6 ${file.isPublic ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{file.originalName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                      <span>•</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        file.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {file.isPublic ? (
                          <>
                            <Unlock className="h-3 w-3 mr-1" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(file)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleTogglePublic(file.id)}
                    disabled={toggleLoading[file.id]}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                    title={file.isPublic ? 'Make Private' : 'Make Public'}
                  >
                    {toggleLoading[file.id] ? (
                      <LoadingSpinner size="small" />
                    ) : file.isPublic ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <Unlock className="h-5 w-5" />
                    )}
                  </button>

                  {file.isPublic && (
                    <button
                      onClick={() => copyShareLink(file.id)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Copy Share Link"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteLoading[file.id]}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleteLoading[file.id] ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Share Link Display */}
              {file.isPublic && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Public Share Link:</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <code className="flex-1 text-sm bg-white p-2 rounded border text-gray-700 break-all">
                      {`${window.location.origin}/file/${file.id}`}
                    </code>
                    <button
                      onClick={() => copyShareLink(file.id)}
                      className="btn-secondary text-sm py-2"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Files className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {files.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
          </h3>
          <p className="text-gray-600 mb-6">
            {files.length === 0 
              ? 'Upload your first file to get started with CloudShare'
              : 'Try adjusting your search terms or filters'
            }
          </p>
          {files.length === 0 && (
            <Link to="/upload" className="btn-primary inline-flex items-center space-x-2">
              <UploadIcon className="h-4 w-4" />
              <span>Upload Files</span>
            </Link>
          )}
        </div>
      )}

      {/* Need Credits Banner */}
      <div className="card bg-purple-50 border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-purple-900">Need more credits?</h3>
              <p className="text-purple-700">Purchase credits to upload more files</p>
            </div>
          </div>
          <Link to="/buy-credits" className="btn-primary">
            Buy Credits
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MyFiles