import {pool} from './pool.js'


export async function getMatchingRecipes(searchTerm, limit) {
  const res = await pool.query(
    `
    SELECT title
    FROM recipes
    WHERE title ILIKE '%' || $1 || '%'
       OR similarity(title, $1) > 0.2
    ORDER BY
      CASE
        WHEN title ILIKE '%' || $1 || '%' THEN 0
        ELSE 1
      END,
      similarity(title, $1) DESC
    LIMIT $2;
    `,
    [searchTerm, limit]
  )
  return res.rows
}


export async function getRecipesPage(search, page, pageSize) {
  const offset = (page - 1) * pageSize
  let res = undefined

  if (search.length == 0) {
    res = await pool.query(
      `SELECT id, title, COUNT(*) OVER() AS total_count
       FROM recipes
       ORDER BY title
       LIMIT $1
       OFFSET $2`,
      [pageSize, offset]
    )
  }
  else if (search.length <= 3 ) {
    res = await pool.query(
      `SELECT id, title, COUNT(*) OVER() AS total_count
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
      `SELECT id, title, COUNT(*) OVER() AS total_count
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
    totalPages: Math.ceil(res.rows[0].total_count / pageSize), 
  }
}

export async function getOneRecipePage(client, recipeId) {

  const recipeInfo = await client.query(
    `SELECT title, instructions
     FROM recipes
     WHERE id = $1`,
    [recipeId]
  )
  if (recipeInfo.rows.length === 0) {
    return  null;
  }
  const { title, instructions } = recipeInfo.rows[0]

  const res = await pool.query(
    `SELECT
      i.id AS ingredient_id,
      i.name,
      ri.quantity,
      ri.unit
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN ingredients i ON i.id = ri.ingredient_id
    WHERE r.id = $1; 
    `, [recipeId])
  
  return {
    title: title,
    instructions: instructions,
    ingredients: res.rows.map(row => ({
      id: row.ingredient_id,
      name: row.name,
      quantity: row.quantity,
      unit: row.unit
    }))
  }
}
