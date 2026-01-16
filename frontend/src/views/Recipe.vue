<template>
  <div>
    <button @click="$router.push('/')">← Retour</button>
    <button @click="$router.push(`/recipe/${recipe.id}/edit`)">Modifier</button>
    <button @click="deleteRecipe" style="color: red">Supprimer</button>

    <div v-if="loading">Chargement...</div>

    <div v-else>
      <h1>{{ recipe.title }}</h1>
      <p>{{ recipe.description }}</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
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
