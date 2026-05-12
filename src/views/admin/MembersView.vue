<template>
  <q-page class="admin-page">
    <div class="admin-page-title q-mb-xs">會員管理</div>
    <div class="text-grey-7 text-caption q-mb-md">共 {{ admin.members.length }} 位會員</div>

    <q-card flat bordered>
      <q-table
        :rows="admin.members"
        :columns="cols"
        row-key="id"
        flat
        :rows-per-page-options="[10, 20, 50]"
      >
        <template #body-cell-name="p">
          <q-td :props="p">
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar :color="levelColor(p.row.level)" text-color="white" size="32px">
                {{ p.row.name.slice(0, 1) }}
              </q-avatar>
              <div>
                <div class="text-weight-medium">{{ p.row.name }}</div>
                <div class="text-caption text-grey-7">{{ p.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>
        <template #body-cell-level="p">
          <q-td :props="p">
            <q-chip
              dense square
              :color="levelColor(p.row.level)"
              text-color="white"
              :label="levelLabel(p.row.level)"
            />
          </q-td>
        </template>
        <template #body-cell-totalSpent="p">
          <q-td :props="p" class="text-right text-weight-medium">
            NT$ {{ p.row.totalSpent.toLocaleString() }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/stores/admin'
import type { QTableColumn } from 'quasar'
import type { Member } from '@/types/admin'

const admin = useAdminStore()

const cols: QTableColumn<Member>[] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'name', label: '會員', field: 'name', align: 'left' },
  { name: 'level', label: '等級', field: 'level', align: 'center' },
  { name: 'totalSpent', label: '累積消費', field: 'totalSpent', align: 'right', sortable: true },
  { name: 'joinedAt', label: '加入日期', field: 'joinedAt', align: 'left', sortable: true },
]

function levelColor(l: string) {
  return { bronze: 'orange-8', silver: 'blue-grey-5', gold: 'amber-8', vip: 'purple' }[l] || 'grey'
}
function levelLabel(l: string) {
  return { bronze: '銅牌', silver: '銀牌', gold: '金牌', vip: 'VIP' }[l] || l
}
</script>
