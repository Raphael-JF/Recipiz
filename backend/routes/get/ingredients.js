import {getMatchingIngredients} from '../../db/accessing.js'
import * as utils from '../../utils.js'

export default function registerIngredientGetRoutes(fastify) {

  fastify.get('/matchingIngredients', async (request) => {
    const suggestionIngredients = request.query.suggestionSearch
    return await getMatchingIngredients(suggestionIngredients, utils.NUM_INGREDIENT_SUGGESTIONS)
  })


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
