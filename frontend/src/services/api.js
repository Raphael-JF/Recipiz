import router from '@/router'
import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})


api.interceptors.response.use(
  response => response,
  error => {
    const url = error.config?.url

    if (
      error.response?.status === 401 &&
      !url?.includes('/auth/login') &&
      !url?.includes('/auth/register')
    ) {
      router.push({
        path: '/login',
        query: {
          redirect:
            error.config?.redirectTo ??
            router.currentRoute.value.fullPath
        }
      })
    }

    return Promise.reject(error)
  }
)

export default api
