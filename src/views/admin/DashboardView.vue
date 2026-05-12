<template>
  <q-page class="admin-page">
    <div class="admin-page-title q-mb-xs">儀表板</div>
    <div class="text-grey-7 q-mb-md">歡迎回來，{{ auth.user?.username }}！以下是今日營運概況。</div>

    <!-- 統計卡 -->
    <div class="row q-col-gutter-sm q-col-gutter-md-md q-mb-md">
      <div v-for="s in stats" :key="s.label" class="col-6 col-md-3">
        <q-card class="stat-card" flat bordered>
          <q-card-section class="row items-center no-wrap">
            <div class="col stat-info">
              <div class="text-caption text-grey-7 ellipsis">{{ s.label }}</div>
              <div class="stat-value text-weight-bold q-mt-xs">{{ s.value }}</div>
              <div class="text-caption" :class="s.trend.startsWith('+') ? 'text-positive' : 'text-negative'">
                {{ s.trend }} 較上週
              </div>
            </div>
            <q-avatar :color="s.color" text-color="white" class="stat-avatar">
              <q-icon :name="s.icon" size="22px" />
            </q-avatar>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 近期訂單 + 熱銷商品 -->
    <div class="row q-col-gutter-sm q-col-gutter-md-md">
      <div class="col-12 col-md-7">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-h6">近期訂單</div>
            <q-space />
            <q-btn flat dense no-caps label="查看全部" :to="{ name: 'orders' }" color="primary" />
          </q-card-section>
          <q-separator />
          <q-table
            :rows="admin.orders.slice(0, 5)"
            :columns="orderCols"
            row-key="id"
            flat
            hide-bottom
            :pagination="{ rowsPerPage: 5 }"
          >
            <template #body-cell-status="p">
              <q-td :props="p">
                <q-chip dense square :color="statusColor(p.row.status)" text-color="white" :label="statusLabel(p.row.status)" />
              </q-td>
            </template>
            <template #body-cell-total="p">
              <q-td :props="p">NT$ {{ p.row.total.toLocaleString() }}</q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="col-12 col-md-5">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">熱銷商品 Top 5</div>
            <div class="text-caption text-grey-7">依銷量排序</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="(p, i) in top5" :key="p.id">
              <q-item-section avatar>
                <q-avatar :color="rankColor(i)" text-color="white">{{ i + 1 }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ p.name }}</q-item-label>
                <q-item-label caption>{{ p.category }} · SKU {{ p.sku }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="text-weight-bold">NT$ {{ p.price.toLocaleString() }}</div>
                <div class="text-caption text-grey-7">庫存 {{ p.stock }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import type { QTableColumn } from 'quasar'

const auth = useAuthStore()
const admin = useAdminStore()

const stats = computed(() => [
  { label: '商品總數', value: admin.productCount, trend: '+2', icon: 'inventory_2', color: 'primary' },
  { label: '本月營收', value: 'NT$ ' + admin.revenue.toLocaleString(), trend: '+12.4%', icon: 'payments', color: 'positive' },
  { label: '待處理訂單', value: admin.pendingOrderCount, trend: '+1', icon: 'pending_actions', color: 'warning' },
  { label: '低庫存警示', value: admin.lowStockCount + admin.outOfStockCount, trend: '-3', icon: 'warning', color: 'negative' },
])

const top5 = computed(() =>
  [...admin.products].sort((a, b) => b.price - a.price).slice(0, 5),
)

const orderCols: QTableColumn[] = [
  { name: 'id', label: '訂單編號', field: 'id', align: 'left' },
  { name: 'customer', label: '客戶', field: 'customer', align: 'left' },
  { name: 'total', label: '金額', field: 'total', align: 'right' },
  { name: 'status', label: '狀態', field: 'status', align: 'center' },
  { name: 'createdAt', label: '建立時間', field: 'createdAt', align: 'left' },
]

function statusColor(s: string) {
  return { pending: 'warning', paid: 'info', shipped: 'primary', completed: 'positive', cancelled: 'grey' }[s] || 'grey'
}
function statusLabel(s: string) {
  return { pending: '待付款', paid: '已付款', shipped: '已出貨', completed: '已完成', cancelled: '已取消' }[s] || s
}
function rankColor(i: number) {
  return ['amber-8', 'blue-grey-5', 'orange-8', 'grey-6', 'grey-6'][i] || 'grey-6'
}
</script>

<style scoped>
.stat-card { border-radius: 12px; }
.stat-info { min-width: 0; }
.stat-value {
  font-size: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-avatar { width: 40px; height: 40px; font-size: 14px; }
@media (min-width: 600px) {
  .stat-value { font-size: 24px; }
  .stat-avatar { width: 48px; height: 48px; }
}
</style>
