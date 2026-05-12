<template>
  <q-layout view="hHh LpR fFf" class="admin-layout">
    <q-header class="admin-header">
      <q-toolbar class="q-px-sm q-px-md-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerOpen = !drawerOpen"
        />
        <q-toolbar-title class="text-weight-bold ellipsis">
          <span class="gradient-text">{{ appName }}</span>
          <q-badge v-if="$q.screen.gt.xs" color="primary" class="q-ml-sm" label="後台" />
        </q-toolbar-title>

        <q-btn flat round dense icon="notifications">
          <q-badge color="negative" floating>3</q-badge>
        </q-btn>

        <q-btn-dropdown flat :no-caps="true" class="q-ml-xs user-dropdown">
          <template #label>
            <q-avatar size="28px" color="primary" text-color="white" :class="$q.screen.gt.xs ? 'q-mr-sm' : ''">
              {{ (auth.user?.username || '?').slice(0, 1).toUpperCase() }}
            </q-avatar>
            <span v-if="$q.screen.gt.xs">{{ auth.user?.username ?? '使用者' }}</span>
          </template>
          <q-list>
            <q-item clickable v-close-popup :to="{ name: 'profile' }">
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>個人資訊</q-item-section>
            </q-item>
            <q-item clickable v-close-popup :to="{ name: 'settings' }">
              <q-item-section avatar><q-icon name="settings" /></q-item-section>
              <q-item-section>帳號設定</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="onLogout">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>登出</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      :width="240"
      :breakpoint="1023"
      bordered
      class="admin-drawer"
    >
      <div class="drawer-brand">
        <q-icon name="storefront" size="28px" class="text-primary" />
        <div>
          <div class="text-weight-bold">商品管理後台</div>
          <div class="text-caption text-grey">Admin Console</div>
        </div>
      </div>

      <q-separator />

      <q-list padding class="admin-nav">
        <q-item-label header class="text-uppercase text-caption">主選單</q-item-label>

        <q-item
          v-for="item in mainNav"
          :key="item.name"
          clickable
          v-ripple
          :to="{ name: item.name }"
          active-class="nav-active"
        >
          <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
          <q-item-section side v-if="item.badge">
            <q-badge :color="item.badgeColor || 'primary'">{{ item.badge }}</q-badge>
          </q-item-section>
        </q-item>

        <q-item-label header class="text-uppercase text-caption q-mt-md">帳號</q-item-label>

        <q-item
          v-for="item in accountNav"
          :key="item.name"
          clickable
          v-ripple
          :to="{ name: item.name }"
          active-class="nav-active"
        >
          <q-item-section avatar><q-icon :name="item.icon" /></q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>

      <div class="drawer-footer">
        <div class="text-caption text-grey">v1.0.0 · demo</div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'

const appName = import.meta.env.VITE_APP_NAME
const auth = useAuthStore()
const admin = useAdminStore()
const router = useRouter()
const $q = useQuasar()
const drawerOpen = ref($q.screen.gt.sm)

const mainNav = computed(() => [
  { name: 'dashboard', label: '儀表板', icon: 'dashboard' },
  {
    name: 'products',
    label: '商品管理',
    icon: 'inventory_2',
    badge: admin.lowStockCount + admin.outOfStockCount || undefined,
    badgeColor: 'warning',
  },
  {
    name: 'orders',
    label: '訂單管理',
    icon: 'receipt_long',
    badge: admin.pendingOrderCount || undefined,
    badgeColor: 'negative',
  },
  { name: 'members', label: '會員管理', icon: 'group' },
])

const accountNav = [
  { name: 'profile', label: '個人資訊', icon: 'person' },
  { name: 'settings', label: '帳號設定', icon: 'settings' },
]

async function onLogout() {
  await auth.logout()
  $q.notify({ type: 'positive', message: '已登出', position: 'top' })
  router.push({ name: 'login' })
}
</script>

<style scoped>
.admin-layout { background: #F9FAFB; }
.admin-header {
  background: #FFFFFF;
  color: #111827;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);
}
.gradient-text {
  background: linear-gradient(135deg, #22D3EE 0%, #A78BFA 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.admin-drawer {
  background: #FFFFFF;
  border-right: 1px solid #E5E7EB;
}
.drawer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px;
}
.drawer-footer {
  position: absolute;
  bottom: 16px;
  left: 0; right: 0;
  text-align: center;
}
.user-dropdown :deep(.q-btn__content) { flex-wrap: nowrap; }
.admin-nav :deep(.q-item) { border-radius: 8px; margin: 2px 8px; }
.admin-nav :deep(.nav-active) {
  background: linear-gradient(135deg, rgba(34,211,238,.12), rgba(167,139,250,.12));
  color: #0891B2;
  font-weight: 600;
}
.admin-nav :deep(.nav-active .q-icon) { color: #0891B2; }

:deep(body.body--dark) .admin-layout { background: #0A0A0F; }
:deep(body.body--dark) .admin-header,
:deep(body.body--dark) .admin-drawer {
  background: #111118;
  color: #E5E7EB;
  border-color: rgba(255,255,255,.08);
}
</style>
