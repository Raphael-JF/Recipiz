import {deleteRecipe} from '../db/destruction.js'
import * as utils from '../utils.js'

export default function registerDeleteRoutes(fastify) {
    
  fastify.delete('/recipes/:id',
                                { preHandler: [utils.requireAuth] },
                                utils.dbTransaction(async (req, reply, client) => {
    const recipeId = req.params.id;

    const recipeUserId = (await client.query(`
      SELECT owner_id FROM recipes WHERE recipe_id = $1
    `, [recipeId])).rows[0].owner_id;
    
    if (recipeUserId === req.session.userId || req.session.userId == 1) {
      await deleteRecipe(client, recipeId);
    }
    else {
      reply.code(403);
      return {error : "Not allowed to delete this recipe."}
    }
  }))
}
