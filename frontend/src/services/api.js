import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api',
  timeout: 30000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status === 403) {
      toast.error('Access denied')
    } else {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  changePassword: (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword }),
}

// File API calls
export const fileAPI = {
  upload: (formData) => {
    return axios.post(
      process.env.NODE_ENV === 'production' ? '/files/upload' : 'http://localhost:8080/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        timeout: 60000, // 60 seconds for file uploads
      }
    )
  },
  getMyFiles: () => {
    return axios.get(
      process.env.NODE_ENV === 'production' ? '/files/my' : 'http://localhost:8080/files/my',
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    )
  },
  getPublicFile: (id) => {
    return axios.get(
      process.env.NODE_ENV === 'production' ? `/files/public/${id}` : `http://localhost:8080/files/public/${id}`
    )
  },
  downloadFile: (id) => {
    const baseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080'
    return `${baseUrl}/files/download/${id}`
  },
  deleteFile: (id) => {
    return axios.delete(
      process.env.NODE_ENV === 'production' ? `/files/delete/${id}` : `http://localhost:8080/files/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    )
  },
  togglePublic: (id) => {
    return axios.patch(
      process.env.NODE_ENV === 'production' ? `/files/${id}/toggle-public` : `http://localhost:8080/files/${id}/toggle-public`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      }
    )
  },
}

// Payment API calls
export const paymentAPI = {
  createOrder: (amount) => api.post('/payments/create-order', { amount }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
}

export default api