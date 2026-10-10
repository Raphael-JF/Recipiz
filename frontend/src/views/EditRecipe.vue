<template>
  <PageShell>
    <h1 v-if="id">Modifier une recette</h1>
    <h1 v-else>Nouvelle recette</h1>

    <p v-if="loading">Chargement...</p>

    <form v-else class="recipe-form" @submit.prevent="save">
      <label>
        <span>Titre</span>
        <input type="text" v-model="recipe.title" placeholder="Titre" required>
      </label>

      <section>
        <h2>Ingrédients</h2>
        
        <EditorList
          v-model="recipe.ingredients"
          :component="IngredientEditorRowComponent"
          :createItem="createEmptyIngredient"
          disableDraggable="true"
        />
      </section>

      <label>
        <span>Instructions</span>
        <textarea placeholder="Instructions" v-model="recipe.instructions"></textarea>
      </label>

      <section class="actions">
        <button type="submit">Enregistrer</button>
        <button type="button" class="secondary" @click="$router.back()">Annuler</button>
      </section>
    </form>
  </PageShell>
</template>

<script>
import api from '../services/api'
import { createEmptyRecipe } from '../models/emptyRecipe'
import { createEmptyIngredient } from '../models/emptyIngredient'
import { markRaw } from 'vue'
import IngredientEditorRow from '../components/IngredientEditorRow.vue'
import PageShell from '../components/PageShell.vue'
import EditorList from '../components/EditorList.vue'

export default {
  components: {
    IngredientEditorRow,
    EditorList,
    PageShell
  },
  props: {
    id: {
      type: String,
    }
  },
  data() {
    return {
      recipe: createEmptyRecipe(),
      IngredientEditorRowComponent: markRaw(IngredientEditorRow),
      loading: true,
    }
  },
  async mounted() {


    if (this.id) {
      await api.get(`/recipes/${this.id}`).then((res) => {
        this.recipe.title = res.data.title
        this.recipe.instructions = res.data.instructions
        // to make the key unique for each ingredient entry, we create a new object for each ingredient
        this.recipe.ingredients = res.data.ingredients.map((ingredient) => {
          let res = createEmptyIngredient()
          res.name = ingredient.name
          res.quantity = ingredient.quantity
          res.unit = ingredient.unit
          return res
        })
      }).catch(() => {
        alert('Recette introuvable')
      })
    }
    this.loading = false
  },
  methods: {
    createEmptyIngredient,

    async save() {
      const id = this.$route.params.id
      const payload = {
        title: this.recipe.title,
        instructions: this.recipe.instructions,
        ingredients: this.recipe.ingredients
      }

      if (this.id) {
        await api.put(`/recipes/${id}`, payload)
        this.$router.back()
      } else {
        await api.post('/recipes/new', payload)
        this.$router.back()
      }
    },
    addIngredient() {
      this.recipe.ingredients.push(createEmptyIngredient())
    },
    updateIngredient(index, updatedIngredient) {
      this.recipe.ingredients.splice(index, 1, updatedIngredient)
    },
    removeIngredient(index) {
      this.recipe.ingredients.splice(index, 1)
    }
  }
}
</script>

<style scoped>
h1 {
  margin-top: 0;
  color: #0f172a;
}

.recipe-form {
  display: grid;
  gap: 1.1rem;
}

label {
  display: grid;
  gap: 0.45rem;
  text-align: left;
  font-weight: 600;
  color: #334155;
}

input,
textarea {
  padding: 0.7rem 0.8rem;
  border-radius: 0.65rem;
  border: 1px solid #cbd5e1;
  font-size: 1rem;
  font-family: inherit;
}

textarea {
  min-height: 180px;
}

.ingredient-grid {
  display: grid;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.actions {
  display: flex;
  gap: 0.6rem;
}
</style>
