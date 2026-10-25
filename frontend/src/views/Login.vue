<template>
  <div class="login-form">
    <UserForm
      @submit="login"
      :title="'Connexion'"
    />
    <RouterLink to="/register" class="link">
      Je n'ai pas de compte
    </RouterLink>
  </div>
</template>

<script>
import axios from 'axios'
import UserForm from '../components/UserForm.vue'

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
      loading: false
    }
  },

  methods: {
    async login() {
      if (this.loading) return

      this.loading = true
      this.error = ''

      try {
        await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        })


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
.login-form {
 display: flex;
 flex-direction: column;
 gap : 1rem;
}


.link {
  text-align: center;
}
</style>
