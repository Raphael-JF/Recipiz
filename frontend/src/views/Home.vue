<template>
  <PageShell>
    <section class="home-header">
      <h1>📖 Mes recettes</h1>
      <button @click="$router.push('/recipe/new')">Ajouter</button>
    </section>

    <SearchBar
      v-model="search"
      placeholder="Rechercher une recette..."
    />

    <p v-if="loading">Chargement...</p>
    <RecipeList
      v-else
      :recipes="filteredRecipes"
      empty-message="Aucune recette trouvée."
    />
  </PageShell>
</template>

<script>
import api from '../services/api'
import PageShell from '../components/PageShell.vue'
import RecipeList from '../components/RecipeList.vue'
import SearchBar from '../components/SearchBar.vue'

export default {
  components: {
    PageShell,
    RecipeList,
    SearchBar
  },
  data() {
    return {
      recipes: [],
      loading: true,
      search: ''
    }
  },
  computed: {
    filteredRecipes() {
      const searchLower = this.search.trim().toLowerCase()
      if (!searchLower) {
        return this.recipes
      }

      return this.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchLower)
      )
    }
  },
  mounted() {
    api.get('/recipes').then((res) => {
      this.recipes = res.data.sort((a, b) => a.title.localeCompare(b.title))
      this.loading = false
    }).catch(() => {
      this.loading = false
      alert('Impossible de charger les recettes')
    })
  }
}
</script>

<style scoped>
.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.home-header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  color: #0f172a;
}
</style>
