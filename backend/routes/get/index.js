import registerRecipeGetRoutes from './recipes.js'
import registerIngredientGetRoutes from './ingredients.js'
import registerTagGetRoutes from './tags.js'

export default function registerGetRoutes(fastify) {
  registerRecipeGetRoutes(fastify)
  registerIngredientGetRoutes(fastify)
  registerTagGetRoutes(fastify)
}
