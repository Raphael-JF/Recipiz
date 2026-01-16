<template>
  <main>
    <h1>📖 Recettes 📖</h1>

    <!-- Barre de recherche -->
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher une recette..."
    />

    <!-- Spinner -->
    <div v-if="loading">
      Chargement...
    </div>

    <!-- Liste -->
    <ul v-else>
      <li v-for="r in filteredRecipes" :key="r.id">
        <router-link :to="`/recipe/${r.id}`">
          {{ r.title }}
        </router-link>
      </li>
    </ul>
  </main>
</template>

<script>
import api from '../services/api'
export default {
    data() {
        return {
            loading: true,
            search: '',
            recipes: []
        }
    },

    computed: {
        filteredRecipes() {
            return this.recipes.filter(r =>
                r.title.toLowerCase().includes(this.search.toLowerCase())
            )
        }
    },

    mounted() {
        api.get('/recipes').then(res => {
            this.recipes = res.data
            this.loading = false
        })
    }
}
</script>
