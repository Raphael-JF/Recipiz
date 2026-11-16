<template>
  <div id="form">
    <UserForm
      @submit="register"
      :title="'Inscription'"
      :buttonText="'S\'inscrire'"
    />
    <RouterLink
      :to="{
        path: '/login',
        query: { redirect: $route.query.redirect }
      }"
      class="link"
    >
      J'ai déjà un compte
    </RouterLink>

    <div class="message"  >
      <p> <b>Information</b></p>
      <p>Pour votre sécurité, les mots de passe ne sont jamais stockés en clair dans la base de données.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import UserForm from '../components/UserForm.vue'

export default {
  name: 'Register',

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
    async register({ username, password }) {
      if (this.loading) return

      this.loading = true
      this.error = ''

      try {
        await axios.post('/api/auth/register', {
          username: username,
          password: password
        })

        // ===== if the user was doing something that requires authentication this parts allow to get back to it
        const redirect = this.$route.query.redirect
        this.$router.push(
          typeof redirect === 'string' &&
          redirect.startsWith('/') &&
          !redirect.startsWith('//')
            ? redirect
            : '/login'
        // =================
        )
      } catch (err) {
        if (err.response?.status === 409) {
          this.error = 'Nom d’utilisateur déjà utilisé.'
        } else {
          this.error = 'Impossible de se connecter au serveur.'
        }
      } finally {
        this.loading = false
      }
    },
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


.message {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  padding: 0rem 1rem;
  border-radius: 5px;
  margin-top: 1rem;
}
</style>
