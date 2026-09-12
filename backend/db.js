import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
  user: process.env.RECIPIZ_DB_USER ?? 'recipiz',
  host: process.env.RECIPIZ_DB_HOST ?? 'localhost',
  database: process.env.RECIPIZ_DB_NAME ?? 'recipiz',
  password: process.env.RECIPIZ_DB_PASSWORD,
  port: Number(process.env.RECIPIZ_DB_PORT ?? 5432)
})

// Returns the id of the created recipe
export async function insertRecipe(title, instructions) { 
  const dbClient = await  pool.connect()

  try {
    const recipeRes = await dbClient.query (
      'INSERT INTO recipes (title, instructions) VALUES ($1, $2) RETURNING recipes.id',
      [title, instructions]
    )
    return recipeRes.rows[0].id

  } finally {
    dbClient.release()
  }
}

// Returns the ID of the created ingredient. If the ingredient already exists, it returns the existing ID.
export async function insertIngredient(ingredientName) {
  const dbClient = await pool.connect()

  try  {
    const ingredientRes = await dbClient.query(
      `INSERT INTO ingredients (name)
       VALUES ($1)
       ON CONFLICT (name)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [ingredientName]
    )
    console.log(ingredientRes.rows[0].id)
    return ingredientRes.rows[0].id
  } finally {
    dbClient.release()
  }
}
