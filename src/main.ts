import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import { Quasar, Notify, Dialog, Loading } from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import 'quasar/src/css/index.sass'
import '@/styles/app.scss'

import App from './App.vue'
import router from './router'
import { initTheme } from '@/composables/useTheme'

initTheme()

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)

app.use(Quasar, {
  plugins: { Notify, Dialog, Loading },
  config: {
    dark: 'auto',
    brand: {
      primary: '#22D3EE',
      secondary: '#A78BFA',
      accent: '#D946EF',
      dark: '#0A0A0F',
      'dark-page': '#0A0A0F',
    },
    notify: {
      position: 'top',
      timeout: 2500,
    },
  },
})

app.use(pinia)
app.use(router)

app.mount('#app')
