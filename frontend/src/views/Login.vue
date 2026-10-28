<template>
  <div id="form">
    <UserForm
      @submit="login"
      :title="$route.query.redirect ? 'Connexion requise': 'Connexion'"
      :buttonText="'Se connecter'"
    />
    <RouterLink
      :to="{
        path: '/register',
        query: { redirect: $route.query.redirect }
      }"
      class="link"
    >
      Je n'ai pas de compte
    </RouterLink>

  </div>
</template>

<script>
import axios from 'axios'
import UserForm from '../components/UserForm.vue'
import { auth } from '../auth'

export default {
  name: 'Login',

  components : {
    UserForm 
  }, 

  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false,
      auth: auth
    }
  },

  methods: {
    async login({ username, password }) {
      if (this.loading) return

      this.loading = true
      this.error = ''

      try {
        const response = await axios.post('/api/auth/login', {
          username: username,
          password: password
        })
        
        this.auth.user_data = response.data

        // ===== if the user was doing something that requires authentication this parts allow to get back to it
        const redirect = this.$route.query.redirect

        this.$router.push(
          typeof redirect === 'string' &&
          redirect.startsWith('/') &&
          !redirect.startsWith('//')
            ? redirect
            : '/'
        // =================
        )
      } catch (err) {
        if (err.response?.status === 401) {
          this.error = 'Nom d’utilisateur ou mot de passe incorrect.'
        } else {
          this.error = 'Impossible de se connecter au serveur.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap : 1rem;
  width : 100%;
  align-self: center;
  max-width: 380px;
}

.link {
  text-align: center;
}
</style>
