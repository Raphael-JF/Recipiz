<template>
  <section class="home-header">
    <h1>📖 Mes recettes</h1>
    <button @click="$router.push('/recipe/new')">Ajouter</button>
  </section> 

  <section class="search-bar">
    <SearchBar 
       ref="SearchBar"
       :items="recipes" 
       :keys="['title']"
       apiURL = "/matchingRecipes"
       placeholder="Rechercher une recette..."
       @search="getRecipesPage"
    />
  </section>
  
  <section class="recipe-list">
    <RecipeList :recipes="recipes" :loading="loading" />
  </section>
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
    SearchBar,
  },
  data() {
    return {
      recipes: [],
      loading: true,
      search: '',
      page: 1,
    }
  },
  methods: {
    getRecipesPage(search) {
      this.search = search
      api.get('/recipes', {
        params: {
          search: this.search,
          page: this.page
        }
      }).then((res) => {
        this.recipes = res.data.recipes 
        this.loading = false
      }).catch(() => {
        this.loading = false
        alert('Impossible de charger les recettes')
      }) 
      return 
    }
  },
  mounted() {
    this.$refs.SearchBar.focus()
  }
}
</script>

<style scoped>
section.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4vh;
  margin-top: 4vh;
}

section.home-header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  color: #0f172a;
}

section.search-bar {
  width: 40%;
  margin-bottom: 8vh;

}

</style>
