<template>
  <div class="auth-page">
    <q-card class="auth-card">
      <q-card-section class="text-center q-pt-xl">
        <q-icon name="password" size="56px" color="primary" />
        <div class="text-h5 q-mt-md">重設密碼</div>
      </q-card-section>

      <q-card-section>
        <q-banner v-if="!token" class="bg-negative text-white q-mb-md" rounded>
          <template #avatar><q-icon name="error" /></template>
          連結無效或已過期
        </q-banner>

        <q-form v-else @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="password"
            :type="showPwd ? 'text' : 'password'"
            label="新密碼"
            outlined
            autocomplete="new-password"
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
            v-model="confirm"
            :type="showPwd ? 'text' : 'password'"
            label="確認新密碼"
            outlined
            autocomplete="new-password"
            :rules="[required, sameAs(() => password)]"
            lazy-rules
          >
            <template #prepend><q-icon name="lock_outline" /></template>
          </q-input>

          <q-btn
            type="submit"
            label="重設密碼"
            color="primary"
            class="full-width"
            size="lg"
            :loading="loading"
            no-caps
          />
        </q-form>
      </q-card-section>
    </q-card>

    <ThemeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { required, strongPassword, sameAs } from '@/utils/validators'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore()

const token = computed(() => (route.query.token as string) || '')
const password = ref('')
const confirm = ref('')
const showPwd = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await auth.resetPassword({ token: token.value, password: password.value })
    $q.notify({
      type: 'positive',
      message: '密碼已重設，請重新登入',
      position: 'top',
    })
    router.push({ name: 'login' })
  } finally {
    loading.value = false
  }
}
</script>
