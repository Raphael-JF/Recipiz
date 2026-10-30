import {completeRecipeById} from '../db/creation.js'
import * as utils from '../utils.js'


export default function registerPutRoutes(fastify) {

  // Change a recipe
  fastify.put('/recipes/:id', 
              { preHandler: [utils.requireAuth] },
              utils.dbTransaction(async (req, reply, client) => {

    const recipe = req.body;
    const recipeId = req.params.id;
    const recipeUserId = (await client.query(`
      SELECT owner_id FROM recipes WHERE recipe_id = $1
    `, [recipeId])).rows[0].owner_id;
    
    if (recipeUserId === req.session.userId || req.session.userId == 1) {
      await completeRecipeById(client, recipeId, recipe);
    }
    else {
      reply.code(403);
      return {error : "Not allowed to modify this recipe."}
    }

  }))
}
