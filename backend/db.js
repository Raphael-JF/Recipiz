import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
  user: process.env.RECIPIZ_DB_USER ?? 'recipiz',
  host: process.env.RECIPIZ_DB_HOST ?? 'localhost',
  database: process.env.RECIPIZ_DB_NAME ?? 'recipiz',
  password: process.env.RECIPIZ_DB_PASSWORD,
  port: Number(process.env.RECIPIZ_DB_PORT ?? 5432)
})


// =============== creation =================


// returns the id of the newly inserted recipe
export async function insertRecipe(client, title, instructions) {
  const recipeRes = await client.query(
    `INSERT INTO recipes (title, instructions)
     VALUES ($1, $2)
     RETURNING id`,
    [title, instructions]
  )

  return recipeRes.rows[0].id
}

// returns the id of the ingredient, whether it was newly inserted or already existed
export async function upsertIngredient(client, ingredientName) {
  const ingredientRes = await client.query(
    `INSERT INTO ingredients (name)
     VALUES ($1)
     ON CONFLICT (name)
     DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [ingredientName]
  )

  return ingredientRes.rows[0].id
}

export async function bindRecipeIngredient(client, recipeId, ingredientId, quantity, unit) {
  await client.query(
    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
     VALUES ($1, $2, $3, $4)`,
    [recipeId, ingredientId, quantity, unit]
  )
}   

export async function insertRecipeWithIngredients(client, title, instructions, ingredients) {
  const recipeId = await insertRecipe(client, title, instructions)
  for (const { name, quantity, unit } of ingredients) {
    const ingredientId = await upsertIngredient(client, name)
    await bindRecipeIngredient(client, recipeId, ingredientId, quantity, unit)
  }
}

// ================ destruction ============

export async function unbindRecipeIngredient(client, recipeId, ingredientId) {
  await client.query(
    `DELETE FROM recipe_ingredients WHERE recipe_id = $1 AND ingredient_id = $2`,
    [recipeId, ingredientId]
  )
}

export async function deleteRecipe(client, recipeId) {
  await client.query(
    `DELETE FROM recipes WHERE id = $1`,
    [recipeId]
  )
}


// ==================== retrieval =================
export async function getMatchingRecipes(client, searchTerm, limit) {
  const res = await client.query(
    `SELECT title, similarity(title, $1) AS score
     FROM recipes
     WHERE title % $1
     ORDER BY score DESC
     LIMIT $2`,
    [searchTerm, limit]
  )
  return res.rows
}


export async function getRecipesPage(search, page, pageSize) {
  const offset = (page - 1) * pageSize

  if (search.length == 0) {
    const res = await client.query(
      `SELECT *,
              COUNT(*) OVER() AS total
       FROM recipes
       ORDER BY title
       LIMIT $1
       OFFSET $2`,
      [pageSize, offset]
    )
  }
  else if (search.length < 2 ) {
    const res = await client.query(
      `SELECT *,
              COUNT(*) OVER() AS total
       FROM recipes
       WHERE title ILIKE $1
       ORDER BY title
       LIMIT $1
       OFFSET $2`,
      [pageSize, offset]
    )
  }
  else {
    const res = await client.query(
      `SELECT *,
              COUNT(*) OVER() AS total
       FROM recipes
       WHERE title % $1
       ORDER BY similarity(title, $1) DESC
       LIMIT $2
       OFFSET $3`,
      [search, pageSize, offset]
    )
  }

  return {
    recipes: res.rows,
    total: res.rows.length,
  }
}
