<template>
  <PageShell>
    <h1>{{ isNewRecipe ? 'Créer une recette' : 'Modifier la recette' }}</h1>

    <p v-if="loading">Chargement...</p>

    <form v-else class="recipe-form" @submit.prevent="save">
      <label>
        <span>Titre</span>
        <input type="text" v-model="newRecipe.title" placeholder="Titre" required>
      </label>

      <section>
        <h2>Ingrédients</h2>
        <datalist id="ingredient-options">
          <option v-for="ingredient in ingredientOptions" :key="ingredient.id" :value="ingredient.name" />
        </datalist>

        <div class="ingredient-grid">
          <IngredientEditorRow
            v-for="(ingredient, index) in newRecipe.ingredients"
            :key="index"
            :ingredient="ingredient"
            datalist-id="ingredient-options"
            @update="updateIngredient(index, $event)"
            @remove="removeIngredient(index)"
          />
        </div>

        <button type="button" class="secondary" @click="addIngredient">➕ ingrédient</button>
      </section>

      <label>
        <span>Instructions</span>
        <textarea placeholder="Instructions" v-model="newRecipe.instructions"></textarea>
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
import IngredientEditorRow from '../components/IngredientEditorRow.vue'
import PageShell from '../components/PageShell.vue'

export default {
  components: {
    IngredientEditorRow,
    PageShell
  },
  props: {
    id: {
      type: String,
    }
  },
  data() {
    return {
      newRecipe: createEmptyRecipe(),
      ingredientOptions: [],
      loading: true,
      isNewRecipe: false
    }
  },
  async mounted() {

    const ingredientPromise = api.get('/ingredients').then((res) => {
      this.ingredientOptions = res.data
    }).catch(() => {
      this.ingredientOptions = []
    })

    if (this.id) {
      await api.get(`/recipes/${this.id}`).then((res) => {
        this.newRecipe.title = res.data.title
        this.newRecipe.instructions = res.data.instructions
        this.newRecipe.ingredients = res.data.ingredients
      }).catch(() => {
        alert('Recette introuvable')
      })
    } else {
      this.newRecipe = createEmptyRecipe()
    }

    await ingredientPromise
    this.loading = false
  },
  methods: {
    async save() {
      const id = this.$route.params.id
      const payload = {
        title: this.newRecipe.title,
        instructions: this.newRecipe.instructions,
        ingredients: this.newRecipe.ingredients
      }

      if (this.isNewRecipe) {
        await api.post('/recipes/new', payload)
        this.$router.push('/')
      } else {
        await api.put(`/recipes/${id}`, payload)
        this.$router.push(`/recipe/${id}`)
      }
    },
    addIngredient() {
      this.newRecipe.ingredients.push(createEmptyIngredient())
    },
    updateIngredient(index, updatedIngredient) {
      this.newRecipe.ingredients.splice(index, 1, updatedIngredient)
    },
    removeIngredient(index) {
      this.newRecipe.ingredients.splice(index, 1)
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
