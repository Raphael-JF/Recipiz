import * as db from '../db.js'
import * as utils from '../utils.js'

export default function registerDeleteRoutes(fastify) {
    
  fastify.delete('/recipes/:id', utils.templateAlterRoute(async (req, reply, client) => { 
    const { id } = req.params
    await db.deleteRecipe(client, id);
  }))
}
