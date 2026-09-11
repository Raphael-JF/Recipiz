<template>
  <PageShell>
    <button class="secondary" @click="$router.back()">← Retour</button>

    <p v-if="loading">Chargement...</p>

    <section v-else>
      <h1>🧂 {{ ingredient.name }}</h1>
      <h2>Recettes liées</h2>

      <ul v-if="ingredient.recipes?.length" class="linked-recipes">
        <li v-for="recipe in ingredient.recipes" :key="recipe.id">
          <RouterLink :to="`/recipe/${recipe.id}`">{{ recipe.title }}</RouterLink>
        </li>
      </ul>
      <p v-else>Aucune recette liée pour le moment.</p>
    </section>
  </PageShell>
</template>

<script>
import { RouterLink } from 'vue-router'
import api from '../services/api'
import PageShell from '../components/PageShell.vue'

export default {
  name: 'IngredientView',
  components: {
    RouterLink,
    PageShell
  },
  data() {
    return {
      ingredient: null,
      loading: true
    }
  },
  mounted() {
    api.get(`/ingredients/${this.$route.params.id}`).then((res) => {
      this.ingredient = res.data
      this.loading = false
    }).catch(() => {
      this.loading = false
      alert('Ingrédient introuvable')
      this.$router.push('/')
    })
  }
}
</script>

<style scoped>
.linked-recipes {
  display: grid;
  gap: 0.35rem;
  padding-left: 1rem;
}
</style>
