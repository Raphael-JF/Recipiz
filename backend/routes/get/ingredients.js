import * as db from '../../db.js'

export default function registerIngredientGetRoutes(fastify) {
  // fastify.get('/recipes', async (request, reply) => {
  //   const search = request.query.search ?? ''
  //   const page = Number(request.query.page ?? 1)
  //
  //   const pageSize = 10
  //
  //   const res = await db.getRecipesPage(
  //     search,
  //     page,
  //     pageSize
  //   )
  //
  //   return res
  // })
  // fastify.get('/ingredients', async () => {
  //   const result = await db.pool.query(
  //     'SELECT id, name FROM ingredients ORDER BY name ASC'
  //   )
  //
  //   return result.rows
  // })

  fastify.get('/ingredients/:id', async (request, reply) => {
    const { id } = request.params

    const result = await db.pool.query(
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
