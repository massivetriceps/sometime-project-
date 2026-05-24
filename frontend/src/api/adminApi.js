import axios from 'axios'
import useAdminStore from '../store/adminStore'

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isAdminLoggingOut = false

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // 로그인 엔드포인트의 401은 인터셉터가 처리하지 않음 (AdminLogin.jsx의 catch에서 처리)
    if (error.config?.url?.includes('/api/admin/login')) {
      return Promise.reject(error)
    }
    if (error.response?.status === 401 && !isAdminLoggingOut) {
      isAdminLoggingOut = true
      useAdminStore.getState().logout()
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default adminApi