import {pool} from './pool.js'

export async function deleteRecipe(recipeId) {
  await pool.query(
    `DELETE FROM recipes WHERE recipe_id = $1`,
    [recipeId]
  )
}


