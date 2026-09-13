import * as db from '../db.js'
import * as utils from '../utils.js'

export default function registerPostRoutes(fastify) { 
  fastify.post('/recipes/new', utils.templateAlterRoute(async (req, reply, client) => {
    const { title, instructions, ingredients } = req.body
    const recipeId = await db.insertRecipe(client, title, instructions)
    for (const ingredient of ingredients) {
      const ingredientName = utils.normalizeIngredientName(ingredient.name)
      const ingredientId = await db.upsertIngredient(client, ingredientName)
      await db.bindRecipeIngredient(client, recipeId, ingredientId, ingredient.quantity, ingredient.unit)
    }
  })
)}
