<template>
  <div class="column q-gutter-sm">
    <q-btn
      outline
      no-caps
      class="oauth-btn"
      color="grey-9"
      :loading="loadingProvider === 'google'"
      :disable="!!loadingProvider"
      @click="handle('google')"
    >
      <q-icon name="fab fa-google" class="q-mr-md" color="red" />
      使用 Google 登入
    </q-btn>

    <q-btn
      outline
      no-caps
      class="oauth-btn"
      color="grey-9"
      :loading="loadingProvider === 'github'"
      :disable="!!loadingProvider"
      @click="handle('github')"
    >
      <q-icon name="fab fa-github" class="q-mr-md" />
      使用 GitHub 登入
    </q-btn>

    <q-btn
      outline
      no-caps
      class="oauth-btn"
      color="grey-9"
      :loading="loadingProvider === 'facebook'"
      :disable="!!loadingProvider"
      @click="handle('facebook')"
    >
      <q-icon name="fab fa-facebook" class="q-mr-md" color="blue-8" />
      使用 Facebook 登入
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { OAuthProvider } from '@/types/auth'

const auth = useAuthStore()
const loadingProvider = ref<OAuthProvider | null>(null)

async function handle(provider: OAuthProvider) {
  loadingProvider.value = provider
  try {
    await auth.oauthLogin(provider)
  } finally {
    loadingProvider.value = null
  }
}
</script>
