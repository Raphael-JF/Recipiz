import registerRecipeGetRoutes from './recipes.js'
import registerIngredientGetRoutes from './ingredients.js'

export default function registerGetRoutes(fastify) {
  registerRecipeGetRoutes(fastify)
  registerIngredientGetRoutes(fastify)
}
