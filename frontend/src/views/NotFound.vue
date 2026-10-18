<template>
  <div class="not-found">
    <h1>404</h1>
    <p>La page que vous recherchez n'existe pas.</p>
    <router-link to="/">Retour à l'accueil</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
  font-family: Arial, sans-serif;
}
.not-found h1 {
  font-size: 5rem;
  margin-bottom: 0.5rem;
}
.not-found p {
  font-size: 1.5rem;
}
</style>
