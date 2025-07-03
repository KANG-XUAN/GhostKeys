import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'   // ← 這行必須有
// Bootstrap CSS & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')
