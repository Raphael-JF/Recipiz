<template>
  <div>
    <h1>Modifier la recette</h1>

    <div v-if="loading">Chargement...</div>

    <form v-else @submit.prevent="save">
      <input
        type="text"
        v-model="title"
        required
      />

      <textarea
        v-model="description"
      ></textarea>

      <button type="submit">Enregistrer</button>
      <button type="button" @click="$router.back()">Annuler</button>
    </form>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      loading: true,
      title: '',
      description: ''
    }
  },

  mounted() {
    const id = this.$route.params.id

    api.get(`/recipes/${id}`).then(res => {
      this.title = res.data.title
      this.description = res.data.description
      this.loading = false
    })
  },

  methods: {
    async save() {
      const id = this.$route.params.id

      await api.put(`/recipes/${id}`, {
        title: this.title,
        description: this.description
      })

      this.$router.push(`/recipe/${id}`)
    }
  }
}
</script>
