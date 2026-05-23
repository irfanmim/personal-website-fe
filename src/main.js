import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { vReveal } from './directives/vReveal.js'

const app = createApp(App)
app.use(router)
app.directive('reveal', vReveal)
app.mount('#app')
