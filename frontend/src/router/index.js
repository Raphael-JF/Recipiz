import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import EditRecipe from '../views/EditRecipe.vue'
import Recipe from '../views/Recipe.vue'
import Ingredient from '../views/Ingredient.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/recipe/:id', component: Recipe },
    { path: '/recipe/:id/edit', name: 'recipe-edit', component: EditRecipe },
    { path: '/recipe/new', name: 'recipe-new', component: EditRecipe },
    { path: '/ingredients/:id', name: 'ingredient', component: Ingredient }
  ]
})
