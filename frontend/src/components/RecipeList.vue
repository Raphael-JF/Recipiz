<template>
  <div>
    <ul class="recipe-list">
      <li v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard :recipe="recipe" />
      </li>
    </ul>
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
