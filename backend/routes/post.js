import * as db from '../db.js'
import * as utils from '../utils.js'

export default function registerPostRoutes(fastify) { 
  fastify.post('/recipes/new', utils.templateAlterRoute(async (req, reply, client) => {
    const { title, instructions, ingredients } = req.body
    await db.insertRecipeWithIngredients(client, title, instructions, ingredients); 
  })
)}
