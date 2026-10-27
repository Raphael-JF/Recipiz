import { reactive } from 'vue'
import api from '@/services/api'

export const auth = reactive({
  user_data: null,
  loaded: false
})

export async function fetchUser() {
  try {
    const response = await api.get('/auth/me')
    console.log('User fetched:', response.data)
    auth.user_data = response.data
  } catch(err) {
    console.log(err)
    auth.user_data = null
  } finally {
    auth.loaded = true
  }
}
