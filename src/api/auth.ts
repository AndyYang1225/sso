import { http } from './axios'
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  OAuthProvider,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/types/auth'

export const authApi = {
  login(payload: LoginPayload) {
    return http.post<AuthResponse>('/auth/login', payload).then((r) => r.data)
  },

  register(payload: RegisterPayload) {
    return http.post<AuthResponse>('/auth/register', payload).then((r) => r.data)
  },

  logout() {
    return http.post<void>('/auth/logout').then((r) => r.data)
  },

  me() {
    return http.get<User>('/auth/me').then((r) => r.data)
  },

  forgotPassword(payload: ForgotPasswordPayload) {
    return http.post<void>('/auth/forgot-password', payload).then((r) => r.data)
  },

  resetPassword(payload: ResetPasswordPayload) {
    return http.post<void>('/auth/reset-password', payload).then((r) => r.data)
  },

  verifyEmail(token: string) {
    return http.post<void>('/auth/verify-email', { token }).then((r) => r.data)
  },

  oauthAuthorizeUrl(provider: OAuthProvider, redirectUri: string) {
    return http
      .get<{ url: string }>(`/auth/oauth/${provider}/authorize`, {
        params: { redirectUri },
      })
      .then((r) => r.data.url)
  },

  oauthCallback(provider: OAuthProvider, code: string, state: string) {
    return http
      .post<AuthResponse>(`/auth/oauth/${provider}/callback`, { code, state })
      .then((r) => r.data)
  },
}
