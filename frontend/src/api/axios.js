import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// 요청마다 토큰 자동으로 붙여줌
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// isLoggingOut: 동시 401 응답(병렬 API 호출)이 여러 개 들어와도 logout()을 한 번만 실행하기 위한 플래그.
// window.location.href 리디렉션은 전체 페이지 리로드를 일으키므로 모듈 상태가 초기화되어 플래그 리셋 불필요.
let isLoggingOut = false

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 로그인 엔드포인트의 401은 인터셉터가 처리하지 않음 (Login.jsx의 catch에서 처리)
    if (error.config?.url?.includes('/api/auth/login')) {
      return Promise.reject(error)
    }
    // 401 Unauthorized: 토큰 만료 또는 미인증 → 로그아웃 후 로그인 페이지로 강제 이동
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
