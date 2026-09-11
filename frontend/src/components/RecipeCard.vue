<template>
  <RouterLink class="card" :to="`/recipe/${recipe.id}`">
    <h3>{{ recipe.title }}</h3>
    <p v-if="recipe.temps">{{ recipe.temps }} min</p>
  </RouterLink>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'RecipeCard',
  components: {
    RouterLink
  },
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  display: block;
  text-align: left;
  border: 1px solid #e2e8f0;
  border-radius: 0.9rem;
  background: white;
  padding: 1rem;
  box-shadow: 0 8px 24px -20px rgba(15, 23, 42, 0.35);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.card:hover {
  border-color: #93c5fd;
  transform: translateY(-2px);
}

.card h3 {
  margin: 0;
  color: #0f172a;
}

.card p {
  margin: 0.35rem 0 0;
  color: #64748b;
}
</style>
