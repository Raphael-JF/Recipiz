import { createRouter, createWebHistory } from 'vue-router'
import { auth, fetchUser } from '@/auth'
import Recipes from '../views/Recipes.vue'
import EditRecipe from '../views/EditRecipe.vue'
import Recipe from '../views/Recipe.vue'
// import Ingredient from '../views/Ingredient.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path : '/register',
      component: Register
    },
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
        id: route.params.id
      }),
      meta: { 
        requiresAuth: true, 
        authRedirect: to => `/recipe/${to.params.id}`
      }
    },
    {
      path: '/recipe/new',
      name: 'NewRecipe',
      component: EditRecipe,
      props: {
        id: null
      },
      meta: { requiresAuth: true }
    },
    // { path: '/ingredients',
    //   name: 'Ingredients',
    //   component: Ingredients
    // },
    // { path: '/ingredients/:id', 
    //   name: 'ShowIngredient', 
    //   component: Ingredient 
    // }
  ]
})


router.beforeEach(async (to) => {
  // Restaurer la session au premier accès
  if (!auth.loaded) {
    await fetchUser()
  }

  // Vérifier si la route nécessite une connexion
  if (to.meta.requiresAuth && !auth.user_data) {
    return {
      name: 'Login',
      query: {
        redirect: to.meta.authRedirect ? to.meta.authRedirect(to) : to.fullPath
      }
    }
  }
})

export default router
