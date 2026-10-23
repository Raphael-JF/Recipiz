<template>
  <h1 v-if="id">Modifier une recette</h1>
  <h1 v-else>Nouvelle recette</h1>

  <p v-if="loading">Chargement...</p>

  <form v-else class="recipe-form" @submit.prevent="save">
    <section>
      <h2>Titre</h2>
      <input type="text" v-model="recipe.title" placeholder="Titre" required>
    </section>

    <section>
      <h2>Tags</h2>
      <EditorList
        v-model="recipe.tags"
        :component="TagEditorRowComponent"
        @new-item="addTag"
        :disableDraggable="true"
      />
    </section>

    <section>
      <h2>Description</h2>
      <AutoResizeTextarea placeholder="Description" v-model="recipe.description"></AutoResizeTextarea>
    </section>

    <section>
      <h2>Ingrédients</h2>
      <EditorList
        v-model="recipe.ingredients"
        :component="IngredientEditorRowComponent"
        @new-item="addIngredient"
        :disableDraggable="true"
      />
    </section>

    <section>
      <h2>Instructions</h2>
       <EditorList
        v-model="recipe.instructions"
        :component="InstructionEditorRowComponent"
        @new-item="addInstruction"
      />
    </section>
    
    <section class="actions">
      <button type="submit">Enregistrer</button>
      <button type="button" class="secondary" @click="$router.back()">Annuler</button>
    </section>
  </form>
</template>

<script>
import api from '../services/api'
import { createEmptyRecipe } from '../models/emptyRecipe'
import { createEmptyIngredient } from '../models/emptyIngredient'
import { createEmptyInstruction } from '../models/emptyInstruction'
import { createEmptyTag } from '../models/emptyTag'
import { markRaw } from 'vue'
import IngredientEditorRow from '../components/IngredientEditorRow.vue'
import EditorList from '../components/EditorList.vue'
import InstructionEditorRow from '../components/InstructionEditorRow.vue'
import AutoResizeTextarea from '../components/AutoResizeTextarea.vue'
import TagEditorRow from '../components/TagEditorRow.vue'

export default {
  components: {  
    AutoResizeTextarea,
    EditorList,
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
      InstructionEditorRowComponent: markRaw(InstructionEditorRow),
      TagEditorRowComponent: markRaw(TagEditorRow),
      loading: true,
    }
  },
  async mounted() {

    if (this.id) {
      await api.get(`/recipes/${this.id}`).then((res) => {
        this.recipe = res.data
      }).catch(() => {
        alert('Recette introuvable')
      })
    }
    this.loading = false
  },

  
  methods: {
    createEmptyIngredient,
    createEmptyInstruction,

    async save() {
      const id = this.$route.params.id

      if (this.id) {
        await api.put(`/recipes/${id}`, this.recipe)
        this.$router.back()
      } else {
        await api.post('/recipes/new', this.recipe)
        this.$router.back()
      }
    },
    addIngredient() {
      this.recipe.ingredients.push(createEmptyIngredient())
    },
    addTag() {
      this.recipe.tags.push(createEmptyTag())
    },
    
    addInstruction() { 
      let temp = createEmptyInstruction()
      temp.key = this.recipe.instructions.length
      this.recipe.instructions.push(temp)
    },
  }
}
</script>

<style scoped>
h1 {
  margin-top: 0;
  color: #0f172a;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

label {
  display: grid;
  gap: 0.45rem;
  text-align: left;
  font-weight: 600;
  color: #334155;
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
