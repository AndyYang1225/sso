<template>
  <q-page class="admin-page">
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="col">
        <div class="admin-page-title">商品管理</div>
        <div class="text-grey-7 text-caption">共 {{ admin.productCount }} 項商品</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        :label="$q.screen.gt.xs ? '新增商品' : ''"
        :round="$q.screen.lt.sm"
        no-caps
        @click="openCreate"
      />
    </div>

    <q-card flat bordered>
      <q-card-section class="row q-col-gutter-sm">
        <q-input
          v-model="search"
          placeholder="搜尋商品名稱 / SKU"
          outlined
          dense
          clearable
          class="col-12 col-sm-12 col-md-4"
        >
          <template #prepend><q-icon name="search" /></template>
        </q-input>
        <q-select
          v-model="filterCategory"
          :options="categoryOptions"
          label="分類"
          outlined
          dense
          emit-value
          map-options
          clearable
          class="col-6 col-sm-6 col-md-3"
        />
        <q-select
          v-model="filterStatus"
          :options="statusOptions"
          label="狀態"
          outlined
          dense
          emit-value
          map-options
          clearable
          class="col-6 col-sm-6 col-md-3"
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
              dense
              square
              :color="statusColor(p.row.status)"
              text-color="white"
              :label="statusLabel(p.row.status)"
            />
          </q-td>
        </template>
        <template #body-cell-stock="p">
          <q-td :props="p">
            <span v-if="p.row.stock === 0" class="text-negative text-weight-bold">缺貨</span>
            <span v-else-if="p.row.stock < 10" class="text-warning text-weight-bold">{{ p.row.stock }}</span>
            <span v-else>{{ p.row.stock }}</span>
          </q-td>
        </template>
        <template #body-cell-price="p">
          <q-td :props="p">NT$ {{ p.row.price.toLocaleString() }}</q-td>
        </template>
        <template #body-cell-actions="p">
          <q-td :props="p" class="text-right">
            <q-btn flat dense round icon="edit" color="primary" @click="openEdit(p.row)">
              <q-tooltip>編輯</q-tooltip>
            </q-btn>
            <q-btn flat dense round icon="delete" color="negative" @click="confirmDelete(p.row)">
              <q-tooltip>刪除</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- 新增 / 編輯 對話框 -->
    <q-dialog v-model="dialogOpen" persistent :maximized="$q.screen.lt.sm">
      <q-card class="admin-dialog" style="min-width: 480px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ editing ? '編輯商品' : '新增商品' }}</div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="onSave" class="q-gutter-md">
            <q-input v-model="form.name" label="商品名稱" outlined :rules="[required]" />
            <div class="row q-col-gutter-md">
              <q-input v-model="form.sku" label="SKU" outlined class="col" :rules="[required]" />
              <q-select
                v-model="form.category"
                :options="['音訊','周邊','顯示器','配件','其他']"
                label="分類"
                outlined
                class="col"
                :rules="[required]"
              />
            </div>
            <div class="row q-col-gutter-md">
              <q-input v-model.number="form.price" type="number" label="售價 (NT$)" outlined class="col" :rules="[required]" />
              <q-input v-model.number="form.stock" type="number" label="庫存" outlined class="col" :rules="[required]" />
            </div>
            <q-select
              v-model="form.status"
              :options="statusOptions"
              label="狀態"
              outlined
              emit-value
              map-options
            />
            <div class="text-right">
              <q-btn flat label="取消" v-close-popup no-caps />
              <q-btn type="submit" color="primary" :label="editing ? '儲存' : '建立'" no-caps />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import { useAdminStore } from '@/stores/admin'
import type { Product } from '@/types/admin'
import { required } from '@/utils/validators'

const admin = useAdminStore()
const $q = useQuasar()

const search = ref('')
const filterCategory = ref<string | null>(null)
const filterStatus = ref<string | null>(null)

const categoryOptions = ['音訊', '周邊', '顯示器', '配件', '其他'].map((c) => ({
  label: c, value: c,
}))
const statusOptions = [
  { label: '上架中', value: 'active' },
  { label: '草稿',   value: 'draft' },
  { label: '已下架', value: 'archived' },
]

const cols: QTableColumn<Product>[] = [
  { name: 'id', label: '編號', field: 'id', align: 'left' },
  { name: 'name', label: '商品名稱', field: 'name', align: 'left' },
  { name: 'sku', label: 'SKU', field: 'sku', align: 'left' },
  { name: 'category', label: '分類', field: 'category', align: 'left' },
  { name: 'price', label: '售價', field: 'price', align: 'right', sortable: true },
  { name: 'stock', label: '庫存', field: 'stock', align: 'right', sortable: true },
  { name: 'status', label: '狀態', field: 'status', align: 'center' },
  { name: 'actions', label: '操作', field: 'id', align: 'right' },
]

const filtered = computed(() =>
  admin.products.filter((p) => {
    if (search.value) {
      const q = search.value.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false
    }
    if (filterCategory.value && p.category !== filterCategory.value) return false
    if (filterStatus.value && p.status !== filterStatus.value) return false
    return true
  }),
)

const dialogOpen = ref(false)
const editing = ref<Product | null>(null)
const form = reactive({
  name: '',
  sku: '',
  category: '周邊',
  price: 0,
  stock: 0,
  status: 'active' as Product['status'],
})

function resetForm() {
  form.name = ''
  form.sku = ''
  form.category = '周邊'
  form.price = 0
  form.stock = 0
  form.status = 'active'
}

function openCreate() {
  editing.value = null
  resetForm()
  dialogOpen.value = true
}

function openEdit(row: Product) {
  editing.value = row
  Object.assign(form, {
    name: row.name, sku: row.sku, category: row.category,
    price: row.price, stock: row.stock, status: row.status,
  })
  dialogOpen.value = true
}

function onSave() {
  if (editing.value) {
    admin.updateProduct(editing.value.id, { ...form })
    $q.notify({ type: 'positive', message: '已更新商品' })
  } else {
    admin.addProduct({ ...form })
    $q.notify({ type: 'positive', message: '已新增商品' })
  }
  dialogOpen.value = false
}

function confirmDelete(row: Product) {
  $q.dialog({
    title: '確認刪除',
    message: `確定要刪除「${row.name}」？`,
    cancel: true,
    persistent: true,
    ok: { label: '刪除', color: 'negative', noCaps: true },
  }).onOk(() => {
    admin.removeProduct(row.id)
    $q.notify({ type: 'positive', message: '已刪除' })
  })
}

function statusColor(s: string) {
  return { active: 'positive', draft: 'grey', archived: 'grey-8' }[s] || 'grey'
}
function statusLabel(s: string) {
  return { active: '上架中', draft: '草稿', archived: '已下架' }[s] || s
}
</script>
