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

export async function getMatchingTags(searchTerm, limit) {
  return getMatchingThings('tags', 'name', searchTerm, limit)
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
  const total_count = res.rows.length > 0 ? res.rows[0].total_count : 0
  return {
    recipes: res.rows.map(({ total, ...recipe }) => recipe),
    totalPages: Math.ceil(total_count / pageSize)
  }
}


async function getRecipeInfo(client, recipeId) {
  const res = await client.query(
    `SELECT title, description FROM recipes WHERE recipe_id = $1`,
    [recipeId]
  )

  if (res.rows.length === 0) {
    return null;
  }

  return res.rows[0];
}


async function getRecipeInstructions(client, recipeId) {
  const res = await client.query(
    `SELECT text
     FROM recipe_instructions
     WHERE recipe_id = $1
     ORDER BY step;
    `,
    [recipeId]
  );
  return res.rows;
}


async function getRecipeIngredients(pool, recipeId) {
  const res = await pool.query(
    `SELECT
      ingredient_id,
      name,
      quantity,
      unit
    FROM recipes
    JOIN recipe_ingredients USING (recipe_id)
    JOIN ingredients USING (ingredient_id)
    WHERE recipe_id = $1;
    `,
    [recipeId]
  );
  return res.rows.map(row => ({
     id: row.ingredient_id,
     name: row.name,
     quantity: row.quantity,
     unit: row.unit
   }));
}

async function getRecipeTags(client, recipeId) {
  const res = await client.query(
    `SELECT tag_id, name
     FROM recipe_tags
     JOIN tags USING (tag_id)
     WHERE recipe_id = $1;
    `,
    [recipeId]
  );
  return res.rows;
}

export async function getOneRecipePage(client, recipeId) {
  const recipeInfo  = await getRecipeInfo(client, recipeId);

  if (!recipeInfo) {
   return null;
  }

  const { title, description } = recipeInfo;
  const instructions = await getRecipeInstructions(client, recipeId);
  const ingredients = await getRecipeIngredients(pool, recipeId);
  const tags = await getRecipeTags(client, recipeId);

  return {
    title: title,
    description: description,
    ingredients: ingredients,
    instructions: instructions,
    tags: tags
  }
}
