import {insertCompleteRecipe} from '../db/creation.js'
import * as utils from '../utils.js'

export default function registerPostRoutes(fastify) { 

  // Add a new recipe
  fastify.post('/recipes/new', utils.dbTransaction(async (req, reply, client) => {
    await insertCompleteRecipe(client, req.body); 
  })
)}
