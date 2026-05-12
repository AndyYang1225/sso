<template>
  <div class="auth-page">
    <q-card class="auth-card">
      <q-card-section class="text-center q-py-xl">
        <q-spinner-dots v-if="!errorMsg" color="primary" size="48px" />
        <q-icon v-else name="error" color="negative" size="48px" />
        <div class="text-h6 q-mt-lg">
          {{ errorMsg || '處理中，請稍候…' }}
        </div>
        <q-btn
          v-if="errorMsg"
          flat
          color="primary"
          label="返回登入"
          class="q-mt-md"
          :to="{ name: 'login' }"
          no-caps
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import type { OAuthProvider } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()

const errorMsg = ref<string>('')

onMounted(async () => {
  const provider = route.params.provider as OAuthProvider
  const code = route.query.code as string
  const state = route.query.state as string
  const error = route.query.error as string

  if (error) {
    errorMsg.value = `授權失敗：${error}`
    return
  }

  if (!code || !provider) {
    errorMsg.value = '缺少授權資訊'
    return
  }

  try {
    await auth.handleOAuthCallback(provider, code, state)
    $q.notify({ type: 'positive', message: '登入成功', position: 'top' })
    router.replace({ name: 'profile' })
  } catch (e) {
    errorMsg.value = '登入失敗，請稍後再試'
  }
})
</script>
