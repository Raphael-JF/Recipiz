import pool from '../db.js'

function normalizeIngredientName(value) {
  return value?.trim()
}

export default function registerPostRoutes(fastify) {
  fastify.post('/recipes/new', async (req, reply) => {
    const { title, instructions, ingredients } = req.body
    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const recipeRes = await client.query(
        'INSERT INTO recipes (title, instructions) VALUES ($1, $2) RETURNING *',
        [title, instructions]
      )
      const recipeId = recipeRes.rows[0].id

      for (const ingredient of ingredients) {
        const ingredientName = normalizeIngredientName(ingredient.name)
        if (!ingredientName) {
          continue
        }

        const ingredientRes = await client.query(
          `INSERT INTO ingredients (name)
           VALUES ($1)
           ON CONFLICT (name)
           DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [ingredientName]
        )

        const ingredientId = ingredientRes.rows[0].id

        await client.query(
          `INSERT INTO recipe_ingredients
           (recipe_id, ingredient_id, quantity, unit)
           VALUES ($1, $2, $3, $4)`,
          [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
        )
      }

      await client.query('COMMIT')
      reply.code(201).send(recipeRes.rows[0])
    } catch (error) {
      await client.query('ROLLBACK')
      reply.code(500).send({ error: error.message })
    } finally {
      client.release()
    }
  })
}
