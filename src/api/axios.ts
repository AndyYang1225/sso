import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { Notify } from 'quasar'
import type { ApiError, AuthTokens } from '@/types/auth'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let pendingQueue: Array<(token: string) => void> = []

const enqueue = (cb: (token: string) => void) => pendingQueue.push(cb)
const flushQueue = (token: string) => {
  pendingQueue.forEach((cb) => cb(token))
  pendingQueue = []
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('sso.accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          enqueue((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(http(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('sso.refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post<AuthTokens>(
          `${baseURL}/auth/refresh`,
          { refreshToken },
        )
        localStorage.setItem('sso.accessToken', data.accessToken)
        localStorage.setItem('sso.refreshToken', data.refreshToken)

        flushQueue(data.accessToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        }
        return http(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem('sso.accessToken')
        localStorage.removeItem('sso.refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    const message = error.response?.data?.message || error.message || '伺服器連線失敗'
    Notify.create({ type: 'negative', message, position: 'top', timeout: 3000 })
    return Promise.reject(error)
  },
)
