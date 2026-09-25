<template>
  <div class="recipe-search">
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher une recette..."
    >

    <!-- Suggestions -->
    <ul v-if="search && suggestions.length" class="suggestions-list">
      <li
        v-for="recipe in suggestions"
        :key="recipe.id"
        @click="selectRecipe(recipe)"
      >
        {{ recipe.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import Fuse from 'fuse.js'

export default {
  name: 'RecipeSearch',

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


 <style>
  .suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #dfe2e5;
    max-height: 300px;
    overflow-y: auto;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .suggestions-list li {
    padding: 8px 16px;
    cursor: pointer;
  }

  .suggestions-list li:hover {
    background-color: #f7f7f7;
  }
</style>

