<template>
  <div>
    <h1>Recipiz 🍲</h1>

    <RecipeCard
      v-for="r in recettes"
      :key="r.id"
      :recette="r"
    />
  </div>
</template>

<script>
import RecipeCard from '../components/RecipeCard.vue'

export default {
  components: {
    RecipeCard
  },
  data() {
    return {
      recettes: [
        { id: 1, nom: 'Pâtes carbo', temps: 20 },
        { id: 2, nom: 'Riz curry', temps: 30 }
      ]
    }
  }
}
</script>
