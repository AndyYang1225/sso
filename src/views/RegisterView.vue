<template>
  <div class="auth-page">
    <q-card class="auth-card">
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="person_add" size="56px" color="primary" />
        <div class="text-h5 q-mt-md">建立帳號</div>
        <div class="text-grey-7 q-mt-xs">加入 {{ appName }}</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="使用者名稱"
            outlined
            autocomplete="username"
            :rules="[required, minLength(3), maxLength(24)]"
            lazy-rules
          >
            <template #prepend><q-icon name="person" /></template>
          </q-input>

          <q-input
            v-model="form.email"
            type="email"
            label="電子郵件"
            outlined
            autocomplete="email"
            :rules="[required, email]"
            lazy-rules
          >
            <template #prepend><q-icon name="mail" /></template>
          </q-input>

          <q-input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            label="密碼"
            outlined
            autocomplete="new-password"
            hint="至少 8 碼、包含英文與數字"
            :rules="[required, strongPassword]"
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

          <q-input
            v-model="form.confirm"
            :type="showPwd ? 'text' : 'password'"
            label="確認密碼"
            outlined
            autocomplete="new-password"
            :rules="[required, sameAs(() => form.password)]"
            lazy-rules
          >
            <template #prepend><q-icon name="lock_outline" /></template>
          </q-input>

          <CaptchaInput ref="captchaRef" v-model="form.captcha" />

          <q-checkbox
            v-model="form.agree"
            label="我已閱讀並同意使用者條款與隱私政策"
            :rules="[(v: boolean) => v || '請先同意條款']"
          />

          <q-btn
            type="submit"
            label="建立帳號"
            color="primary"
            class="full-width"
            size="lg"
            :loading="auth.loading"
            :disable="!form.agree"
            no-caps
          />
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-lg">
        已有帳號？
        <router-link :to="{ name: 'login' }" class="text-primary text-weight-medium">
          前往登入
        </router-link>
      </q-card-section>
    </q-card>

    <ThemeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import CaptchaInput from '@/components/CaptchaInput.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import {
  required,
  email,
  minLength,
  maxLength,
  strongPassword,
  sameAs,
} from '@/utils/validators'

const appName = import.meta.env.VITE_APP_NAME
const auth = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const showPwd = ref(false)
const captchaRef = ref<InstanceType<typeof CaptchaInput> | null>(null)
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirm: '',
  captcha: '',
  agree: false,
})

async function onSubmit() {
  try {
    await auth.register({
      username: form.username,
      email: form.email,
      password: form.password,
    })
    $q.notify({
      type: 'positive',
      message: '註冊成功，歡迎加入！',
      position: 'top',
    })
    router.push({ name: 'dashboard' })
  } catch {
    captchaRef.value?.refresh()
  }
}
</script>
