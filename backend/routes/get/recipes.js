import * as db from '../../db.js'

export default function registerRecipeGetRoutes(fastify) {

  fastify.get('/recipes', async () => {
    const result = await db.pool.query(
      'SELECT * FROM recipes ORDER BY id'
    )

    return result.rows
  })

  fastify.get('/recipes/:id', async (request, reply) => {
    const { id } = request.params

    const result = await db.pool.query(
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
}
