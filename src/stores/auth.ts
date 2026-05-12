import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { authApi } from '@/api/auth'
import { tryMockLogin } from '@/mocks/testAccount'
import type {
  AuthTokens,
  ForgotPasswordPayload,
  LoginPayload,
  OAuthProvider,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/types/auth'

const ACCESS_KEY = 'sso.accessToken'
const REFRESH_KEY = 'sso.refreshToken'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(localStorage.getItem(ACCESS_KEY))
    const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_KEY))
    const loading = ref(false)

    const isAuthenticated = computed(() => !!accessToken.value)
    const isAdmin = computed(() => user.value?.roles?.includes('admin') ?? false)

    function setTokens(tokens: AuthTokens) {
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      localStorage.setItem(ACCESS_KEY, tokens.accessToken)
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
    }

    function clearTokens() {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
    }

    async function login(payload: LoginPayload) {
      loading.value = true
      try {
        const mock = tryMockLogin(payload)
        if (mock) {
          await new Promise((r) => setTimeout(r, 400))
          setTokens(mock.tokens)
          user.value = mock.user
          return mock.user
        }
        const res = await authApi.login(payload)
        setTokens(res.tokens)
        user.value = res.user
        return res.user
      } finally {
        loading.value = false
      }
    }

    async function register(payload: RegisterPayload) {
      loading.value = true
      try {
        const res = await authApi.register(payload)
        setTokens(res.tokens)
        user.value = res.user
        return res.user
      } finally {
        loading.value = false
      }
    }

    async function logout() {
      try {
        if (!accessToken.value?.startsWith('mock.')) {
          await authApi.logout()
        }
      } catch {
        /* 忽略登出 API 失敗，仍清本地 */
      } finally {
        clearTokens()
      }
    }

    async function fetchMe() {
      if (!accessToken.value) return null
      if (accessToken.value.startsWith('mock.')) return user.value
      user.value = await authApi.me()
      return user.value
    }

    async function forgotPassword(payload: ForgotPasswordPayload) {
      await authApi.forgotPassword(payload)
    }

    async function resetPassword(payload: ResetPasswordPayload) {
      await authApi.resetPassword(payload)
    }

    async function oauthLogin(provider: OAuthProvider) {
      const redirectUri = `${window.location.origin}/oauth/callback/${provider}`
      const url = await authApi.oauthAuthorizeUrl(provider, redirectUri)
      window.location.href = url
    }

    async function handleOAuthCallback(provider: OAuthProvider, code: string, state: string) {
      loading.value = true
      try {
        const res = await authApi.oauthCallback(provider, code, state)
        setTokens(res.tokens)
        user.value = res.user
        return res.user
      } finally {
        loading.value = false
      }
    }

    return {
      user,
      accessToken,
      refreshToken,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      fetchMe,
      forgotPassword,
      resetPassword,
      oauthLogin,
      handleOAuthCallback,
      clearTokens,
    }
  },
  {
    persist: {
      key: 'sso.auth',
      pick: ['user'],
    },
  },
)
