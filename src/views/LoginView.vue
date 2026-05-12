<template>
  <div class="auth-page">
    <q-card class="auth-card">
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="vpn_key" size="56px" color="primary" />
        <div class="text-h5 q-mt-md">歡迎回來</div>
        <div class="text-grey-7 q-mt-xs">登入 {{ appName }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.email"
            label="帳號 / Email"
            outlined
            autocomplete="username"
            :rules="[required]"
            lazy-rules
            hint="試試 teat123 / test456"
          >
            <template #prepend><q-icon name="mail" /></template>
          </q-input>

          <q-input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            label="密碼"
            outlined
            autocomplete="current-password"
            :rules="[required]"
            lazy-rules
          >
            <template #prepend><q-icon name="lock" /></template>
            <template #append>
              <q-icon
                :name="showPwd ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPwd = !showPwd"
              />
            </template>
          </q-input>

          <CaptchaInput ref="captchaRef" v-model="form.captcha" />

          <div class="row items-center justify-between">
            <q-checkbox v-model="form.remember" label="記住我" />
            <router-link
              :to="{ name: 'forgot-password' }"
              class="text-primary text-caption"
            >
              忘記密碼？
            </router-link>
          </div>

          <q-btn
            type="submit"
            label="登入"
            color="primary"
            class="full-width"
            size="lg"
            :loading="auth.loading"
            no-caps
          />
        </q-form>

        <q-btn
          flat
          no-caps
          class="full-width q-mt-sm demo-btn"
          icon="bolt"
          label="Demo 快速登入（跳過驗證）"
          :loading="auth.loading"
          @click="demoLogin"
        />

        <q-separator class="q-my-lg" />
        <div class="text-center text-grey-7 text-caption q-mb-md">或使用第三方登入</div>
        <OAuthButtons />
      </q-card-section>

      <q-card-section class="text-center q-pb-lg">
        還沒有帳號？
        <router-link :to="{ name: 'register' }" class="text-primary text-weight-medium">
          立即註冊
        </router-link>
      </q-card-section>
    </q-card>

    <ThemeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import OAuthButtons from '@/components/OAuthButtons.vue'
import CaptchaInput from '@/components/CaptchaInput.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { required } from '@/utils/validators'

const appName = import.meta.env.VITE_APP_NAME
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const showPwd = ref(false)
const captchaRef = ref<InstanceType<typeof CaptchaInput> | null>(null)
const form = reactive({
  email: '',
  password: '',
  captcha: '',
  remember: true,
})

async function onSubmit() {
  try {
    await auth.login({
      email: form.email,
      password: form.password,
      remember: form.remember,
    })
    $q.notify({ type: 'positive', message: '登入成功', position: 'top' })
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch {
    captchaRef.value?.refresh()
  }
}

async function demoLogin() {
  try {
    await auth.login({ email: 'teat123', password: 'test456', remember: true })
    $q.notify({ type: 'positive', message: 'Demo 登入成功', position: 'top' })
    router.push('/dashboard')
  } catch {
    $q.notify({ type: 'negative', message: 'Demo 登入失敗', position: 'top' })
  }
}
</script>
