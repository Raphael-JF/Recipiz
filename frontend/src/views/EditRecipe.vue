<template>
    <div>
        <h1>Modifier la recette</h1>
        
        <div v-if="loading">Chargement...</div>
        
        <form v-else @submit.prevent="save">
            <h1><input type="text" v-model="newRecipe.title" caption="titre" required></h1>
            <h2>Ingrédients</h2>
                <div v-for="(ing, i) in newRecipe.ingredients" :key="i">
                    <input v-model="ing.name" placeholder="Ingrédient">
                    <input v-model="ing.quantity" type="number">
                    <input v-model="ing.unit" placeholder="g, ml, pièces">
                    <button @click="removeIngredient(i)">❌</button>
                </div>
                <button @click="addIngredient">➕ ingrédient</button>
                
            <h2>Instructions</h2>
            <!-- <MarkdownRenderer v-if="newRecipe?.instructions" :content="newRecipe.instructions"/> -->
            <textarea placeholder="Instructions" v-model="newRecipe.instructions"></textarea>
            
            
            

            <br/>
            <button type="submit">Enregistrer</button>
            <button type="button" @click="$router.back()">Annuler</button>
            </form>
    </div>
</template>

<script>
import api from '../services/api'
import { createEmptyRecipe } from '../models/emptyRecipe'
import { createEmptyIngredient } from '../models/emptyIngredient';

export default {
    data() {
        return {
            newRecipe: createEmptyRecipe(),
            loading: true
        }
    },
    mounted() {
        const id = this.$route.params.id
        console.log(id)
        if (this.$route.name !== 'recipe-new') {
            api.get(`/recipes/${id}`).then(res => {
                this.newRecipe.title = res.data.title
                this.newRecipe.instructions = res.data.instructions
                this.newRecipe.ingredients = res.data.ingredients
            })
        } else {
            this.newRecipe = createEmptyRecipe()
        }
        this.loading = false

    },

    methods: {
        async save() {
            const id = this.$route.params.id

            if (id === 'new') {
                await api.post('/recipes/new', {
                    title: this.newRecipe.title,
                    instructions: this.newRecipe.instructions,
                    ingredients: this.newRecipe.ingredients,
                })
                this.$router.push('/')
            } else {
                await api.put(`/recipes/${id}`, {
                    title: this.newRecipe.title,
                    instructions: this.newRecipe.instructions,
                    ingredients: this.newRecipe.ingredients,
                })
                this.$router.push(`/recipe/${id}`)
            }
        },

        addIngredient() {
            this.newRecipe.ingredients.push(createEmptyIngredient())
        },
        removeIngredient(index) {
            this.newRecipe.ingredients.splice(index, 1)
        }

    }
}
</script>
