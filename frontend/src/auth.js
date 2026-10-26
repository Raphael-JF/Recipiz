import { reactive } from 'vue'
import api from '@/services/api'

export const auth = reactive({
  user: null,
  loaded: false
})

export async function fetchUser() {
  try {
    const response = await api.get('/auth/me')
    console.log('User fetched:', response.data)
    auth.user = response.data.user
  } catch(err) {
    console.log(err)
    auth.user = null
  } finally {
    auth.loaded = true
  }
}
