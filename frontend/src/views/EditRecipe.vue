<template>
  <h1 v-if="id">Modifier une recette</h1>
  <h1 v-else>Nouvelle recette</h1>

  <div class="draft-actions">
    <button
      type="button"
      class="secondary"
      :disabled="!draftAvailable"
      @click="loadDraft"
    >
      Récupérer le brouillon
    </button>
  </div>

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
      <button type="button" class="secondary" @click="$router.push(`/recipe/${id}`)">Annuler</button>
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
      draftAvailable: false,
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
    
    const draft = sessionStorage.getItem(
     `recipeDraft:${this.$route.fullPath}`
    )

    this.draftAvailable = draft !== null
    this.loading = false
  },

  watch: {
    recipe: {
      handler() {
        if (!this.loading) {
          this.saveDraft()
        }
      },
      deep: true
    }
  },
  
  methods: {
    createEmptyIngredient,
    createEmptyInstruction,

    async save() {
      const key = `recipeDraft:${this.$route.fullPath}`
      const id = this.$route.params.id

      if (this.id) {
        await api.put(`/recipes/${id}`, this.recipe)
        sessionStorage.removeItem(key)
        this.$router.push(`/recipe/${this.id}`)
      } else {
        await api.post('/recipes/new', this.recipe)
        sessionStorage.removeItem(key)
        this.$router.push('/')
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

    loadDraft() {
      const draft = sessionStorage.getItem(
        `recipeDraft:${this.$route.fullPath}`
      )

      if (!draft) {
        this.draftAvailable = false
        return
      }

      try {
        this.recipe = JSON.parse(draft)
        this.draftAvailable = false
      } catch {
        sessionStorage.removeItem(
          `recipeDraft:${this.$route.fullPath}`
        )
        this.draftAvailable = false
      }
    },


    saveDraft() {
      const key = `recipeDraft:${this.$route.fullPath}`

      sessionStorage.setItem(key, JSON.stringify(this.recipe))
      this.draftAvailable = true
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
