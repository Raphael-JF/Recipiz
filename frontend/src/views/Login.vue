<template>
  <main class="login-page">
    <form class="login-form" @submit.prevent="login">
      <h1>Connexion</h1>

      <section>
        <p class="subtitle">Nom d'utilisateur</p>
        <input
          id="username"
          v-model.trim="username"
          type="text"
          autocomplete="username"
          required
          autofocus
        />
        </section>

      <section>
        <p class="subtitle">Mot de passe</p>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />
      </section>

      <p v-if="error" class="error" role="alert">
        {{ error }}
      </p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

    </form>

    <RouterLink to="/register" class="back-link">
      Je n'ai pas de compte
    </RouterLink>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',

  components = {
    
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
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 380px;
}

.subtitle {
  margin-top: 0.5rem;
  margin-bottom: 0.2rem;
  /* opacity: 0.7; */
}


input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.7rem;
  border: 1px solid #888;
  border-radius: 5px;
  font: inherit;
}

button {
  margin-top: 0.5rem;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  background: #356b45;
  color: white;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error {
  margin: 0;
  color: #c62828;
}

.back-link {
  margin-top: 0.5rem;
  text-align: center;
}
</style>
