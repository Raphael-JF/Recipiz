import {deleteRecipe} from '../db/destruction.js'
import * as utils from '../utils.js'

export default function registerDeleteRoutes(fastify) {
    
  fastify.delete('/recipes/:id', async (req, reply) => { 
    const { id } = req.params
    await deleteRecipe(id);
  })
}
