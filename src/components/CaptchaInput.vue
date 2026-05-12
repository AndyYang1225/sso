<template>
  <q-input
    v-model="typed"
    label="驗證碼"
    outlined
    maxlength="4"
    :rules="[required, match]"
    lazy-rules
    hint="點擊圖片可更換驗證碼"
  >
    <template #prepend><q-icon name="verified_user" /></template>
    <template #append>
      <canvas
        ref="canvasRef"
        :width="width"
        :height="height"
        class="captcha-canvas"
        @click="refresh"
        :title="'點擊更換'"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{ length?: number; width?: number; height?: number }>(),
  { length: 4, width: 110, height: 40 },
)

const typed = defineModel<string>({ default: '' })

const canvasRef = ref<HTMLCanvasElement | null>(null)
const code = ref('')

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generate() {
  code.value = Array.from(
    { length: props.length },
    () => CHARS[rnd(0, CHARS.length - 1)],
  ).join('')
}

function draw() {
  const cvs = canvasRef.value
  if (!cvs) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return

  const w = cvs.width
  const h = cvs.height

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${rnd(100, 200)},${rnd(100, 200)},${rnd(100, 200)},0.6)`
    ctx.fillRect(rnd(0, w), rnd(0, h), 2, 2)
  }

  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `rgba(${rnd(50, 150)},${rnd(50, 150)},${rnd(50, 150)},0.5)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(rnd(0, w), rnd(0, h))
    ctx.lineTo(rnd(0, w), rnd(0, h))
    ctx.stroke()
  }

  const chars = code.value.split('')
  const step = w / (chars.length + 1)
  chars.forEach((ch, i) => {
    ctx.save()
    ctx.font = 'bold 22px "Segoe UI", sans-serif'
    ctx.fillStyle = `rgb(${rnd(0, 100)},${rnd(0, 100)},${rnd(0, 120)})`
    const x = step * (i + 1)
    const y = h / 2 + 8 + rnd(-3, 3)
    ctx.translate(x, y)
    ctx.rotate((rnd(-25, 25) * Math.PI) / 180)
    ctx.fillText(ch, -8, 0)
    ctx.restore()
  })
}

function refresh() {
  typed.value = ''
  generate()
  draw()
}

function required(v: string) {
  return (v !== null && v !== undefined && v !== '') || '請輸入驗證碼'
}

function match(v: string) {
  return (v ?? '').trim().toUpperCase() === code.value || '驗證碼錯誤'
}

onMounted(() => {
  generate()
  draw()
})

defineExpose({ refresh })
</script>

<style scoped>
.captcha-canvas {
  cursor: pointer;
  border-radius: 4px;
  user-select: none;
}
</style>
