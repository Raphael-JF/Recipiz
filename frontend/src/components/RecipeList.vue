<template>
  <div>
    <ul v-if="recipes.length" class="recipe-list">
      <li v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard :recipe="recipe" />
      </li>
    </ul>

    <p v-else class="recipe-list__empty">{{ emptyMessage }}</p>
  </div>
</template>

<script>
import RecipeCard from './RecipeCard.vue'

export default {
  name: 'RecipeList',
  components: { RecipeCard },
  props: {
    recipes: {
      type: Array,
      default: () => []
    },
    emptyMessage: {
      type: String,
      default: 'Aucune recette trouvée.'
    }
  }
}
</script>

<style scoped>
.recipe-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.8rem;
}

.recipe-list__empty {
  color: #64748b;
}
</style>
