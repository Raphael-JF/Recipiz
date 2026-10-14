import {pool} from './pool.js'

async function getMatchingThings(table, column, searchTerm, limit) {
  const res = await pool.query(
    `
    SELECT ${column}
    FROM ${table}
    WHERE ${column} ILIKE '%' || $1 || '%'
       OR similarity(${column}, $1) > 0.2
    ORDER BY
      CASE
        WHEN ${column} ILIKE '%' || $1 || '%' THEN 0
        ELSE 1
      END,
      similarity(${column}, $1) DESC
    LIMIT $2;
    `,
    [searchTerm, limit]
  )
  return res.rows
}

export async function getMatchingRecipes(searchTerm, limit) {
  return getMatchingThings('recipes', 'title', searchTerm, limit)
}

export async function getMatchingIngredients(searchTerm, limit) {
  return getMatchingThings('ingredients', 'name', searchTerm, limit)
}


export async function getRecipesPage(search, page, pageSize) {
  const offset = (page - 1) * pageSize
  let res = undefined

  if (search.length == 0) {
    res = await pool.query(
      `SELECT recipe_id, title, COUNT(*) OVER() AS total_count
       FROM recipes
       ORDER BY title
       LIMIT $1
       OFFSET $2`,
      [pageSize, offset]
    )
  }
  else if (search.length <= 3 ) {
    res = await pool.query(
      `SELECT recipe_id, title, COUNT(*) OVER() AS total_count
       FROM recipes
       WHERE title ILIKE $1
       ORDER BY title
       LIMIT $2
       OFFSET $3`,
      [`%${search}%`, pageSize, offset]    
    )
  }
  else {
    res = await pool.query(
      `SELECT recipe_id, title, COUNT(*) OVER() AS total_count
       FROM recipes
       WHERE title % $1
       ORDER BY similarity(title, $1) DESC
       LIMIT $2
       OFFSET $3`,
      [search, pageSize, offset]
    )
  }

  return {
    recipes: res.rows.map(({ total, ...recipe }) => recipe),
    totalPages: res.rows.total_count , 
  }
}

export async function getOneRecipePage(client, recipeId) {

  const recipeInfo = await client.query(
    `SELECT title
     FROM recipes
     WHERE id = $1`,
    [recipeId]
  )

  if (recipeInfo.rows.length === 0) {
    return  null;
  }

  const { title, instructions } = recipeInfo.rows[0]

  const instructionsRes = await client.query(
    `SELECT text
    FROM recipe_instructions
    JOIN recipes USING (recipe_id)
    WHERE recipe_id = $1
    ORDER BY step`,
    [recipeId]
  )


  const res = await pool.query(
    `SELECT
      ingredient_id,
      name,
      quantity,
      unit
    FROM recipes
    JOIN recipe_ingredients USING recipe_id
    JOIN ingredients USING ingredient_id    
    WHERE ingredient_id = $1; 
    `, [recipeId])
  
  return {
    id: recipeId,
    title: title,
    instructions: instructions,
    ingredients: res.rows.map(row => ({
      id: row.ingredient_id,
      name: row.name,
      quantity: row.quantity,
      unit: row.unit
    })),
    instructions: instructionsRes.rows.map(row => row.text)
  }
}
