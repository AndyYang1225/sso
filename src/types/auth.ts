export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string>
}

export type OAuthProvider = 'google' | 'github' | 'facebook'
