import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'  
import { fetchUser } from './auth'

async function init() {
  await fetchUser()

  createApp(App)
    .use(router)
    .mount('#app')
}

init()
