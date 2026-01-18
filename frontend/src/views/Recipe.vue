<template>
  <div>
    <button @click="$router.push('/')">← Retour</button>
    <button @click="$router.push(`/recipe/${recipe.id}/edit`)">Modifier</button>
    <button @click="deleteRecipe" style="color: red">Supprimer</button>

    <div v-if="loading">Chargement...</div>

    <div v-else>
      <h1>{{ recipe.title }}</h1>
      <h2>Ingrédients</h2>
        <ul>
            <li v-for="(ing, i) in recipe.ingredients" :key="i">
            {{ ing.name }} : {{ ing.quantity }} {{ ing.unit }}
            </li>
        </ul>
        <h2>Instructions</h2>
        <MarkdownRenderer v-if="recipe?.instructions" :content="recipe.instructions"/>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'


export default {
    components: {
        MarkdownRenderer
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
        
        api.get(`/recipes/${id}`).then(res => {
            this.recipe = res.data
            this.loading = false
        }).catch(() => {
            this.loading = false
            alert('Recette introuvable')
        })
    }
}
</script>
