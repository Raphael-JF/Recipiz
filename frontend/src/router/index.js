import { createRouter, createWebHistory } from 'vue-router'
import Recipes from '../views/Recipes.vue'
import EditRecipe from '../views/EditRecipe.vue'
import Recipe from '../views/Recipe.vue'
import Ingredient from '../views/Ingredient.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: "Recipes",
      component: Recipes
    },
    { 
      path: '/recipe/:id',
      name: 'ShowRecipe',
      component: Recipe 
    },
    { 
      path: '/recipe/:id/edit', 
      name: 'EditRecipe', 
      component: EditRecipe,
      props: route => ({
        id: route.params.id,
      })
    },
    { 
      path: '/recipe/new', 
      name: 'NewRecipe', 
      component: EditRecipe,
      props: {
        id: null,
      }
    },
    // { path: '/ingredients',
    //   name: 'Ingredients',
    //   component: Ingredients
    // },
    { path: '/ingredients/:id', 
      name: 'ShowIngredient', 
      component: Ingredient 
    }
  ]
})
