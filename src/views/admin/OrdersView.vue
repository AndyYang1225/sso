<template>
  <q-page class="admin-page">
    <div class="admin-page-title q-mb-xs">訂單管理</div>
    <div class="text-grey-7 text-caption q-mb-md">共 {{ admin.orders.length }} 筆訂單</div>

    <q-card flat bordered>
      <q-card-section class="row q-col-gutter-sm">
        <q-input
          v-model="search"
          placeholder="搜尋訂單編號 / 客戶"
          outlined
          dense
          clearable
          class="col-12 col-md-4"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <q-select
          v-model="filterStatus"
          :options="statusOptions"
          label="狀態"
          outlined
          dense
          emit-value
          map-options
          clearable
          class="col-6 col-md-3"
        />
      </q-card-section>
      <q-separator />
      <q-table
        :rows="filtered"
        :columns="cols"
        row-key="id"
        flat
        :rows-per-page-options="[10, 20, 50]"
      >
        <template #body-cell-status="p">
          <q-td :props="p">
            <q-chip
              dense square
              :color="statusColor(p.row.status)"
              text-color="white"
              :label="statusLabel(p.row.status)"
            />
          </q-td>
        </template>
        <template #body-cell-total="p">
          <q-td :props="p" class="text-right text-weight-medium">
            NT$ {{ p.row.total.toLocaleString() }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAdminStore } from '@/stores/admin'
import type { QTableColumn } from 'quasar'
import type { Order } from '@/types/admin'

const admin = useAdminStore()
const search = ref('')
const filterStatus = ref<string | null>(null)

const statusOptions = [
  { label: '待付款', value: 'pending' },
  { label: '已付款', value: 'paid' },
  { label: '已出貨', value: 'shipped' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]

const cols: QTableColumn<Order>[] = [
  { name: 'id', label: '訂單編號', field: 'id', align: 'left' },
  { name: 'customer', label: '客戶', field: 'customer', align: 'left' },
  { name: 'items', label: '品項數', field: 'items', align: 'right' },
  { name: 'total', label: '金額', field: 'total', align: 'right', sortable: true },
  { name: 'status', label: '狀態', field: 'status', align: 'center' },
  { name: 'createdAt', label: '建立時間', field: 'createdAt', align: 'left', sortable: true },
]

const filtered = computed(() =>
  admin.orders.filter((o) => {
    if (search.value) {
      const q = search.value.toLowerCase()
      if (!o.id.toLowerCase().includes(q) && !o.customer.toLowerCase().includes(q)) return false
    }
    if (filterStatus.value && o.status !== filterStatus.value) return false
    return true
  }),
)

function statusColor(s: string) {
  return { pending: 'warning', paid: 'info', shipped: 'primary', completed: 'positive', cancelled: 'grey' }[s] || 'grey'
}
function statusLabel(s: string) {
  return { pending: '待付款', paid: '已付款', shipped: '已出貨', completed: '已完成', cancelled: '已取消' }[s] || s
}
</script>
