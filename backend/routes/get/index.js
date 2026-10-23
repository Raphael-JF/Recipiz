import registerRecipeGetRoutes from './recipes.js'
import registerIngredientGetRoutes from './ingredients.js'
import regsterTagGetRoutes from './tags.js'

export default function registerGetRoutes(fastify) {
  registerRecipeGetRoutes(fastify)
  registerIngredientGetRoutes(fastify)
  regsterTagGetRoutes(fastify)
}
