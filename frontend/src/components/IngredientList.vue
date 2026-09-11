<template>
  <ul class="ingredient-list">
    <li v-for="ingredient in ingredients" :key="ingredient.id ?? ingredient.name" class="ingredient-item">
      <RouterLink
        v-if="linkIngredients && ingredient.id"
        class="ingredient-link"
        :to="`/ingredients/${ingredient.id}`"
      >
        {{ ingredient.name }}
      </RouterLink>
      <span v-else>{{ ingredient.name }}</span>
      <span class="ingredient-meta" v-if="ingredient.quantity || ingredient.unit">
        : {{ ingredient.quantity }} {{ ingredient.unit }}
      </span>
    </li>
  </ul>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'IngredientList',
  components: { RouterLink },
  props: {
    ingredients: {
      type: Array,
      default: () => []
    },
    linkIngredients: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.ingredient-list {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.25rem;
}

.ingredient-item {
  color: #334155;
}

.ingredient-link {
  color: #1d4ed8;
  font-weight: 600;
}

.ingredient-meta {
  color: #64748b;
}
</style>
