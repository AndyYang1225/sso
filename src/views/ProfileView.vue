<template>
  <q-page class="admin-page">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card>
          <q-card-section class="bg-primary text-white text-center q-pa-xl">
            <q-avatar size="96px">
              <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="avatar" />
              <q-icon v-else name="account_circle" size="96px" />
            </q-avatar>
            <div class="text-h5 q-mt-md">{{ auth.user?.username }}</div>
            <div class="text-caption">{{ auth.user?.email }}</div>
            <q-chip
              v-if="auth.user?.emailVerified"
              class="q-mt-sm"
              color="positive"
              text-color="white"
              icon="verified"
              size="sm"
            >
              已驗證
            </q-chip>
            <q-chip
              v-else
              class="q-mt-sm"
              color="warning"
              text-color="white"
              icon="warning"
              size="sm"
            >
              未驗證
            </q-chip>
          </q-card-section>

          <q-list separator>
            <q-item>
              <q-item-section avatar><q-icon name="badge" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>使用者 ID</q-item-label>
                <q-item-label>{{ auth.user?.id }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar><q-icon name="groups" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>角色</q-item-label>
                <q-item-label>
                  <q-chip
                    v-for="r in auth.user?.roles"
                    :key="r"
                    size="sm"
                    color="primary"
                    text-color="white"
                  >
                    {{ r }}
                  </q-chip>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar><q-icon name="event" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label caption>註冊時間</q-item-label>
                <q-item-label>{{ formatDate(auth.user?.createdAt) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-actions class="q-pa-md">
            <q-btn
              outline
              color="primary"
              icon="settings"
              label="帳號設定"
              :to="{ name: 'settings' }"
              no-caps
            />
            <q-space />
            <q-btn
              flat
              color="negative"
              icon="logout"
              label="登出"
              @click="onLogout"
              no-caps
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const auth = useAuthStore()
const router = useRouter()
const $q = useQuasar()

function formatDate(iso?: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('zh-TW')
}

async function onLogout() {
  await auth.logout()
  $q.notify({ type: 'positive', message: '已登出', position: 'top' })
  router.push({ name: 'login' })
}
</script>
