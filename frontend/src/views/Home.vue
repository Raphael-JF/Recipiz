<template>
  <main>
    <h1>📖 Recettes 📖</h1>

    <!-- Barre de recherche -->
    <input
      type="text"
      v-model="search"
      placeholder="Rechercher une recette..."
    />

    <!-- Spinner -->
    <div v-if="loading">
      Chargement...
    </div>

    <!-- Liste -->
    <ul>
        <li v-for="r in filteredRecipes" :key="r.id">
            <router-link :to="`/recipe/${r.id}`">
            {{ r.title }}
            </router-link>
        </li>
    </ul>

    <form @submit.prevent="addRecipe">
        <input
            type="text"
            placeholder="Titre"
            v-model="newTitle"
            required
        />

        <textarea
            placeholder="Description"
            v-model="newDescription"
        ></textarea>

        <button type="submit">Ajouter</button>
    </form>

  </main>
</template>

<script>
import api from '../services/api'
export default {
    data() {
        return {
            recipes: [],
            loading: true,
            search: '',
            newTitle: '',
            newDescription: ''
        }
    },

    computed: {
        filteredRecipes() {
            return this.recipes.filter(r =>
                r.title.toLowerCase().includes(this.search.toLowerCase())
            )
        }
    },
    methods: {
        async addRecipe() {
        const res = await api.post('/recipes', {
            title: this.newTitle,
            description: this.newDescription
        })

        // ajout immédiat côté front
        this.recipes.push(res.data)
        this.recipes.sort((a, b) =>
                a.title.localeCompare(b.title)
        )

        // reset formulaire
        this.newTitle = ''
        this.newDescription = ''
        }
    },

    mounted() {
        api.get('/recipes').then(res => {
            this.recipes = res.data
            // sort alphabetically by title
            this.recipes.sort((a, b) =>
                a.title.localeCompare(b.title)
            )
            this.loading = false
        })
    }
}

</script>
