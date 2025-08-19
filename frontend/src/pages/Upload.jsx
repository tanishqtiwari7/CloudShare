import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { fileAPI } from '../services/api'
import { Upload as UploadIcon, X, File, AlertCircle, CheckCircle, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'

const Upload = () => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending'
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload')
      return
    }

    setUploading(true)
    const formData = new FormData()
    
    files.forEach(({ file }) => {
      formData.append('file', file)
    })

    try {
      const response = await fileAPI.upload(formData)
      
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'success'
      })))
      
      toast.success(`Successfully uploaded ${files.length} file(s)!`)
      
      // Clear files after successful upload
      setTimeout(() => {
        setFiles([])
      }, 2000)
      
    } catch (error) {
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'error'
      })))
      
      if (error.response?.status === 402) {
        toast.error('Insufficient credits. Please buy more credits to upload files.')
      } else {
        toast.error('Upload failed. Please try again.')
      }
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Files</h1>
        <p className="text-xl text-gray-600">
          Drag and drop your files or click to browse. Each file costs 1 credit.
        </p>
      </div>

      {/* Upload Area */}
      <div className="card">
        <div 
          {...getRootProps()} 
          className={`file-upload-area cursor-pointer ${isDragActive ? 'dragover' : ''}`}
        >
          <input {...getInputProps()} />
          <UploadIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-xl text-primary-600 font-medium">Drop the files here...</p>
          ) : (
            <div>
              <p className="text-xl text-gray-700 font-medium mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-gray-500">
                Maximum file size: 100MB per file
              </p>
            </div>
          )}
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map(({ file, id, status }) => (
                <div key={id} className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(status)}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {status === 'pending' && (
                    <button
                      onClick={() => removeFile(id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
                className="btn-primary flex-1 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <LoadingSpinner size="small" text="Uploading..." />
                ) : (
                  `Upload ${files.length} File${files.length > 1 ? 's' : ''} (${files.length} Credit${files.length > 1 ? 's' : ''})`
                )}
              </button>
              
              <Link to="/buy-credits" className="btn-secondary py-3 text-lg text-center">
                <CreditCard className="h-5 w-5 inline mr-2" />
                Buy Credits
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Upload Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Upload Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Each file upload costs 1 credit</li>
          <li>• Maximum file size is 100MB per file</li>
          <li>• You can upload multiple files at once</li>
          <li>• Files are private by default - toggle to public to share</li>
          <li>• Supported formats: All file types are supported</li>
        </ul>
      </div>
    </div>
  )
}

export default Upload