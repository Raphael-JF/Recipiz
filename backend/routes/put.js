import {deleteRecipe} from '../db/destruction.js'
import {bindRecipeIngredients, insertRecipeWithIngredients} from '../db/creation.js'
import * as utils from '../utils.js'


export default function registerPutRoutes(fastify) {
  fastify.put('/recipes/:id', utils.dbTransaction(async (req, reply, client) => {
    const recipeId = req.params.id
    const { title, instructions, ingredients } = req.body
    // await deleteRecipe(recipeId);
    // await insertRecipeWithIngredients(client, title, instructions, ingredients);
   await client.query(` 
    UPDATE recipes
    SET title = $1,
        instructions = $2
    WHERE id = $3;
  `, [title, instructions, recipeId]); 
  
  await client.query(`
    DELETE FROM recipe_ingredients
    WHERE recipe_id = $1;
  `, [recipeId]);

  await bindRecipeIngredients(client, recipeId, ingredients) 
  }))
}
