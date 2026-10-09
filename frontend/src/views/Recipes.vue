<template>
  <section class="home-header">
    <h1>📖 Mes recettes</h1>
    <button @click="$router.push('/recipe/new')">Ajouter</button>
  </section> 

  <section class="search-bar">
    <SearchBar 
       ref="SearchBar"
       apiURL = "/matchingRecipes"
       placeholder="Rechercher une recette..."
       className="recipe-search-bar"
       @search="getRecipesPage"
    />
  </section>
  
  <section class="recipe-list">
    <div class="item-list">
      <p v-if="loading">Chargement...</p>
      <p v-else-if="!recipes.length">Aucune recette trouvée</p>
      <RecipeCard 
        v-else 
        v-for="(recipe, index) in recipes" 
        :key="index" 
        :id="recipe.id"
        :title="recipe.title" 
      />
    </div>
    
    <!-- Ajout du composant PageSelector pour la pagination -->
    <PageSelector
      v-if="totalPages > 1"
      :current-page="page"
      :total-pages="totalPages"
      :has-next-page="hasNextPage"
      @page-change="updatePage"
    />
  </section>
</template>

<script>
import { markRaw } from 'vue'
import api from '../services/api'
import PageShell from '../components/PageShell.vue'
import SearchBar from '../components/SearchBar.vue'
import RecipeCard from '../components/RecipeCard.vue'
import PageSelector from '../components/PageSelector.vue'

export default {
  components: {
    PageShell,
    RecipeCard,
    SearchBar,
    PageSelector,
  },
  data() {
    return {
      recipes: [],
      totalPages: 0,
      hasNextPage: false,
      loading: true,
      RecipeCardComponent: markRaw(RecipeCard),
      search: '',
      page: 1,
    }
  },
methods: {
    updatePage(pageNum) {
      this.page = pageNum;
      this.getRecipesPage(this.search);
    },

    getRecipesPage(search) {
      this.search = search;
      api.get('/recipes', {
        params: {
          search: this.search,
          page: this.page
        }
      }).then((res) => {
        this.recipes = res.data.recipes;
        this.totalPages = res.data.totalPages;
        this.hasNextPage = this.page < this.totalPages;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
        alert('Impossible de charger les recettes');
      });
    },
  },
  mounted() {
    this.$refs.SearchBar.focus()
  }
}
</script>

<style scoped>
section.home-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

section.home-header h1 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2rem);
  color: #0f172a;
}

section.search-bar {
  width: 75%;
}

section.recipe-list {
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>
