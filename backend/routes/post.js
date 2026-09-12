import * as db from '../db.js'

function normalizeIngredientName(value) {
  return value?.trim()
}

export default function registerPostRoutes(fastify) {
  fastify.post('/recipes/new', async (req, reply) => {
    const { title, instructions, ingredients } = req.body
    const dbClient = await db.pool.connect()

    try {

      const recipeId = db.insertRecipe(title, instructions);

      for (const ingredient of ingredients) {
        const ingredientName = normalizeIngredientName(ingredient.name)
        if (!ingredientName) {
          continue
        }

        // const ingredientId = await dbClient.query(
        //   `INSERT INTO ingredients (name)
        //    VALUES ($1)
        //    ON CONFLICT (name)
        //    DO UPDATE SET name = EXCLUDED.name
        //    RETURNING id`,
        //   [ingredientName]
        // ).rows[0].id
        const ingredientId = await db.insertIngredient(ingredientName); 

        // const ingredientId = ingredientRes.rows[0].id


        await dbClient.query(
          `INSERT INTO recipe_ingredients
           (recipe_id, ingredient_id, quantity, unit)
           VALUES ($1, $2, $3, $4)`,
          [recipeId, ingredientId, ingredient.quantity, ingredient.unit]
        )
      }

      await dbClient.query('COMMIT')
      reply.code(201).send()
    } catch (error) {
      await dbClient.query('ROLLBACK')
      reply.code(500).send({ error: error.message })
    } finally {
      dbClient.release()
    }
  })
}
