<template>
  <div class="theme-switcher">
    <div class="theme-switcher__label">選擇風格</div>
    <div class="theme-switcher__options">
      <button
        v-for="t in themes"
        :key="t.key"
        type="button"
        class="theme-chip"
        :class="{ active: current === t.key }"
        :title="t.label"
        @click="setTheme(t.key)"
      >
        <q-icon :name="t.icon" size="16px" />
        <span class="theme-chip__label">{{ t.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { current, themes, setTheme } = useTheme()
</script>

<style scoped>
.theme-switcher {
  position: relative;
  z-index: 2;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.theme-switcher__label {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  opacity: 0.8;
}
.theme-switcher__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.theme-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: var(--card-blur);
  -webkit-backdrop-filter: var(--card-blur);
  transition: all 0.2s ease;
}
.theme-chip:hover {
  color: var(--text);
  border-color: var(--primary-soft);
  transform: translateY(-1px);
}
.theme-chip.active {
  color: var(--btn-text);
  background: var(--btn-bg);
  border-color: transparent;
  box-shadow: var(--btn-shadow);
}
.theme-chip__label {
  white-space: nowrap;
}
@media (max-width: 480px) {
  .theme-chip__label { display: none; }
  .theme-chip { padding: 8px 10px; }
}
</style>
