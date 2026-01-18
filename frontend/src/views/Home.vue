<template>
  <main>
    <h1>📖 Recettes 📖</h1>
    <button @click="$router.push(`/recipe/new`)">Ajouter</button>

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
    <ul>
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
            recipes: [],
            loading: true,
            search: '',
        }
    },

    computed: {
        filteredRecipes() {
            return this.recipes.filter(r =>
                r.title.toLowerCase().includes(this.search.toLowerCase())
            )
        }
    },
    methods: {
    }, 

    mounted() {
        api.get('/recipes').then(res => {
            this.recipes = res.data
            // sort alphabetically by title
            this.recipes.sort((a, b) =>
                a.title.localeCompare(b.title)
            )
            this.loading = false
        })
    }
}

</script>
