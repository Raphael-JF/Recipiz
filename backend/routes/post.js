import {insertRecipeWithIngredients} from '../db/creation.js'
import * as utils from '../utils.js'

export default function registerPostRoutes(fastify) { 
  fastify.post('/recipes/new', utils.dbTransaction(async (req, reply, client) => {
    const { title, instructions, ingredients } = req.body
    await insertRecipeWithIngredients(client, title, instructions, ingredients); 
  })
)}
