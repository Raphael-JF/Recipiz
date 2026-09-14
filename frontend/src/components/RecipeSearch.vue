<template>
  <div class="recipe-search">

    <input
      v-model="search"
      type="text"
      placeholder="Rechercher une recette..."
    >

    <!-- Suggestions -->
    <div v-if="search && suggestions.length" class="suggestions">
      <button
        v-for="recipe in suggestions"
        :key="recipe.id"
        @click="selectRecipe(recipe)"
      >
        {{ recipe.title }}
      </button>
    </div>

    <!-- Résultats -->
    <div v-if="search">
      <RecipeCard
        v-for="recipe in results"
        :key="recipe.id"
        :recipe="recipe"
      />

      <p v-if="!results.length">
        Aucune recette trouvée.
      </p>
    </div>

  </div>
</template>

<script>
import RecipeCard from './RecipeCard.vue'
import Fuse from 'fuse.js'

export default {
  name: 'RecipeSearch',

  components: {
    RecipeCard
  },

  props: {
    recipes: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      search: ''
    }
  },

  computed: {
    fuse() {
      return new Fuse(this.recipes, {
        keys: ['title'],
        threshold: 0.4
      })
    },

    results() {
      if (!this.search.trim()) {
        return []
      }

      return this.fuse
        .search(this.search)
        .map(result => result.item)
    },

    suggestions() {
      return this.results.slice(0, 5)
    }
  },

  methods: {
    selectRecipe(recipe) {
      this.search = recipe.title
    }
  }
}
</script>
