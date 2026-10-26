<template>
  <p v-if="loading">Chargement...</p>
  <div v-else class="recipe-view">
    <section class="actions">
      <button id="back" class="secondary" @click="$router.push('/')">← Retour</button>
      <button class="secondary" @click=editRecipe>Modifier</button>
      <button class="danger" @click="deleteRecipe">Supprimer</button>
    </section>

    <section>
      <h1>{{ recipe.title }}</h1>
      
      <div class="tags">
        <a v-for="(tag, index) in recipe.tags" 
          :key="index"
          :href="`/tag/${tag.tag_id}`"
        >
          {{ tag.name }}
        </a>
      </div>
    </section>
    
    <section>
      <p v-if="recipe.description">&laquo <i>{{ recipe.description }}</i> &raquo</p>
      <p v-else><i>Aucune description fournie</i></p>
    </section>

    <section>
      <h2>Ingrédients</h2>
      <IngredientList :ingredients="recipe.ingredients" link-ingredients />
    </section>

    <section>
      <h2>Instructions</h2>
      <p v-if="!recipe.instructions">Aucune instruction fournie</p>
      <ul v-else>
        <li v-for="(instruction, index) in recipe.instructions" :key="index">
          {{ instruction.text }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import api from '../services/api'
import IngredientList from '../components/IngredientList.vue'

export default {
  components: {
    IngredientList,
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
    },
    async editRecipe() {
        const id = this.$route.params.id
        await api.get('/auth/me', {
          redirectTo: `/recipe/${id}/edit`
        })
        this.$router.push(`/recipe/${id}/edit`)
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

.recipe-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

#back {
  self-align: flex-start;
}

.actions {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 0.6rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tags a {
  background-color: #e2e8f0;
  color: #1e293b;
  padding: 0.2rem 0.5rem;
  border-radius: 50rem;
  text-decoration: none;
}

.tags a:hover {
  background-color: #cbd5e1;
}

 h1 {
  margin-top: 0;
  color: #0f172a;
}

h2 {
  color: #1e293b;
}
</style>
