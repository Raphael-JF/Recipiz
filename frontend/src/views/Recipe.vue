<template>
  <div>
    <header>
      <button @click="$router.back()">Retour</button>

      <div>
        <h1>{{ recipe.title }}</h1>
        <p>{{ recipe.description }}</p>
      </div>
    </header>

    <div v-if="loading">Chargement...</div>

    <main v-else>
      <section>
        <h2>Ingrédients</h2>
        <ul>
          <li v-for="i in recipe.ingredients" :key="i.name">
            {{ i.quantity }} {{ i.name }}
          </li>
        </ul>
      </section>

      <section>
        <h2>Instructions</h2>
        <ol>
          <li v-for="(step, idx) in recipe.instructions" :key="idx">
            {{ step }}
          </li>
        </ol>
      </section>
    </main>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()

    const recipe = {
      title: 'Chargement...',
      description: '',
      ingredients: [],
      instructions: []
    }

    return { route, recipe }
  },

  data() {
    return {
      loading: true,
      recipe: {}
    }
  },

  mounted() {
    const id = this.$route.params.id

    // Simulation backend
    setTimeout(() => {
      this.recipe = {
        title: 'Pâtes carbo',
        description: 'Une recette simple et efficace',
        ingredients: [
          { name: 'Pâtes', quantity: '200g' },
          { name: 'Lardons', quantity: '150g' }
        ],
        instructions: [
          'Faire cuire les pâtes',
          'Faire revenir les lardons',
          'Mélanger'
        ]
      }
      this.loading = false
    }, 500)
  }
}
</script>
