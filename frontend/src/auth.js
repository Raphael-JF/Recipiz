import { reactive } from 'vue'
import api from '@/services/api'

export const auth = reactive({
  user_data: null,
  loaded: false
})

export async function fetchUser() {
  try {
    const response = await api.get('/auth/me')
    auth.user_data = response.data
  } catch(err) {
    if (err.response?.status === 401) {
      auth.user_data = null
    }
    else {
      throw err
    }
  } finally {
    auth.loaded = true
  }
}
