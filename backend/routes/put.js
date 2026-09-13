import * as db from '../db.js'
import * as utils from '../utils.js'


export default function registerPutRoutes(fastify) {
  fastify.put('/recipes/:id', utils.templateAlterRoute(async (req, reply, client) => {
    const recipeId = req.params.id
    const { title, instructions, ingredients } = req.body
    console.log('PUT /recipes/:id', recipeId, title, instructions, ingredients);
    await db.deleteRecipe(client, recipeId);
    await db.insertRecipe(client, title, instructions);
  }))
}
