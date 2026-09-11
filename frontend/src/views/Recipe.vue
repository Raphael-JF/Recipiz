<template>
  <PageShell>
    <section class="actions">
      <button class="secondary" @click="$router.push('/')">← Retour</button>
      <button class="secondary" @click="$router.push(`/recipe/${$route.params.id}/edit`)">Modifier</button>
      <button class="danger" @click="deleteRecipe">Supprimer</button>
    </section>

    <p v-if="loading">Chargement...</p>

    <section v-else class="recipe-sheet">
      <h1>{{ recipe.title }}</h1>

      <h2>Ingrédients</h2>
      <IngredientList :ingredients="recipe.ingredients" link-ingredients />

      <h2>Instructions</h2>
      <MarkdownRenderer v-if="recipe?.instructions" :content="recipe.instructions" />
    </section>
  </PageShell>
</template>

<script>
import api from '../services/api'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import IngredientList from '../components/IngredientList.vue'
import PageShell from '../components/PageShell.vue'

export default {
  components: {
    MarkdownRenderer,
    IngredientList,
    PageShell
  },
  data() {
    return {
      recipe: null,
      loading: true
    }
  },
  methods: {
    async deleteRecipe() {
      if (!confirm('Supprimer cette recette ?')) return

      const id = this.$route.params.id
      await api.delete(`/recipes/${id}`)
      this.$router.push('/')
    }
  },
  mounted() {
    const id = this.$route.params.id

    api.get(`/recipes/${id}`).then((res) => {
      this.recipe = res.data
      this.loading = false
    }).catch(() => {
      this.loading = false
      alert('Recette introuvable')
    })
  }
}
</script>

<style scoped>
.actions {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
}

.recipe-sheet h1 {
  margin-top: 0;
  color: #0f172a;
}

.recipe-sheet h2 {
  margin: 1.35rem 0 0.5rem;
  color: #1e293b;
}
</style>
