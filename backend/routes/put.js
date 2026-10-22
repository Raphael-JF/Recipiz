import {deleteRecipe} from '../db/destruction.js'
import {bindRecipeIngredients, bindRecipeInstructions} from '../db/creation.js'
import * as utils from '../utils.js'


export default function registerPutRoutes(fastify) {

  // Change a recipe
  fastify.put('/recipes/:id', utils.dbTransaction(async (req, reply, client) => {
    let {title, description, ingredients, instructions} = req.body;
    instructions = instructions.map((obj) => (obj.text));
    const recipeId = req.params.id;
   await client.query(` 
    UPDATE recipes
    SET title = $1, description = $2
    WHERE recipe_id = $3;
  `, [title, description, recipeId]); 
  
  let r1 = client.query(`
    DELETE FROM recipe_ingredients
    WHERE recipe_id = $1;
  `, [recipeId]);
  
  let r2 = client.query(`
    DELETE FROM recipe_instructions
    WHERE recipe_id = $1;
  `, [recipeId]);

  await Promise.all([r1, r2]);

  r1 = bindRecipeIngredients(client, recipeId, ingredients) 
  r2 = bindRecipeInstructions(client, recipeId, instructions) 

  await Promise.all([r1, r2]);
  }))
}
