<template>
  <div class="auth-page">
    <q-card class="auth-card">
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="lock_reset" size="56px" color="primary" />
        <div class="text-h5 q-mt-md">忘記密碼</div>
        <div class="text-grey-7 q-mt-xs">
          輸入您的電子郵件，我們會寄送重設連結
        </div>
      </q-card-section>

      <q-card-section>
        <q-banner v-if="sent" class="bg-positive text-white q-mb-md" rounded>
          <template #avatar><q-icon name="mark_email_read" /></template>
          重設密碼信已寄出，請檢查您的信箱
        </q-banner>

        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="formEmail"
            type="email"
            label="電子郵件"
            outlined
            autocomplete="email"
            :rules="[required, email]"
            lazy-rules
          >
            <template #prepend><q-icon name="mail" /></template>
          </q-input>

          <q-btn
            type="submit"
            label="寄送重設連結"
            color="primary"
            class="full-width"
            size="lg"
            :loading="loading"
            :disable="sent"
            no-caps
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-lg">
        <router-link :to="{ name: 'login' }" class="text-primary">
          <q-icon name="arrow_back" />
          返回登入
        </router-link>
      </q-card-section>
    </q-card>

    <ThemeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { required, email } from '@/utils/validators'

const auth = useAuthStore()
const formEmail = ref('')
const loading = ref(false)
const sent = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await auth.forgotPassword({ email: formEmail.value })
    sent.value = true
  } finally {
    loading.value = false
  }
}
</script>
