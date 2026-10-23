import {pool} from './pool.js'

// Delete a recipe and all associated data from the database (thanks to ON DELETE CASCADE in the schema)
export async function deleteRecipe(recipeId) {
  await pool.query(
    `DELETE FROM recipes WHERE recipe_id = $1`,
    [recipeId]
  )
}

// Delete all associated data for a recipe without deleting the recipe itself
export async function resetRecipe(recipeId) {
  let r1 = pool.query(
    `DELETE FROM recipe_ingredients WHERE recipe_id = $1`,
    [recipeId]
  )
  let r2 = pool.query(
    `DELETE FROM recipe_instructions WHERE recipe_id = $1`,
    [recipeId]
  )
  let r3 = pool.query(
    `DELETE FROM recipe_tags WHERE recipe_id = $1`,
    [recipeId]
  )
  await Promise.all([r1, r2, r3])
}


