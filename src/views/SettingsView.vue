<template>
  <q-page class="admin-page">
    <div class="row q-col-gutter-md justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">帳號設定</div>
            <div class="text-caption text-grey-7">管理您的個人資訊與安全</div>
          </q-card-section>

          <q-separator />

          <q-list>
            <q-item clickable v-ripple @click="editing = 'profile'">
              <q-item-section avatar><q-icon name="person" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>基本資料</q-item-label>
                <q-item-label caption>修改使用者名稱與頭像</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="editing = 'password'">
              <q-item-section avatar><q-icon name="lock" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>變更密碼</q-item-label>
                <q-item-label caption>定期更新以確保帳號安全</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="editing = '2fa'">
              <q-item-section avatar><q-icon name="verified_user" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>兩步驟驗證</q-item-label>
                <q-item-label caption>提升帳號安全性</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="editing = 'sessions'">
              <q-item-section avatar><q-icon name="devices" color="primary" /></q-item-section>
              <q-item-section>
                <q-item-label>已登入裝置</q-item-label>
                <q-item-label caption>查看並管理使用中的工作階段</q-item-label>
              </q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-ripple class="text-negative" @click="confirmDelete = true">
              <q-item-section avatar><q-icon name="delete_forever" color="negative" /></q-item-section>
              <q-item-section>
                <q-item-label>刪除帳號</q-item-label>
                <q-item-label caption>此動作無法復原</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="confirmDelete">
      <q-card style="min-width: 320px">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="32px" />
          <span class="q-ml-md text-h6">確定要刪除帳號？</span>
        </q-card-section>
        <q-card-section>
          此動作將永久刪除您的資料，且無法復原。
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" v-close-popup no-caps />
          <q-btn color="negative" label="確認刪除" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog :model-value="!!editing" @update:model-value="editing = null">
      <q-card style="min-width: 320px">
        <q-card-section>
          <div class="text-h6">功能開發中</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          「{{ editingLabel }}」功能尚未實作，後端 API 就緒後即可啟用。
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="關閉" v-close-popup no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type EditingKey = 'profile' | 'password' | '2fa' | 'sessions' | null

const editing = ref<EditingKey>(null)
const confirmDelete = ref(false)

const labels: Record<string, string> = {
  profile: '基本資料',
  password: '變更密碼',
  '2fa': '兩步驟驗證',
  sessions: '已登入裝置',
}
const editingLabel = computed(() => (editing.value ? labels[editing.value] : ''))
</script>
