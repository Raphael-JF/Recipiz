import {completeRecipeById} from '../db/creation.js'
import * as utils from '../utils.js'


export default function registerPutRoutes(fastify) {

  // Change a recipe
  fastify.put('/recipes/:id', utils.dbTransaction(async (req, reply, client) => {

    let recipe = req.body;
    const recipeId = req.params.id;

    await completeRecipeById(client, recipeId, recipe);
  }))
}
