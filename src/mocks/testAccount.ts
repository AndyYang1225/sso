import type { AuthResponse, LoginPayload } from '@/types/auth'

export const TEST_ACCOUNTS: Record<string, { password: string; user: AuthResponse['user'] }> = {
  teat123: {
    password: 'test456',
    user: {
      id: 'u-test-001',
      username: 'teat123',
      email: 'teat123@demo.local',
      avatar: '',
      roles: ['admin'],
      emailVerified: true,
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  },
}

export function tryMockLogin(payload: LoginPayload): AuthResponse | null {
  const key = payload.email.trim().toLowerCase()
  const acc = TEST_ACCOUNTS[key] || TEST_ACCOUNTS[key.split('@')[0]]
  if (!acc || acc.password !== payload.password) return null

  return {
    user: acc.user,
    tokens: {
      accessToken: 'mock.access.' + Math.random().toString(36).slice(2),
      refreshToken: 'mock.refresh.' + Math.random().toString(36).slice(2),
      expiresIn: 3600,
      tokenType: 'Bearer',
    },
  }
}
