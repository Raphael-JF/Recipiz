import pool from '../db.js'

export default function registerGetRoutes(fastify) {
  fastify.get('/recipes', async () => {
    const result = await pool.query('SELECT * FROM recipes ORDER BY id')
    return result.rows
  })

  fastify.get('/recipes/:id', async (request, reply) => {
    const { id } = request.params

    const result = await pool.query(
      `SELECT
        r.id,
        r.title,
        r.instructions,
        COALESCE(
          json_agg(
            json_build_object(
              'id', i.id,
              'name', i.name,
              'quantity', ri.quantity,
              'unit', ri.unit
            )
          ) FILTER (WHERE i.id IS NOT NULL),
          '[]'::json
        ) AS ingredients
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
      LEFT JOIN ingredients i ON i.id = ri.ingredient_id
      WHERE r.id = $1
      GROUP BY r.id;`,
      [id]
    )

    if (result.rows.length === 0) {
      reply.code(404)
      return { error: 'Recipe not found' }
    }

    return result.rows[0]
  })

  fastify.get('/ingredients', async () => {
    const result = await pool.query('SELECT id, name FROM ingredients ORDER BY name ASC')
    return result.rows
  })

  fastify.get('/ingredients/:id', async (request, reply) => {
    const { id } = request.params

    const result = await pool.query(
      `SELECT
        i.id,
        i.name,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', r.id,
              'title', r.title
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'::json
        ) AS recipes
      FROM ingredients i
      LEFT JOIN recipe_ingredients ri ON ri.ingredient_id = i.id
      LEFT JOIN recipes r ON r.id = ri.recipe_id
      WHERE i.id = $1
      GROUP BY i.id;`,
      [id]
    )

    if (result.rows.length === 0) {
      reply.code(404)
      return { error: 'Ingredient not found' }
    }

    return result.rows[0]
  })
}
