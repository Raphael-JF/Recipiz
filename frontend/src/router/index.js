// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/recipe/:id', component: () => import('../views/Recipe.vue') },
    { path: '/recipe/:id/edit', component: () => import('../views/EditRecipe.vue')
}

  ]
})
